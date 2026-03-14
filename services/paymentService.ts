import { stripe } from '@/lib/stripe/client'
import type Stripe from 'stripe'

export interface CreateCheckoutInput {
  bookingId: string
  amount: number          // in kobo (NGN smallest unit) — Stripe uses smallest currency unit
  currency: string
  customerId: string
  customerEmail: string
  serviceDescription: string
  successUrl: string
  cancelUrl: string
  metadata: Record<string, string>
}

/**
 * Creates a Stripe Checkout session.
 * NGN → Stripe accepts NGN but requires amount in kobo (×100).
 * We store amounts in full NGN in our DB, so multiply ×100 for Stripe.
 */
export async function createCheckoutSession(input: CreateCheckoutInput): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: input.customerEmail,
    line_items: [
      {
        price_data: {
          currency: input.currency.toLowerCase(),
          product_data: {
            name: 'ConvoyLink Booking',
            description: input.serviceDescription,
          },
          unit_amount: input.amount * 100, // NGN to kobo
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      // capture_method: 'manual' would give true escrow,
      // but for simplicity we capture immediately and track release in DB
      metadata: input.metadata,
    },
    metadata: input.metadata,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
  })

  return session
}

/**
 * Constructs and verifies a Stripe webhook event.
 */
export function constructWebhookEvent(
  payload: string,
  signature: string,
  secret: string,
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}

/**
 * Transfer funds to provider's Stripe connected account.
 * Used when escrow is released after trip completion.
 */
export async function transferToProvider(
  stripeAccountId: string,
  amountNgn: number,
  currency: string,
  description: string,
  metadata: Record<string, string>,
): Promise<Stripe.Transfer> {
  return stripe.transfers.create({
    amount: amountNgn * 100,
    currency: currency.toLowerCase(),
    destination: stripeAccountId,
    description,
    metadata,
  })
}

/**
 * Issue a refund on a payment intent.
 */
export async function refundPayment(
  paymentIntentId: string,
  amountNgn?: number,
): Promise<Stripe.Refund> {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    ...(amountNgn ? { amount: amountNgn * 100 } : {}),
  })
}
