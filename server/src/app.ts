import express, { type Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { stripeWebhookHandler } from './controllers/stripe.controller';
import { router } from './routes';
import { errorMiddleware } from './middleware/error';
import { notFoundMiddleware } from './middleware/notFound';

export function buildApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );

  // Stripe webhook needs the raw body for signature verification.
  // It MUST be mounted before express.json() so the JSON parser doesn't consume the body first.
  app.post(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    stripeWebhookHandler
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.get('/health', (_req, res) => {
    res.json({ ok: true, name: 'jaroche-server', env: env.NODE_ENV });
  });

  app.use('/api', router);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
