import { NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/services/paymentService'
import { createAdminClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

// Disable body parsing — Stripe needs the raw body for signature verification
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = constructWebhookEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  try {
    switch (event.type) {
      // ── Payment succeeded (funds captured) ─────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = session.metadata?.booking_id
        if (!bookingId) break

        const paymentIntentId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null

        // Update payment → held
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('payments')
          .update({
            status: 'held',
            stripe_payment_intent_id: paymentIntentId,
            stripe_session_id: session.id,
            paid_at: new Date().toISOString(),
          })
          .eq('booking_id', bookingId)

        // Update booking → confirmed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: booking } = await (supabase as any)
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', bookingId)
          .select('customer_id, service_type')
          .single() as { data: { customer_id: string; service_type: string } | null }

        // Notify customer
        if (booking) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from('notifications').insert({
            user_id: booking.customer_id,
            type: 'payment_held',
            title: 'Payment Confirmed',
            body: `Your payment has been received and held in escrow. Your ${booking.service_type} booking is confirmed.`,
            data: { booking_id: bookingId },
          })
        }

        console.log(`[OK] Payment held for booking ${bookingId}`)
        break
      }

      // ── Payment failed ──────────────────────────────────────────────────────
      case 'checkout.session.expired':
      case 'payment_intent.payment_failed': {
        const obj = event.data.object as Stripe.Checkout.Session | Stripe.PaymentIntent
        const bookingId = obj.metadata?.booking_id
        if (!bookingId) break

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('payments')
          .update({ status: 'failed' })
          .eq('booking_id', bookingId)

        console.log(`[FAIL] Payment failed for booking ${bookingId}`)
        break
      }

      // ── Charge refunded ─────────────────────────────────────────────────────
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = typeof charge.payment_intent === 'string'
          ? charge.payment_intent
          : null

        if (!paymentIntentId) break

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('payments')
          .update({ status: 'refunded' })
          .eq('stripe_payment_intent_id', paymentIntentId)

        console.log(`[REFUND] Charge refunded for payment intent ${paymentIntentId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
