import Stripe from 'stripe';
import { env } from '../config/env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

export interface CheckoutLineItem {
  name: string;
  imageUrl?: string;
  unitAmount: number; // cents
  quantity: number;
}

export async function createCheckoutSession(opts: {
  orderId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
  lineItems: CheckoutLineItem[];
}) {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: opts.userEmail,
    line_items: opts.lineItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: item.unitAmount,
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : undefined,
        },
      },
    })),
    metadata: { orderId: opts.orderId },
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
  });
}

export function constructWebhookEvent(rawBody: Buffer, signature: string) {
  return stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
}
