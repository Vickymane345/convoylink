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

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 uppercase">Driver</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 uppercase hidden sm:table-cell">License</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 uppercase hidden md:table-cell">Experience</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 uppercase hidden md:table-cell">Trips</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 uppercase hidden sm:table-cell">Rating</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 uppercase">Status</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 uppercase hidden lg:table-cell">Applied</th>
              <th className="text-left px-4 py-3.5 text-xs font-medium text-zinc-500 uppercase">Actions</th>
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
                <td className="px-4 py-3.5 text-zinc-400 font-mono text-xs hidden sm:table-cell">{d.license_number}</td>
                <td className="px-4 py-3.5 text-zinc-400 hidden md:table-cell">{d.years_experience ? `${d.years_experience} yrs` : '—'}</td>
                <td className="px-4 py-3.5 text-zinc-400 hidden md:table-cell">{d.total_trips}</td>
                <td className="px-4 py-3.5 text-zinc-400 hidden sm:table-cell">
                  {d.avg_rating ? (
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      {d.avg_rating.toFixed(1)}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={statusVariant[d.verification_status] ?? 'secondary'} className="capitalize">
                    {d.verification_status}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-zinc-500 text-xs whitespace-nowrap hidden lg:table-cell">{formatDateTime(d.created_at)}</td>
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
