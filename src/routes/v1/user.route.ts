import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import userValidation from '../../validations/user.validation';
import userController from '../../controllers/user.controller';

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), userController.createUser)
  .get(auth('getUsers'), userController.getUsers);

router.get('/me', auth(), userController.getMe);
router.patch('/me', auth(), validate(userValidation.updateMe), userController.updateMe);

router
  .route('/:userId')
  .get(auth('getUsers'), userController.getUser)
  .patch(auth('manageUsers'), userController.updateUser)
  .delete(auth('manageUsers'), userController.deleteUser);

export default router;
