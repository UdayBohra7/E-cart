import express from 'express';
import auth from '../../middlewares/auth';
import productController from '../../controllers/product.controller';

const router = express.Router();

router
  .route('/')
  .post(auth('manageProducts'), productController.createProduct)
  .get(productController.getProducts);

router
  .route('/:productId')
  .get(productController.getProduct)
  .patch(auth('manageProducts'), productController.updateProduct)
  .delete(auth('manageProducts'), productController.deleteProduct);

export default router;
