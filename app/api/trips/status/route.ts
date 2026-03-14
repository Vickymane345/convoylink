import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

const VALID_STATUSES = ['en_route', 'in_progress', 'completed', 'cancelled']

/**
 * PATCH /api/trips/status
 * Driver updates their convoy trip status.
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { trip_id, status } = await request.json()

    if (!trip_id || !status) {
      return NextResponse.json({ error: 'trip_id and status required' }, { status: 400 })
    }
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 })
    }

    const admin = await createAdminClient()

    // Verify this driver owns the trip
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: trip } = await (admin as any)
      .from('convoy_trips')
      .select('id, driver_id, status, booking_id')
      .eq('id', trip_id)
      .single() as { data: { id: string; driver_id: string; status: string; booking_id: string } | null }

    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    if (trip.driver_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update trip status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any)
      .from('convoy_trips')
      .update({ status, ...(status === 'completed' ? { ended_at: new Date().toISOString() } : {}) })
      .eq('id', trip_id)

    // Sync booking status
    const bookingStatusMap: Record<string, string> = {
      en_route:    'confirmed',
      in_progress: 'in_progress',
      completed:   'in_progress', // payment release sets final 'completed'
      cancelled:   'cancelled',
    }
    const bookingStatus = bookingStatusMap[status]
    if (bookingStatus) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any)
        .from('bookings')
        .update({ status: bookingStatus })
        .eq('id', trip.booking_id)
    }

    return NextResponse.json({ success: true, trip_id, status })
  } catch (err) {
    console.error('Trip status update error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
