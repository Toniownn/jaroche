import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { requireAuth } from '../middleware/auth';

export const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.get('/', cartController.getCart);
cartRouter.post('/items', cartController.addItem);
cartRouter.patch('/items/:id', cartController.updateItem);
cartRouter.delete('/items/:id', cartController.removeItem);
cartRouter.delete('/', cartController.clearCart);
