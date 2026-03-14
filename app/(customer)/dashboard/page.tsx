import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarCheck, Shield, Car, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/utils/helpers'

export default async function CustomerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [profileResult, bookingsResult] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('id', user!.id).single(),
    supabase.from('bookings').select('*', { count: 'exact' })
      .eq('customer_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const profile = profileResult.data as { full_name: string } | null
  const bookings = bookingsResult.data as Array<{
    id: string; service_type: string; pickup_location: string;
    scheduled_at: string; total_amount: number; status: string;
  }> | null
  const count = bookingsResult.count

  const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
    pending: 'warning',
    confirmed: 'info',
    in_progress: 'default',
    completed: 'success',
    cancelled: 'danger',
    disputed: 'danger',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {profile?.full_name.split(' ')[0]} 👋
        </h1>
        <p className="text-zinc-400 mt-1">Here&apos;s what&apos;s happening with your bookings.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: count ?? 0, icon: <CalendarCheck className="h-5 w-5 text-orange-400" /> },
          { label: 'Active Trips', value: bookings?.filter(b => b.status === 'in_progress').length ?? 0, icon: <Shield className="h-5 w-5 text-blue-400" /> },
          { label: 'Vehicles Rented', value: bookings?.filter(b => b.service_type === 'vehicle').length ?? 0, icon: <Car className="h-5 w-5 text-green-400" /> },
          { label: 'Reviews Given', value: 0, icon: <Star className="h-5 w-5 text-yellow-400" /> },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Book a Service</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/convoy', label: 'Book Convoy Escort', desc: 'Armed & unarmed protection', icon: <Shield className="h-6 w-6" />, color: 'orange' },
            { href: '/vehicles', label: 'Rent a Vehicle', desc: 'Sedans, SUVs, buses & more', icon: <Car className="h-6 w-6" />, color: 'blue' },
            { href: '/drivers', label: 'Hire a Driver', desc: 'Verified professional drivers', icon: <CalendarCheck className="h-6 w-6" />, color: 'green' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all"
            >
              <div className={`h-11 w-11 rounded-xl bg-${action.color}-500/10 flex items-center justify-center text-${action.color}-400 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{action.label}</p>
                <p className="text-xs text-zinc-500">{action.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Recent Bookings</h2>
          <Link href="/dashboard/bookings" className="text-xs text-orange-400 hover:text-orange-300">
            View all →
          </Link>
        </div>
        <Card>
          <CardContent className="p-0">
            {!bookings?.length ? (
              <div className="py-12 text-center text-zinc-500 text-sm">
                No bookings yet.{' '}
                <Link href="/convoy" className="text-orange-400 hover:underline">Book your first service</Link>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase">Service</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase hidden sm:table-cell">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase hidden md:table-cell">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, i) => (
                    <tr key={booking.id} className={i < bookings.length - 1 ? 'border-b border-zinc-800/50' : ''}>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium capitalize">{booking.service_type} Service</p>
                        <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-[180px]">{booking.pickup_location}</p>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 hidden sm:table-cell">
                        {formatDate(booking.scheduled_at)}
                      </td>
                      <td className="px-6 py-4 text-zinc-300 hidden md:table-cell">
                        {formatCurrency(booking.total_amount)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusColors[booking.status] ?? 'secondary'}>
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
