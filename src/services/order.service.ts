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
 * Create checkout session (Razorpay Order)
 * @param {number} userId
 * @param {CheckoutItem[]} items
 * @returns {Promise<any>}
 */
const createCheckoutSession = async (
  userId: number,
  items: CheckoutItem[]
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
  for (const item of items) {
    const product = dbProducts.find((p) => p.id === item.productId)!;
    if (product.stock < item.quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Product ${product.name} has insufficient stock`);
    }
    const price = Number(product.price);
    totalAmount += price * item.quantity;
  }

  // 2. Create Razorpay Order
  let rzpOrder: any;
  try {
    rzpOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // in paise (for INR)
      currency: 'INR',
      receipt: `receipt_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    });
  } catch (error: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Razorpay Order creation failed: ${error.message}`);
  }

  return {
    razorpayOrderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
  };
};

/**
 * Confirm payment and update order status by verifying signature
 * @param {number} userId
 * @param {CheckoutItem[]} items
 * @param {object} shippingInfo
 * @param {string} razorpayPaymentId
 * @param {string} razorpayOrderId
 * @param {string} razorpaySignature
 * @returns {Promise<Order>}
 */
const confirmOrder = async (
  userId: number,
  items: CheckoutItem[],
  shippingInfo: { address: string; city: string; postalCode: string },
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
) => {
  // 1. Verify signature securely
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment signature verification failed. Possible fraud.');
  }

  // 2. Check if the order has already been created (Idempotency)
  const existingOrder = await prisma.order.findUnique({
    where: { razorpayOrderId },
    include: { items: { include: { product: true } } },
  });

  if (existingOrder) {
    if (existingOrder.userId !== userId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access this order');
    }
    return existingOrder;
  }

  // 3. Payment succeeded: check stock, deduct stock, and create Order inside a transaction
  const updatedOrder = await prisma.$transaction(async (tx) => {
    const productIds = items.map((item) => item.productId);
    const dbProducts = await tx.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    if (dbProducts.length !== items.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'One or more products in cart do not exist');
    }

    let totalAmount = 0;
    const orderItemsData = [];

    // Deduct stock for each item
    for (const item of items) {
      const product = dbProducts.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for product ${product.name} to complete order.`
        );
      }

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      const price = Number(product.price);
      totalAmount += price * item.quantity;
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create the Order in database in PROCESSING status
    return tx.order.create({
      data: {
        userId,
        totalAmount,
        status: OrderStatus.PROCESSING,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingPostalCode: shippingInfo.postalCode,
        razorpayOrderId,
        razorpayPaymentId,
        items: {
          create: orderItemsData.map((oi) => ({
            productId: oi.productId,
            quantity: oi.quantity,
            price: oi.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  });

  return updatedOrder;
};

/**
 * Get user orders with items and product details
 * @param {number} userId
 * @returns {Promise<Order[]>}
 */
const getOrders = async (userId: number): Promise<Order[]> => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export default {
  createCheckoutSession,
  confirmOrder,
  getOrders,
};
