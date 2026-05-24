import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { orderService } from '../services';

const createCheckoutSession = catchAsync(async (req, res) => {
  const { items } = req.body;
  const user = req.user as any;
  const userId = user.id;
  const result = await orderService.createCheckoutSession(userId, items);
  res.status(httpStatus.CREATED).send(result);
});

const confirmOrder = catchAsync(async (req, res) => {
  const {
    items,
    shippingAddress,
    shippingCity,
    shippingPostalCode,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
  } = req.body;
  const user = req.user as any;
  const userId = user.id;
  const order = await orderService.confirmOrder(
    userId,
    items,
    {
      address: shippingAddress,
      city: shippingCity,
      postalCode: shippingPostalCode,
    },
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature
  );
  res.send({ message: 'Order confirmed successfully', order });
});

const getOrders = catchAsync(async (req, res) => {
  const user = req.user as any;
  const userId = user.id;
  const orders = await orderService.getOrders(userId);
  res.send(orders);
});

export default {
  createCheckoutSession,
  confirmOrder,
  getOrders,
};
