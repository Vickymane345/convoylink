import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
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

    const admin = await createAdminClient()

    // Run all counts in parallel
    const [
      { count: totalUsers },
      { count: totalDrivers },
      { count: totalBookings },
      { count: activeTrips },
      { count: pendingVerifications },
      { data: revenueData },
      { data: recentBookings },
    ] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (admin as any).from('user_profiles').select('*', { count: 'exact', head: true }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (admin as any).from('drivers').select('*', { count: 'exact', head: true }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (admin as any).from('bookings').select('*', { count: 'exact', head: true }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (admin as any).from('convoy_trips').select('*', { count: 'exact', head: true }).in('status', ['en_route', 'in_progress']),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (admin as any).from('drivers').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (admin as any).from('payments').select('platform_fee').eq('status', 'released'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (admin as any).from('bookings')
        .select('id, service_type, status, total_amount, created_at, customer:user_profiles!customer_id(full_name)')
        .order('created_at', { ascending: false })
        .limit(10),
    ])

    const totalRevenue = ((revenueData ?? []) as Array<{ platform_fee: number }>)
      .reduce((sum, p) => sum + p.platform_fee, 0)

    return NextResponse.json({
      totalUsers: totalUsers ?? 0,
      totalDrivers: totalDrivers ?? 0,
      totalBookings: totalBookings ?? 0,
      activeTrips: activeTrips ?? 0,
      pendingVerifications: pendingVerifications ?? 0,
      totalRevenue,
      recentBookings: recentBookings ?? [],
    })
  } catch (err) {
    console.error('Admin stats error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
