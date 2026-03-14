import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * POST /api/payments/release
 * Releases escrow payment to provider after trip completion.
 * Can be triggered by: admin, automatic after booking status = completed.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify caller is admin or the booking's customer
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null }

    const { booking_id } = await request.json()
    if (!booking_id) return NextResponse.json({ error: 'booking_id required' }, { status: 400 })

    const admin = await createAdminClient()

    // Fetch booking + payment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: payment } = await (admin as any)
      .from('payments')
      .select('*, booking:bookings(*)')
      .eq('booking_id', booking_id)
      .single() as {
        data: {
          id: string
          booking_id: string
          customer_id: string
          provider_id: string
          amount: number
          provider_amount: number
          currency: string
          status: string
          stripe_payment_intent_id: string | null
          booking: { status: string; customer_id: string }
        } | null
      }

    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })

    // Only customer or admin can release
    const isCustomer = payment.customer_id === user.id
    const isAdmin = profile?.role === 'admin'
    if (!isCustomer && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Must be in 'held' state
    if (payment.status !== 'held') {
      return NextResponse.json({
        error: `Cannot release payment with status: ${payment.status}`
      }, { status: 400 })
    }

    // Update payment → released
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any)
      .from('payments')
      .update({
        status: 'released',
        released_at: new Date().toISOString(),
      })
      .eq('id', payment.id)

    // Mark booking as completed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any)
      .from('bookings')
      .update({ status: 'completed' })
      .eq('id', booking_id)

    // Notify provider
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any).from('notifications').insert({
      user_id: payment.provider_id,
      type: 'payment_released',
      title: 'Payment Released',
      body: `₦${payment.provider_amount.toLocaleString()} has been released to your account for booking ${booking_id.slice(0, 8).toUpperCase()}.`,
      data: { booking_id, amount: payment.provider_amount },
    })

    // Notify customer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any).from('notifications').insert({
      user_id: payment.customer_id,
      type: 'payment_released',
      title: 'Trip Completed',
      body: 'Your trip is complete and payment has been released to the provider. Please leave a review!',
      data: { booking_id },
    })

    console.log(`✅ Escrow released for booking ${booking_id} — ₦${payment.provider_amount}`)

    return NextResponse.json({
      success: true,
      released_amount: payment.provider_amount,
      booking_id,
    })
  } catch (err) {
    console.error('Release error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
