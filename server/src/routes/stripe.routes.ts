import { Router } from 'express';
import { stripeController } from '../controllers/stripe.controller';
import { requireAuth } from '../middleware/auth';

export const stripeRouter = Router();

// Webhook is mounted directly in app.ts (raw body), so it does NOT belong here.
stripeRouter.post('/checkout', requireAuth, stripeController.createCheckoutSession);
