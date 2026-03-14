import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * POST /api/tracking
 * Inserts a tracking location for an active convoy trip.
 * Only the assigned driver for the trip may post locations.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { trip_id, latitude, longitude, heading, speed, accuracy } = body

    if (!trip_id || latitude == null || longitude == null) {
      return NextResponse.json({ error: 'trip_id, latitude, longitude required' }, { status: 400 })
    }

    const admin = await createAdminClient()

    // Verify trip exists and this user is the assigned driver
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: trip } = await (admin as any)
      .from('convoy_trips')
      .select('id, driver_id, status')
      .eq('id', trip_id)
      .single() as { data: { id: string; driver_id: string; status: string } | null }

    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    if (trip.driver_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden — you are not assigned to this trip' }, { status: 403 })
    }
    if (!['en_route', 'in_progress'].includes(trip.status)) {
      return NextResponse.json({ error: 'Trip is not active' }, { status: 400 })
    }

    // Insert location
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: location, error } = await (admin as any)
      .from('tracking_locations')
      .insert({
        trip_id,
        driver_id: user.id,
        latitude,
        longitude,
        heading: heading ?? null,
        speed: speed ?? null,
        accuracy: accuracy ?? null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, location })
  } catch (err) {
    console.error('Tracking error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/tracking?trip_id=xxx
 * Returns last 50 locations for a trip (for initial load).
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const trip_id = searchParams.get('trip_id')
    if (!trip_id) return NextResponse.json({ error: 'trip_id required' }, { status: 400 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: locations } = await (supabase as any)
      .from('tracking_locations')
      .select('*')
      .eq('trip_id', trip_id)
      .order('recorded_at', { ascending: false })
      .limit(50)

    return NextResponse.json({ locations: (locations ?? []).reverse() })
  } catch (err) {
    console.error('Tracking GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
