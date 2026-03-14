import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/utils/helpers'
import { bookingStatusConfig } from '@/services/bookingService'
import { ProviderBookingActions } from '@/features/bookings/ProviderBookingActions'

export const metadata = { title: 'Provider Bookings' }

export default async function ProviderBookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get all services owned by this provider
  const { data: convoyServicesRaw } = await supabase
    .from('convoy_services')
    .select('id')
    .eq('provider_id', user!.id)
  const convoyServices = convoyServicesRaw as unknown as { id: string }[] | null

  const { data: vehiclesRaw } = await supabase
    .from('vehicles')
    .select('id')
    .eq('owner_id', user!.id)
  const vehicles = vehiclesRaw as unknown as { id: string }[] | null

  const serviceIds = [
    ...(convoyServices ?? []).map(s => s.id),
    ...(vehicles ?? []).map(v => v.id),
  ]

  const { data: bookingsRaw } = serviceIds.length > 0
    ? await supabase
        .from('bookings')
        .select('*, customer:user_profiles!customer_id(*), payment:payments(*)')
        .in('service_id', serviceIds)
        .order('created_at', { ascending: false })
    : { data: [] }
  const bookings = bookingsRaw as unknown as Array<{ id: string; status: string; service_type: string; pickup_location: string; dropoff_location: string; scheduled_at: string; provider_amount: number; platform_fee: number; total_amount: number; notes: string | null; customer: { full_name: string } | null; payment: { status: string; stripe_session_id: string | null } | null }>

  const pending = (bookings ?? []).filter(b => b.status === 'pending').length
  const active = (bookings ?? []).filter(b => b.status === 'in_progress').length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Incoming Bookings</h1>
        <p className="text-zinc-400 mt-1">
          {pending} pending · {active} active
        </p>
      </div>

      {(!bookings || bookings.length === 0) ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 py-16 text-center text-zinc-500">
          <p>No bookings yet. Create a listing to start receiving bookings.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {['Customer', 'Service', 'Date', 'Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(bookings ?? []).map((booking, i) => {
                const isLast = i === (bookings ?? []).length - 1
                const statusConfig = bookingStatusConfig[booking.status as keyof typeof bookingStatusConfig]
                const customer = booking.customer

                return (
                  <tr key={booking.id} className={!isLast ? 'border-b border-zinc-800/50' : ''}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{customer?.full_name ?? 'Customer'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-zinc-300 capitalize">{booking.service_type}</p>
                      <p className="text-xs text-zinc-500 truncate max-w-[150px]">{booking.pickup_location}</p>
                    </td>
                    <td className="px-5 py-4 text-zinc-400">
                      {formatDateTime(booking.scheduled_at)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white font-medium">{formatCurrency(booking.provider_amount)}</p>
                      <p className="text-xs text-zinc-600">After platform fee</p>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusConfig?.color ?? 'secondary'}>
                        {statusConfig?.label ?? booking.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <ProviderBookingActions bookingId={booking.id} status={booking.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
