import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, Package, ClipboardList, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/utils/helpers'

export const metadata = { title: 'Provider Dashboard' }

export default async function ProviderDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profileRaw }, { data: servicesRaw }, { data: vehiclesRaw }] = await Promise.all([
    supabase.from('user_profiles').select('full_name').eq('id', user!.id).single(),
    supabase.from('convoy_services').select('id, total_bookings').eq('provider_id', user!.id),
    supabase.from('vehicles').select('id, status').eq('owner_id', user!.id),
  ])
  const profile = profileRaw as unknown as { full_name: string } | null
  const services = servicesRaw as unknown as { id: string; total_bookings: number }[] | null
  const vehicles = vehiclesRaw as unknown as { id: string; status: string }[] | null

  const serviceIds = (services ?? []).map(s => s.id)
  const vehicleIds = (vehicles ?? []).map(v => v.id)
  const allIds = [...serviceIds, ...vehicleIds]

  const { data: bookingsRaw } = allIds.length > 0
    ? await supabase.from('bookings').select('id, status, provider_amount').in('service_id', allIds)
    : { data: [] }
  const bookings = bookingsRaw as unknown as { status: string; provider_amount: number }[] | null

  const totalEarnings = (bookings ?? [])
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.provider_amount, 0)

  const pendingCount = (bookings ?? []).filter(b => b.status === 'pending').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Provider Dashboard
        </h1>
        <p className="text-zinc-400 mt-1">
          Welcome back, {profile?.full_name?.split(' ')[0] ?? 'Provider'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Earnings', value: formatCurrency(totalEarnings), icon: <DollarSign className="h-5 w-5 text-green-400" /> },
          { label: 'Active Listings', value: (services?.length ?? 0) + (vehicles?.length ?? 0), icon: <Package className="h-5 w-5 text-orange-400" /> },
          { label: 'Pending Bookings', value: pendingCount, icon: <ClipboardList className="h-5 w-5 text-yellow-400" /> },
          { label: 'Total Bookings', value: bookings?.length ?? 0, icon: <Star className="h-5 w-5 text-blue-400" /> },
        ].map(stat => (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: '/provider/bookings', label: 'Manage Bookings', desc: `${pendingCount} need attention`, icon: <ClipboardList className="h-5 w-5 text-orange-400" /> },
          { href: '/provider/listings', label: 'My Listings', desc: `${(services?.length ?? 0) + (vehicles?.length ?? 0)} active`, icon: <Package className="h-5 w-5 text-blue-400" /> },
        ].map(action => (
          <Link key={action.href} href={action.href}
            className="group flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-all"
          >
            <div className="h-11 w-11 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              {action.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{action.label}</p>
              <p className="text-xs text-zinc-500">{action.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  )
}
