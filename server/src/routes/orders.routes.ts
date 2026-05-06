import { Router } from 'express';
import { ordersController } from '../controllers/orders.controller';
import { requireAuth, requireRole } from '../middleware/auth';

export const ordersRouter = Router();

ordersRouter.use(requireAuth);
ordersRouter.post('/', ordersController.create);
ordersRouter.get('/', ordersController.listOwn);
ordersRouter.get('/all', requireRole('ADMIN'), ordersController.listAll);
ordersRouter.get('/:id', ordersController.getById);
ordersRouter.put('/:id/status', requireRole('ADMIN'), ordersController.updateStatus);
