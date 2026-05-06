import { Router } from 'express';
import { productsController } from '../controllers/products.controller';
import { requireAuth, requireRole } from '../middleware/auth';

export const productsRouter = Router();

productsRouter.get('/', productsController.list);
productsRouter.get('/:id', productsController.getById);
productsRouter.post('/', requireAuth, requireRole('ADMIN'), productsController.create);
productsRouter.put('/:id', requireAuth, requireRole('ADMIN'), productsController.update);
productsRouter.delete('/:id', requireAuth, requireRole('ADMIN'), productsController.remove);
