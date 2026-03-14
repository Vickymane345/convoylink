import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Clock, CheckCircle2, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/helpers'

export const metadata = { title: 'Earnings' }

type PaymentRow = {
  id: string
  booking_id: string
  amount: number
  provider_amount: number
  platform_fee: number
  currency: string
  status: string
  paid_at: string | null
  released_at: string | null
  booking: { service_type: string; pickup_location: string; dropoff_location: string } | null
}

export default async function EarningsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: paymentsRaw } = await (supabase as any)
    .from('payments')
    .select('*, booking:bookings(service_type, pickup_location, dropoff_location)')
    .eq('provider_id', user!.id)
    .order('created_at', { ascending: false })

  const payments = (paymentsRaw ?? []) as PaymentRow[]

  const totalEarned = payments
    .filter(p => p.status === 'released')
    .reduce((sum, p) => sum + p.provider_amount, 0)

  const pendingPayout = payments
    .filter(p => p.status === 'held')
    .reduce((sum, p) => sum + p.provider_amount, 0)

  const totalVolume = payments
    .filter(p => ['held', 'released'].includes(p.status))
    .reduce((sum, p) => sum + p.amount, 0)

  const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' }> = {
    pending:  { label: 'Pending',  variant: 'warning' },
    held:     { label: 'In Escrow', variant: 'info' },
    released: { label: 'Paid Out',  variant: 'success' },
    refunded: { label: 'Refunded',  variant: 'secondary' },
    failed:   { label: 'Failed',    variant: 'danger' },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Earnings</h1>
        <p className="text-zinc-400 mt-1">Your payment history and pending payouts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Earned',
            value: formatCurrency(totalEarned),
            sub: 'Released to you',
            icon: <CheckCircle2 className="h-5 w-5 text-green-400" />,
            color: 'green',
          },
          {
            label: 'Pending Payout',
            value: formatCurrency(pendingPayout),
            sub: 'Held in escrow',
            icon: <Clock className="h-5 w-5 text-yellow-400" />,
            color: 'yellow',
          },
          {
            label: 'Gross Volume',
            value: formatCurrency(totalVolume),
            sub: 'Before platform fee',
            icon: <TrendingUp className="h-5 w-5 text-blue-400" />,
            color: 'blue',
          },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-zinc-600 mt-1">{stat.sub}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fee explanation */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex items-center gap-3">
        <DollarSign className="h-5 w-5 text-orange-400 shrink-0" />
        <p className="text-sm text-zinc-400">
          ConvoyLink charges a <span className="text-white font-medium">10% platform fee</span> on each booking.
          Your payout is 90% of the booking subtotal, released after trip completion.
        </p>
      </div>

      {/* Payment history table */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Payment History</h2>
        {payments.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 py-12 text-center text-zinc-500 text-sm">
            No payments yet. Start accepting bookings to see earnings here.
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {['Date', 'Service', 'Gross', 'Platform Fee', 'Your Payout', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, i) => {
                  const isLast = i === payments.length - 1
                  const config = statusConfig[payment.status] ?? { label: payment.status, variant: 'secondary' as const }
                  return (
                    <tr key={payment.id} className={!isLast ? 'border-b border-zinc-800/50' : ''}>
                      <td className="px-5 py-4 text-zinc-400 whitespace-nowrap">
                        {payment.paid_at ? formatDate(payment.paid_at) : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-zinc-300 capitalize">{payment.booking?.service_type ?? '—'}</p>
                        {payment.booking && (
                          <p className="text-xs text-zinc-600 truncate max-w-[160px]">
                            {payment.booking.pickup_location} → {payment.booking.dropoff_location}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-zinc-300">{formatCurrency(payment.amount)}</td>
                      <td className="px-5 py-4 text-zinc-500">−{formatCurrency(payment.platform_fee)}</td>
                      <td className="px-5 py-4 font-medium text-white">{formatCurrency(payment.provider_amount)}</td>
                      <td className="px-5 py-4">
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
