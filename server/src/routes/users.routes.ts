import { Router } from 'express';
import { usersController } from '../controllers/users.controller';
import { requireAuth, requireRole } from '../middleware/auth';

export const usersRouter = Router();

usersRouter.use(requireAuth);
usersRouter.get('/profile', usersController.getProfile);
usersRouter.put('/profile', usersController.updateProfile);
usersRouter.get('/', requireRole('ADMIN'), usersController.listAll);
usersRouter.get('/:id', requireRole('ADMIN'), usersController.getById);
