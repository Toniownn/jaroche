import { Router } from 'express';
import { authRouter } from './auth.routes';
import { productsRouter } from './products.routes';
import { cartRouter } from './cart.routes';
import { ordersRouter } from './orders.routes';
import { usersRouter } from './users.routes';
import { stripeRouter } from './stripe.routes';

export const router = Router();

router.use('/auth', authRouter);
router.use('/products', productsRouter);
router.use('/cart', cartRouter);
router.use('/orders', ordersRouter);
router.use('/users', usersRouter);
router.use('/stripe', stripeRouter);
