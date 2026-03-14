import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null }

    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { booking_id, action } = await request.json()
    if (!booking_id || !action) return NextResponse.json({ error: 'booking_id and action required' }, { status: 400 })

    const admin = await createAdminClient()

    if (action === 'cancel') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any).from('bookings').update({ status: 'cancelled' }).eq('id', booking_id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any).from('payments').update({ status: 'refunded' }).eq('booking_id', booking_id).eq('status', 'held')
    } else if (action === 'dispute') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any).from('bookings').update({ status: 'disputed' }).eq('id', booking_id)
    } else if (action === 'resolve') {
      // Mark booking completed and release payment
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any).from('bookings').update({ status: 'completed' }).eq('id', booking_id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (admin as any)
        .from('payments')
        .update({ status: 'released', released_at: new Date().toISOString() })
        .eq('booking_id', booking_id)
        .eq('status', 'held')
    } else {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin booking action error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
