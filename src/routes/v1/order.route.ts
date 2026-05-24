import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import orderValidation from '../../validations/order.validation';
import orderController from '../../controllers/order.controller';

const router = express.Router();

router.post('/checkout', auth(), validate(orderValidation.checkout), orderController.createCheckoutSession);
router.post('/confirm', auth(), validate(orderValidation.confirm), orderController.confirmOrder);
router.get('/', auth(), orderController.getOrders);

export default router;
