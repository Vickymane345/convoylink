import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/services/paymentService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('booking_id')

    if (!bookingId) {
      return NextResponse.redirect(new URL('/dashboard/bookings', request.url))
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // Fetch booking + payment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: booking } = await (supabase as any)
      .from('bookings')
      .select('*, payment:payments(*)')
      .eq('id', bookingId)
      .eq('customer_id', user.id)
      .single() as {
        data: {
          id: string
          service_type: string
          pickup_location: string
          dropoff_location: string
          total_amount: number
          platform_fee: number
          provider_amount: number
          status: string
          payment: {
            id: string
            status: string
            stripe_session_id: string | null
          } | null
        } | null
      }

    if (!booking) {
      return NextResponse.redirect(new URL('/dashboard/bookings', request.url))
    }

    // Don't create duplicate session if already paid
    if (booking.payment?.status === 'held' || booking.payment?.status === 'released') {
      return NextResponse.redirect(new URL('/dashboard/bookings', request.url))
    }

    // If there's already a valid pending session, redirect to it
    if (booking.payment?.stripe_session_id) {
      const existingSession = await (await import('@/lib/stripe/client')).stripe.checkout.sessions.retrieve(
        booking.payment.stripe_session_id,
      )
      if (existingSession.status === 'open' && existingSession.url) {
        return NextResponse.redirect(existingSession.url)
      }
    }

    const origin = new URL(request.url).origin
    const serviceDesc = `${booking.service_type.charAt(0).toUpperCase() + booking.service_type.slice(1)} service: ${booking.pickup_location} → ${booking.dropoff_location}`

    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single() as { data: { email: string; full_name: string } | null }

    const session = await createCheckoutSession({
      bookingId,
      amount: booking.total_amount,
      currency: 'NGN',
      customerId: user.id,
      customerEmail: profileData?.email ?? user.email ?? '',
      serviceDescription: serviceDesc,
      successUrl: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancelUrl: `${origin}/payment/cancelled?booking_id=${bookingId}`,
      metadata: {
        booking_id: bookingId,
        customer_id: user.id,
        service_type: booking.service_type,
      },
    })

    // Store session ID in payment record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('payments')
      .update({ stripe_session_id: session.id })
      .eq('booking_id', bookingId)

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }

    return NextResponse.redirect(session.url)
  } catch (err) {
    console.error('Checkout session error:', err)
    return NextResponse.redirect(new URL('/dashboard/bookings?error=payment_failed', request.url))
  }
}
