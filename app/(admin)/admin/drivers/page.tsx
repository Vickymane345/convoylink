import { createAdminClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/utils/helpers'
import { Badge } from '@/components/ui/badge'
import { DriverVerificationActions } from '@/features/admin/DriverVerificationActions'

export const metadata = { title: 'Driver Verification' }

type DriverRow = {
  id: string
  verification_status: string
  license_number: string
  years_experience: number | null
  created_at: string
  user: { id: string; full_name: string; email: string; phone: string | null } | null
  total_trips: number
  avg_rating: number | null
}

export default async function AdminDriversPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; highlight?: string }>
}) {
  const { status: statusFilter = 'pending' } = await searchParams
  const admin = await createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (admin as any)
    .from('drivers')
    .select(`
      id, verification_status, license_number, years_experience, created_at,
      total_trips, avg_rating,
      user:user_profiles(id, full_name, email, phone)
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (statusFilter !== 'all') {
    query = query.eq('verification_status', statusFilter)
  }

  const { data: driversRaw } = await query
  const drivers = (driversRaw ?? []) as DriverRow[]

  const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'secondary'> = {
    pending:  'warning',
    approved: 'success',
    rejected: 'danger',
    suspended:'secondary',
  }

  const filters = ['all', 'pending', 'approved', 'rejected', 'suspended']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Driver Verification</h1>
        <p className="text-zinc-400 mt-1">Review and approve driver applications</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <a
            key={f}
            href={`/admin/drivers?status=${f}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              (statusFilter ?? 'pending') === f
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {f}
          </a>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              {['Driver', 'License', 'Experience', 'Trips', 'Rating', 'Status', 'Applied', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-zinc-500">No drivers with status: {statusFilter}</td></tr>
            ) : drivers.map((d, i) => (
              <tr key={d.id} className={i < drivers.length - 1 ? 'border-b border-zinc-800/50' : ''}>
                <td className="px-4 py-3.5">
                  <p className="text-zinc-200 font-medium">{d.user?.full_name ?? '—'}</p>
                  <p className="text-xs text-zinc-600">{d.user?.email ?? ''}</p>
                </td>
                <td className="px-4 py-3.5 text-zinc-400 font-mono text-xs">{d.license_number}</td>
                <td className="px-4 py-3.5 text-zinc-400">{d.years_experience ? `${d.years_experience} yrs` : '—'}</td>
                <td className="px-4 py-3.5 text-zinc-400">{d.total_trips}</td>
                <td className="px-4 py-3.5 text-zinc-400">{d.avg_rating ? `★ ${d.avg_rating.toFixed(1)}` : '—'}</td>
                <td className="px-4 py-3.5">
                  <Badge variant={statusVariant[d.verification_status] ?? 'secondary'} className="capitalize">
                    {d.verification_status}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-zinc-500 text-xs whitespace-nowrap">{formatDateTime(d.created_at)}</td>
                <td className="px-4 py-3.5">
                  <DriverVerificationActions driverId={d.id} currentStatus={d.verification_status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
