import { createAdminClient } from '@/lib/supabase/server'
import {
  Users, TruckIcon, CalendarCheck, Navigation,
  DollarSign, AlertTriangle, ShieldCheck, BarChart3,
} from 'lucide-react'
import { AdminStatCard } from '@/features/admin/AdminStatCard'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDateTime } from '@/utils/helpers'

export const metadata = { title: 'Admin Dashboard' }

type RecentBooking = {
  id: string
  service_type: string
  status: string
  total_amount: number
  created_at: string
  customer: { full_name: string } | null
}

export default async function AdminDashboardPage() {
  const admin = await createAdminClient()

  const [
    { count: totalUsers },
    { count: totalDrivers },
    { count: totalBookings },
    { count: activeTrips },
    { count: pendingVerifications },
    { count: disputedBookings },
    { data: revenueRows },
    { data: bookingsRaw },
    { data: pendingDriversRaw },
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
    (admin as any).from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'disputed'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (admin as any).from('payments').select('platform_fee').eq('status', 'released'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (admin as any).from('bookings')
      .select('id, service_type, status, total_amount, created_at, customer:user_profiles!customer_id(full_name)')
      .order('created_at', { ascending: false })
      .limit(8),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (admin as any).from('drivers')
      .select('id, user:user_profiles(full_name), license_number, created_at')
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const totalRevenue = ((revenueRows ?? []) as Array<{ platform_fee: number }>)
    .reduce((sum, p) => sum + p.platform_fee, 0)

  const recentBookings = (bookingsRaw ?? []) as RecentBooking[]

  type PendingDriver = { id: string; user: { full_name: string } | null; license_number: string; created_at: string }
  const pendingDrivers = (pendingDriversRaw ?? []) as PendingDriver[]

  const bookingStatusConfig: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
    pending:     'warning',
    confirmed:   'info',
    in_progress: 'info',
    completed:   'success',
    cancelled:   'secondary',
    disputed:    'danger',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-zinc-400 mt-1">Platform overview and key metrics</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          label="Total Users"
          value={totalUsers ?? 0}
          sub="All registered users"
          icon={<Users className="h-5 w-5 text-blue-400" />}
        />
        <AdminStatCard
          label="Active Drivers"
          value={totalDrivers ?? 0}
          sub={`${pendingVerifications ?? 0} pending review`}
          icon={<TruckIcon className="h-5 w-5 text-green-400" />}
          alert={(pendingVerifications ?? 0) > 0}
        />
        <AdminStatCard
          label="Total Bookings"
          value={totalBookings ?? 0}
          sub="All time"
          icon={<CalendarCheck className="h-5 w-5 text-purple-400" />}
        />
        <AdminStatCard
          label="Live Convoys"
          value={activeTrips ?? 0}
          sub="En route or in progress"
          icon={<Navigation className="h-5 w-5 text-orange-400" />}
          alert={(activeTrips ?? 0) > 0}
        />
        <AdminStatCard
          label="Platform Revenue"
          value={formatCurrency(totalRevenue)}
          sub="10% fee on released payments"
          icon={<DollarSign className="h-5 w-5 text-yellow-400" />}
        />
        <AdminStatCard
          label="Open Disputes"
          value={disputedBookings ?? 0}
          sub="Requires resolution"
          icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
          alert={(disputedBookings ?? 0) > 0}
        />
        <AdminStatCard
          label="Pending Verifications"
          value={pendingVerifications ?? 0}
          sub="Driver applications"
          icon={<ShieldCheck className="h-5 w-5 text-orange-400" />}
          alert={(pendingVerifications ?? 0) > 0}
        />
        <AdminStatCard
          label="Booking Volume"
          value={totalBookings ?? 0}
          sub="All services"
          icon={<BarChart3 className="h-5 w-5 text-zinc-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent bookings */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Recent Bookings</h2>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase hidden sm:table-cell">Service</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase hidden sm:table-cell">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-500 text-xs">No bookings yet.</td></tr>
                ) : recentBookings.map((b, i) => (
                  <tr key={b.id} className={i < recentBookings.length - 1 ? 'border-b border-zinc-800/50' : ''}>
                    <td className="px-4 py-3 text-zinc-300">{b.customer?.full_name ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-400 capitalize hidden sm:table-cell">{b.service_type}</td>
                    <td className="px-4 py-3 text-zinc-300 hidden sm:table-cell">{formatCurrency(b.total_amount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={bookingStatusConfig[b.status] ?? 'secondary'} className="capitalize text-[10px]">
                        {b.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap hidden md:table-cell">{formatDateTime(b.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending driver verifications */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Awaiting Verification</h2>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
            {pendingDrivers.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">No pending applications.</div>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {pendingDrivers.map(driver => (
                  <li key={driver.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-300 truncate">{driver.user?.full_name ?? 'Unknown'}</p>
                      <p className="text-xs text-zinc-600 font-mono">{driver.license_number}</p>
                    </div>
                    <a
                      href={`/admin/drivers?highlight=${driver.id}`}
                      className="text-xs text-orange-400 hover:underline whitespace-nowrap"
                    >
                      Review →
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
