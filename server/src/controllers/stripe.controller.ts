import type { Request, Response, RequestHandler } from 'express';
import { asyncHandler, AppError } from '../utils/asyncHandler';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import {
  constructWebhookEvent,
  createCheckoutSession as createSession,
} from '../services/stripe.service';
import { markOrderPaid } from '../services/order.service';

export const stripeController = {
  createCheckoutSession: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const { orderId } = req.body as { orderId?: string };
    if (!orderId) throw new AppError(400, 'orderId is required');

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } }, user: true },
    });
    if (!order || order.userId !== userId) throw new AppError(404, 'Order not found');
    if (order.status !== 'PENDING') throw new AppError(409, 'Order is not pending');

    const session = await createSession({
      orderId: order.id,
      userEmail: order.user.email,
      successUrl: `${env.CLIENT_URL}/checkout/success?orderId=${order.id}`,
      cancelUrl: `${env.CLIENT_URL}/checkout/cancel?orderId=${order.id}`,
      lineItems: order.items.map((item) => ({
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        unitAmount: Math.round(Number(item.price) * 100),
        quantity: item.quantity,
      })),
    });

    res.json({ url: session.url, id: session.id });
  }),
};

/**
 * Webhook handler — mounted directly in app.ts with `express.raw(...)`,
 * BEFORE express.json(), so req.body is the raw Buffer Stripe needs.
 */
export const stripeWebhookHandler: RequestHandler = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  if (typeof signature !== 'string') {
    return res.status(400).send('Missing stripe-signature');
  }

  let event;
  try {
    event = constructWebhookEvent(req.body as Buffer, signature);
  } catch (err) {
    console.error('[stripe] webhook signature failed:', (err as Error).message);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as { id: string; metadata?: Record<string, string> };
      const orderId = session.metadata?.orderId;
      if (orderId) await markOrderPaid(orderId, session.id);
    }
    res.json({ received: true });
  } catch (err) {
    console.error('[stripe] handler error:', err);
    res.status(500).send('Webhook handler error');
  }
};
