import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import type { CreateBookingInput } from '@/services/bookingService'

// POST /api/bookings — create a new booking
export async function POST(request: Request) {
  try {
    // Use auth check via regular client first
    const { createClient } = await import('@/lib/supabase/server')
    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body: CreateBookingInput = await request.json()
    if (body.customer_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Use admin client to bypass RLS for inserts
    const supabase = await createAdminClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: booking, error: bookingError } = await (supabase as any)
      .from('bookings')
      .insert({
        customer_id: body.customer_id,
        service_type: body.service_type,
        service_id: body.service_id,
        driver_id: body.driver_id ?? null,
        status: 'pending',
        pickup_location: body.pickup_location,
        pickup_lat: body.pickup_lat ?? null,
        pickup_lng: body.pickup_lng ?? null,
        dropoff_location: body.dropoff_location,
        dropoff_lat: body.dropoff_lat ?? null,
        dropoff_lng: body.dropoff_lng ?? null,
        scheduled_at: body.scheduled_at,
        total_amount: body.total_amount,
        platform_fee: body.platform_fee,
        provider_amount: body.provider_amount,
        notes: body.notes ?? null,
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking insert error:', bookingError)
      return NextResponse.json({ error: bookingError.message }, { status: 500 })
    }

    const bookingId = (booking as { id: string }).id

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('payments').insert({
      booking_id: bookingId,
      customer_id: body.customer_id,
      provider_id: body.provider_id,
      amount: body.total_amount,
      currency: 'NGN',
      platform_fee: body.platform_fee,
      provider_amount: body.provider_amount,
      status: 'pending',
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('notifications').insert({
      user_id: body.customer_id,
      type: 'booking_confirmed',
      title: 'Booking Created',
      body: `Your ${body.service_type} booking has been created and is pending confirmation.`,
      data: { booking_id: bookingId },
    })

    return NextResponse.json({ data: booking, success: true }, { status: 201 })
  } catch (err) {
    console.error('Booking creation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('bookings')
    .select('*, payment:payments(*)')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, success: true })
}
