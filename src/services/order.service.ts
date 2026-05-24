import { PrismaClient, Order, OrderStatus } from '@prisma/client';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import config from '../config/config';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const prisma = new PrismaClient();
const razorpayKeyId = config.razorpay.keyId || 'rzp_test_placeholder';
const razorpayKeySecret = config.razorpay.keySecret || 'placeholder_secret';
const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

interface CheckoutItem {
  productId: number;
  quantity: number;
}

/**
 * Create checkout session (Razorpay Order) and PENDING order
 * @param {number} userId
 * @param {CheckoutItem[]} items
 * @param {object} shippingInfo
 * @returns {Promise<any>}
 */
const createCheckoutSession = async (
  userId: number,
  items: CheckoutItem[],
  shippingInfo: { address: string; city: string; postalCode: string }
) => {
  const productIds = items.map((item) => item.productId);

  // 1. Resolve products and calculate actual total from database prices
  const dbProducts = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
  });

  if (dbProducts.length !== items.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'One or more products in cart do not exist');
  }

  let totalAmount = 0;
  const orderItemsData = items.map((item) => {
    const product = dbProducts.find((p) => p.id === item.productId)!;
    if (product.stock < item.quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Product ${product.name} has insufficient stock`);
    }
    const price = Number(product.price);
    totalAmount += price * item.quantity;
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
    };
  });

  // 2. Create Order in database in PENDING status
  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      status: OrderStatus.PENDING,
      shippingAddress: shippingInfo.address,
      shippingCity: shippingInfo.city,
      shippingPostalCode: shippingInfo.postalCode,
      items: {
        create: orderItemsData.map((oi) => ({
          productId: oi.productId,
          quantity: oi.quantity,
          price: oi.price,
        })),
      },
    },
  });

  // 3. Create Razorpay Order
  let rzpOrder: any;
  try {
    rzpOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // in paise (for INR)
      currency: 'INR',
      receipt: `receipt_order_${order.id}`,
    });
  } catch (error: any) {
    // If Razorpay fails, delete the pending order
    await prisma.order.delete({ where: { id: order.id } });
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Razorpay Order creation failed: ${error.message}`);
  }

  // 4. Update the order with razorpayOrderId
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      razorpayOrderId: rzpOrder.id,
    },
  });

  return {
    orderId: updatedOrder.id,
    razorpayOrderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
  };
};

/**
 * Confirm payment and update order status by verifying signature
 * @param {number} userId
 * @param {number} orderId
 * @param {string} razorpayPaymentId
 * @param {string} razorpayOrderId
 * @param {string} razorpaySignature
 * @returns {Promise<Order>}
 */
const confirmOrder = async (
  userId: number,
  orderId: number,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
) => {
  // 1. Find the order
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  if (order.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to confirm this order');
  }

  if (order.status !== OrderStatus.PENDING) {
    return order; // Already confirmed
  }

  // 2. Verify signature securely
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment signature verification failed. Possible fraud.');
  }

  // 3. Payment succeeded: update order status to PROCESSING and deduct stock in a transaction
  const updatedOrder = await prisma.$transaction(async (tx) => {
    // Deduct stock for each item
    for (const item of order.items) {
      const currentStock = item.product.stock;
      if (currentStock < item.quantity) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for product ${item.product.name} to complete order.`
        );
      }
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    // Update order status and save payment ID
    return tx.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PROCESSING,
        razorpayPaymentId: razorpayPaymentId,
      },
    });
  });

  return updatedOrder;
};

export default {
  createCheckoutSession,
  confirmOrder,
};
