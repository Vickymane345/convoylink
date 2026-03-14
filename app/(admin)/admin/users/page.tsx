import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/utils/helpers'
import { Badge } from '@/components/ui/badge'
import { AdminUserActions } from '@/features/admin/AdminUserActions'

export const metadata = { title: 'User Management' }

type UserRow = {
  id: string
  full_name: string
  email: string
  role: string
  is_verified: boolean
  created_at: string
  phone: string | null
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; q?: string }>
}) {
  const { role: roleFilter, q } = await searchParams
  const admin = await createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (admin as any)
    .from('user_profiles')
    .select('id, full_name, email, role, is_verified, created_at, phone')
    .order('created_at', { ascending: false })
    .limit(100)

  if (roleFilter && roleFilter !== 'all') {
    query = query.eq('role', roleFilter)
  }
  if (q) {
    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
  }

  const { data: usersRaw } = await query
  const users = (usersRaw ?? []) as UserRow[]

  const roleVariant: Record<string, 'default' | 'success' | 'warning' | 'info' | 'secondary'> = {
    customer: 'secondary',
    provider: 'info',
    driver:   'success',
    admin:    'default',
  }

  const roleFilters = ['all', 'customer', 'provider', 'driver', 'admin']

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-zinc-400 mt-1">{users.length} users</p>
        </div>
        <form className="flex gap-2 flex-wrap w-full sm:w-auto">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name or email…"
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-orange-500/50 flex-1 sm:w-56 min-w-0"
          />
          <select
            name="role"
            defaultValue={roleFilter ?? 'all'}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-orange-500/50"
          >
            {roleFilters.map(r => (
              <option key={r} value={r} className="bg-zinc-900">{r === 'all' ? 'All roles' : r}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-sm text-zinc-200 transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase">Name</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase hidden sm:table-cell">Email</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase">Role</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase">Verified</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase hidden md:table-cell">Joined</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase">Actions</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 uppercase"></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-zinc-500">No users found.</td></tr>
            ) : users.map((u, i) => (
              <tr key={u.id} className={i < users.length - 1 ? 'border-b border-zinc-800/50' : ''}>
                <td className="px-5 py-3.5">
                  <p className="text-zinc-200 font-medium">{u.full_name || '—'}</p>
                  {u.phone && <p className="text-xs text-zinc-600">{u.phone}</p>}
                </td>
                <td className="px-5 py-3.5 text-zinc-400 text-xs hidden sm:table-cell">{u.email}</td>
                <td className="px-5 py-3.5">
                  <Badge variant={roleVariant[u.role] ?? 'secondary'} className="capitalize">{u.role}</Badge>
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={u.is_verified ? 'success' : 'warning'}>
                    {u.is_verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-zinc-500 text-xs whitespace-nowrap hidden md:table-cell">{formatDateTime(u.created_at)}</td>
                <td className="px-5 py-3.5">
                  <AdminUserActions userId={u.id} currentRole={u.role} isVerified={u.is_verified} />
                </td>
                <td className="px-5 py-3.5">
                  <Link href={`/admin/users/${u.id}`} className="text-xs text-orange-400 hover:underline whitespace-nowrap">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
