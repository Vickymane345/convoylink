import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * POST /api/messages
 * Send a message in a booking thread.
 * Only the booking's customer, provider, or assigned driver may send.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { booking_id, content } = await request.json()
    if (!booking_id || !content?.trim()) {
      return NextResponse.json({ error: 'booking_id and content required' }, { status: 400 })
    }
    if (content.length > 2000) {
      return NextResponse.json({ error: 'Message too long (max 2000 chars)' }, { status: 400 })
    }

    const admin = await createAdminClient()

    // Verify the user is a participant in this booking
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: booking } = await (admin as any)
      .from('bookings')
      .select('id, customer_id, provider_id, driver_id, status')
      .eq('id', booking_id)
      .single() as {
        data: {
          id: string
          customer_id: string
          provider_id: string | null
          driver_id: string | null
          status: string
        } | null
      }

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    const isParticipant = [booking.customer_id, booking.provider_id, booking.driver_id].includes(user.id)
    if (!isParticipant) {
      return NextResponse.json({ error: 'Forbidden — you are not part of this booking' }, { status: 403 })
    }

    if (['cancelled', 'completed'].includes(booking.status)) {
      return NextResponse.json({ error: 'Cannot message on a closed booking' }, { status: 400 })
    }

    // Insert message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: message, error } = await (admin as any)
      .from('messages')
      .insert({
        booking_id,
        sender_id: user.id,
        content: content.trim(),
      })
      .select('*, sender:user_profiles(id, full_name, avatar_url, role)')
      .single()

    if (error) throw error

    return NextResponse.json({ message })
  } catch (err) {
    console.error('Message send error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/messages
 * Mark all messages in a booking thread as read for the current user.
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { booking_id } = await request.json()
    if (!booking_id) return NextResponse.json({ error: 'booking_id required' }, { status: 400 })

    const admin = await createAdminClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any)
      .from('messages')
      .update({ is_read: true })
      .eq('booking_id', booking_id)
      .neq('sender_id', user.id)
      .eq('is_read', false)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Mark read error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
