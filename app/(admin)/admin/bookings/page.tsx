import { createAdminClient } from '@/lib/supabase/server'
import { formatCurrency, formatDateTime } from '@/utils/helpers'
import { Badge } from '@/components/ui/badge'
import { AdminBookingActions } from '@/features/admin/AdminBookingActions'

export const metadata = { title: 'All Bookings' }

type BookingRow = {
  id: string
  service_type: string
  status: string
  total_amount: number
  pickup_location: string
  dropoff_location: string
  scheduled_at: string
  created_at: string
  customer: { full_name: string } | null
  provider: { full_name: string } | null
  payments: Array<{ status: string; amount: number }> | null
}

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
  pending:     'warning',
  confirmed:   'info',
  in_progress: 'info',
  completed:   'success',
  cancelled:   'secondary',
  disputed:    'danger',
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; service?: string }>
}) {
  const { status: statusFilter, service: serviceFilter } = await searchParams
  const admin = await createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (admin as any)
    .from('bookings')
    .select(`
      id, service_type, status, total_amount, pickup_location, dropoff_location,
      scheduled_at, created_at,
      customer:user_profiles!customer_id(full_name),
      provider:user_profiles!provider_id(full_name),
      payments(status, amount)
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (statusFilter && statusFilter !== 'all') query = query.eq('status', statusFilter)
  if (serviceFilter && serviceFilter !== 'all') query = query.eq('service_type', serviceFilter)

  const { data: bookingsRaw } = await query
  const bookings = (bookingsRaw ?? []) as BookingRow[]

  const statusFilters = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed']
  const serviceFilters = ['all', 'convoy', 'vehicle', 'driver']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">All Bookings</h1>
        <p className="text-zinc-400 mt-1">{bookings.length} bookings</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {statusFilters.map(f => (
          <a
            key={f}
            href={`/admin/bookings?status=${f}${serviceFilter ? `&service=${serviceFilter}` : ''}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              (statusFilter ?? 'all') === f
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {f.replace('_', ' ')}
          </a>
        ))}
        <div className="h-6 w-px bg-zinc-700 self-center mx-1" />
        {serviceFilters.map(f => (
          <a
            key={f}
            href={`/admin/bookings?service=${f}${statusFilter ? `&status=${statusFilter}` : ''}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              (serviceFilter ?? 'all') === f
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {f}
          </a>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-zinc-800">
              {['Customer', 'Provider', 'Service', 'Route', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 uppercase whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-zinc-500">No bookings found.</td></tr>
            ) : bookings.map((b, i) => {
              const payment = b.payments?.[0]
              return (
                <tr key={b.id} className={i < bookings.length - 1 ? 'border-b border-zinc-800/50' : ''}>
                  <td className="px-4 py-3.5 text-zinc-300">{b.customer?.full_name ?? '—'}</td>
                  <td className="px-4 py-3.5 text-zinc-400">{b.provider?.full_name ?? '—'}</td>
                  <td className="px-4 py-3.5 text-zinc-400 capitalize">{b.service_type}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-zinc-400 text-xs truncate max-w-[120px]">{b.pickup_location}</p>
                    <p className="text-zinc-600 text-xs">→ {b.dropoff_location.slice(0, 20)}…</p>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-300 whitespace-nowrap">{formatCurrency(b.total_amount)}</td>
                  <td className="px-4 py-3.5">
                    {payment ? (
                      <Badge variant={statusVariant[payment.status] ?? 'secondary'} className="text-[10px] capitalize">
                        {payment.status}
                      </Badge>
                    ) : <span className="text-zinc-600 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={statusVariant[b.status] ?? 'secondary'} className="capitalize text-[10px]">
                      {b.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500 text-xs whitespace-nowrap">{formatDateTime(b.created_at)}</td>
                  <td className="px-4 py-3.5">
                    <AdminBookingActions bookingId={b.id} currentStatus={b.status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
