import { createAdminClient } from '@/lib/supabase/server'
import { formatCurrency, formatDateTime } from '@/utils/helpers'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'
import { AdminBookingActions } from '@/features/admin/AdminBookingActions'

export const metadata = { title: 'Disputes' }

type DisputedBooking = {
  id: string
  service_type: string
  status: string
  total_amount: number
  pickup_location: string
  dropoff_location: string
  notes: string | null
  created_at: string
  updated_at: string
  customer: { full_name: string; email: string } | null
  provider: { full_name: string; email: string } | null
  payments: Array<{ status: string; amount: number; provider_amount: number }> | null
}

export default async function AdminDisputesPage() {
  const admin = await createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: disputesRaw } = await (admin as any)
    .from('bookings')
    .select(`
      id, service_type, status, total_amount, pickup_location, dropoff_location,
      notes, created_at, updated_at,
      customer:user_profiles!customer_id(full_name, email),
      provider:user_profiles!provider_id(full_name, email),
      payments(status, amount, provider_amount)
    `)
    .eq('status', 'disputed')
    .order('updated_at', { ascending: false })

  const disputes = (disputesRaw ?? []) as DisputedBooking[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Disputes</h1>
        <p className="text-zinc-400 mt-1">{disputes.length} open dispute{disputes.length !== 1 ? 's' : ''} requiring resolution</p>
      </div>

      {disputes.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 py-16 text-center">
          <AlertTriangle className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No open disputes. Great job!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map(dispute => {
            const payment = dispute.payments?.[0]
            return (
              <div key={dispute.id} className="rounded-2xl border border-red-500/20 bg-zinc-900/60 p-6">
                {/* Header */}
                <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white capitalize">
                        {dispute.service_type} Booking — {dispute.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-zinc-500">Disputed {formatDateTime(dispute.updated_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="danger">Disputed</Badge>
                    <AdminBookingActions bookingId={dispute.id} currentStatus={dispute.status} />
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="rounded-xl bg-zinc-800/40 p-4">
                    <p className="text-xs text-zinc-500 mb-1">Customer</p>
                    <p className="text-sm text-zinc-200 font-medium">{dispute.customer?.full_name ?? '—'}</p>
                    <p className="text-xs text-zinc-500">{dispute.customer?.email ?? ''}</p>
                  </div>
                  <div className="rounded-xl bg-zinc-800/40 p-4">
                    <p className="text-xs text-zinc-500 mb-1">Provider</p>
                    <p className="text-sm text-zinc-200 font-medium">{dispute.provider?.full_name ?? '—'}</p>
                    <p className="text-xs text-zinc-500">{dispute.provider?.email ?? ''}</p>
                  </div>
                </div>

                {/* Route + amount */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500 mb-0.5">Pickup</p>
                    <p className="text-zinc-300 text-xs truncate">{dispute.pickup_location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-0.5">Drop-off</p>
                    <p className="text-zinc-300 text-xs truncate">{dispute.dropoff_location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-0.5">Total Paid</p>
                    <p className="text-zinc-200 font-medium">{formatCurrency(dispute.total_amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-0.5">Escrow Status</p>
                    <p className="text-zinc-200 font-medium capitalize">{payment?.status ?? '—'}</p>
                  </div>
                </div>

                {/* Notes */}
                {dispute.notes && (
                  <div className="rounded-xl border border-zinc-700 bg-zinc-800/30 p-3">
                    <p className="text-xs text-zinc-500 mb-1">Booking notes</p>
                    <p className="text-sm text-zinc-300">{dispute.notes}</p>
                  </div>
                )}

                {/* Resolution guide */}
                <div className="mt-4 rounded-xl bg-orange-500/5 border border-orange-500/20 p-3">
                  <p className="text-xs text-orange-300 font-medium mb-1">Resolution Options</p>
                  <p className="text-xs text-zinc-400">
                    <strong className="text-zinc-300">Resolve Dispute</strong> — marks booking completed and releases escrow to provider.<br />
                    <strong className="text-zinc-300">Cancel Booking</strong> — cancels the booking and refunds the customer.
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
