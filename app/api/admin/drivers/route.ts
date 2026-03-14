import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

const VALID_STATUSES = ['approved', 'rejected', 'suspended', 'pending']

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

    const { driver_id, verification_status } = await request.json()
    if (!driver_id || !verification_status) {
      return NextResponse.json({ error: 'driver_id and verification_status required' }, { status: 400 })
    }
    if (!VALID_STATUSES.includes(verification_status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const admin = await createAdminClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: driver } = await (admin as any)
      .from('drivers')
      .select('user_id')
      .eq('id', driver_id)
      .single() as { data: { user_id: string } | null }

    if (!driver) return NextResponse.json({ error: 'Driver not found' }, { status: 404 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any)
      .from('drivers')
      .update({ verification_status })
      .eq('id', driver_id)

    // Notify driver
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any).from('notifications').insert({
      user_id: driver.user_id,
      type: 'booking_confirmed',
      title: verification_status === 'approved' ? 'Application Approved' : verification_status === 'rejected' ? 'Application Rejected' : 'Account Suspended',
      body: verification_status === 'approved'
        ? 'Congratulations! Your driver application has been approved. You can now receive assignments.'
        : verification_status === 'rejected'
        ? 'Your driver application was not approved at this time. Please contact support for details.'
        : 'Your driver account has been suspended. Please contact support.',
      data: { driver_id },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Driver verification error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
