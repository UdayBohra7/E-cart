import express from 'express';
import auth from '../../middlewares/auth';
import categoryController from '../../controllers/category.controller';

const router = express.Router();

router
  .route('/')
  .post(auth('manageCategories'), categoryController.createCategory)
  .get(categoryController.getCategories);

router
  .route('/:categoryId')
  .get(categoryController.getCategory)
  .patch(auth('manageCategories'), categoryController.updateCategory)
  .delete(auth('manageCategories'), categoryController.deleteCategory);

export default router;
