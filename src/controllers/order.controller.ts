import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { orderService } from '../services';

const createCheckoutSession = catchAsync(async (req, res) => {
  const { items, shippingAddress, shippingCity, shippingPostalCode } = req.body;
  const user = req.user as any;
  const userId = user.id;
  const result = await orderService.createCheckoutSession(userId, items, {
    address: shippingAddress,
    city: shippingCity,
    postalCode: shippingPostalCode,
  });
  res.status(httpStatus.CREATED).send(result);
});

const confirmOrder = catchAsync(async (req, res) => {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  const user = req.user as any;
  const userId = user.id;
  const order = await orderService.confirmOrder(
    userId,
    orderId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature
  );
  res.send({ message: 'Order confirmed successfully', order });
});

export default {
  createCheckoutSession,
  confirmOrder,
};
