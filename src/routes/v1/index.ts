import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import productRoute from './product.route';
import categoryRoute from './category.route';
import uploadRoute from './upload.route';
import orderRoute from './order.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/app',
    route: uploadRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
