import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDateTime } from '@/utils/helpers'
import {
  ArrowLeft, User, Mail, Phone, MapPin, Calendar,
  ShieldCheck, CalendarCheck, DollarSign, Star, MessageSquare,
  Package, TruckIcon,
} from 'lucide-react'
import { AdminUserActions } from '@/features/admin/AdminUserActions'

export const metadata = { title: 'User Detail' }

const roleVariant: Record<string, 'default' | 'success' | 'warning' | 'info' | 'secondary'> = {
  customer: 'secondary', provider: 'info', driver: 'success', admin: 'default',
}

const bookingStatusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
  pending: 'warning', confirmed: 'info', in_progress: 'info',
  completed: 'success', cancelled: 'secondary', disputed: 'danger',
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const admin = await createAdminClient()

  const [
    { data: profile },
    { data: bookingsRaw },
    { data: paymentsRaw },
    { data: reviewsRaw },
    { data: convoyServicesRaw },
    { data: vehiclesRaw },
    { data: driverRaw },
    { data: messagesCountRaw },
  ] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (admin as any).from('user_profiles').select('*').eq('id', id).single(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (admin as any).from('bookings')
      .select('id, service_type, status, total_amount, platform_fee, pickup_location, dropoff_location, scheduled_at, created_at, notes')
      .eq('customer_id', id)
      .order('created_at', { ascending: false })
      .limit(50),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (admin as any).from('payments')
      .select('id, amount, platform_fee, provider_amount, status, stripe_session_id, created_at, booking:bookings(service_type, pickup_location, dropoff_location)')
      .eq('booking_id', (admin as any).from('bookings').select('id').eq('customer_id', id))
      .order('created_at', { ascending: false })
      .limit(50),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (admin as any).from('reviews')
      .select('id, rating, comment, created_at, booking:bookings(service_type)')
      .eq('reviewer_id', id)
      .order('created_at', { ascending: false })
      .limit(20),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (admin as any).from('convoy_services')
      .select('id, title, service_type, base_price, is_active, rating, total_bookings, created_at')
      .eq('provider_id', id)
      .order('created_at', { ascending: false }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (admin as any).from('vehicles')
      .select('id, make, model, year, vehicle_type, daily_rate, is_available, created_at')
      .eq('owner_id', id)
      .order('created_at', { ascending: false }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (admin as any).from('drivers')
      .select('id, verification_status, license_number, years_experience, rating, total_trips, bio, created_at')
      .eq('user_id', id)
      .maybeSingle(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (admin as any).from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('sender_id', id),
  ])

  if (!profile) notFound()

  type Booking = {
    id: string; service_type: string; status: string; total_amount: number
    platform_fee: number; pickup_location: string; dropoff_location: string
    scheduled_at: string; created_at: string; notes: string | null
  }
  type Payment = {
    id: string; amount: number; platform_fee: number; provider_amount: number
    status: string; stripe_session_id: string | null; created_at: string
    booking: { service_type: string; pickup_location: string; dropoff_location: string } | null
  }
  type Review = {
    id: string; rating: number; comment: string | null; created_at: string
    booking: { service_type: string } | null
  }
  type ConvoyService = {
    id: string; title: string; service_type: string; base_price: number
    is_active: boolean; rating: number; total_bookings: number; created_at: string
  }
  type Vehicle = {
    id: string; make: string; model: string; year: number
    vehicle_type: string; daily_rate: number; is_available: boolean; created_at: string
  }
  type DriverProfile = {
    id: string; verification_status: string; license_number: string
    years_experience: number; rating: number; total_trips: number; bio: string | null; created_at: string
  }

  const bookings = (bookingsRaw ?? []) as Booking[]
  const payments = (paymentsRaw ?? []) as Payment[]
  const reviews = (reviewsRaw ?? []) as Review[]
  const convoyServices = (convoyServicesRaw ?? []) as ConvoyService[]
  const vehicles = (vehiclesRaw ?? []) as Vehicle[]
  const driver = driverRaw as DriverProfile | null

  const totalSpent = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.total_amount, 0)

  const completedBookings = bookings.filter(b => b.status === 'completed').length
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Back */}
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Users
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Avatar */}
          <div className="h-16 w-16 rounded-2xl bg-orange-500/20 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-orange-400">
              {(profile.full_name || profile.email || '?')[0].toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-white">{profile.full_name || '—'}</h1>
              <Badge variant={roleVariant[profile.role] ?? 'secondary'} className="capitalize">{profile.role}</Badge>
              <Badge variant={profile.is_verified ? 'success' : 'warning'}>
                {profile.is_verified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-4">
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{profile.email}</span>
              {profile.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{profile.phone}</span>}
              {profile.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{profile.location}</span>}
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Joined {formatDateTime(profile.created_at)}</span>
            </div>

            <AdminUserActions userId={profile.id} currentRole={profile.role} isVerified={profile.is_verified} />
          </div>
        </div>
      </div>

      {/* Activity summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: bookings.length, icon: <CalendarCheck className="h-4 w-4 text-purple-400" /> },
          { label: 'Completed', value: completedBookings, icon: <ShieldCheck className="h-4 w-4 text-green-400" /> },
          { label: 'Total Spent', value: formatCurrency(totalSpent), icon: <DollarSign className="h-4 w-4 text-yellow-400" /> },
          { label: 'Reviews Given', value: reviews.length, icon: <Star className="h-4 w-4 text-orange-400" /> },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-2 mb-2">{stat.icon}<p className="text-xs text-zinc-500">{stat.label}</p></div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Driver profile (if driver) */}
      {driver && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TruckIcon className="h-4 w-4" /> Driver Profile
          </h2>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Verification</p>
              <Badge variant={driver.verification_status === 'approved' ? 'success' : driver.verification_status === 'pending' ? 'warning' : 'danger'} className="capitalize">
                {driver.verification_status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">License No.</p>
              <p className="text-sm text-zinc-300 font-mono">{driver.license_number}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Experience</p>
              <p className="text-sm text-zinc-300">{driver.years_experience} years</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Total Trips</p>
              <p className="text-sm text-zinc-300">{driver.total_trips}</p>
            </div>
            {driver.bio && (
              <div className="col-span-2 sm:col-span-4">
                <p className="text-xs text-zinc-500 mb-1">Bio</p>
                <p className="text-sm text-zinc-400">{driver.bio}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Convoy services (if provider) */}
      {convoyServices.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" /> Convoy Services ({convoyServices.length})
          </h2>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Service</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Base Price</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Bookings</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {convoyServices.map((s, i) => (
                  <tr key={s.id} className={i < convoyServices.length - 1 ? 'border-b border-zinc-800/50' : ''}>
                    <td className="px-4 py-3 text-zinc-300">{s.title}</td>
                    <td className="px-4 py-3 text-zinc-400 capitalize">{s.service_type}</td>
                    <td className="px-4 py-3 text-zinc-300">{formatCurrency(s.base_price)}</td>
                    <td className="px-4 py-3 text-zinc-400">{s.total_bookings}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.is_active ? 'success' : 'secondary'}>{s.is_active ? 'Active' : 'Inactive'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Vehicles (if provider) */}
      {vehicles.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" /> Vehicles Listed ({vehicles.length})
          </h2>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Vehicle</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Daily Rate</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v, i) => (
                  <tr key={v.id} className={i < vehicles.length - 1 ? 'border-b border-zinc-800/50' : ''}>
                    <td className="px-4 py-3 text-zinc-300">{v.year} {v.make} {v.model}</td>
                    <td className="px-4 py-3 text-zinc-400 capitalize">{v.vehicle_type}</td>
                    <td className="px-4 py-3 text-zinc-300">{formatCurrency(v.daily_rate)}/day</td>
                    <td className="px-4 py-3">
                      <Badge variant={v.is_available ? 'success' : 'secondary'}>{v.is_available ? 'Available' : 'Unavailable'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Bookings */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <CalendarCheck className="h-4 w-4" /> Booking History ({bookings.length})
        </h2>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Service</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Route</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-zinc-500 text-xs">No bookings yet.</td></tr>
              ) : bookings.map((b, i) => (
                <tr key={b.id} className={i < bookings.length - 1 ? 'border-b border-zinc-800/50' : ''}>
                  <td className="px-4 py-3 text-zinc-600 text-xs font-mono">{b.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-zinc-400 capitalize">{b.service_type}</td>
                  <td className="px-4 py-3">
                    <p className="text-zinc-300 text-xs truncate max-w-[160px]">{b.pickup_location}</p>
                    <p className="text-zinc-500 text-xs truncate max-w-[160px]">→ {b.dropoff_location}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{formatCurrency(b.total_amount)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={bookingStatusVariant[b.status] ?? 'secondary'} className="capitalize text-[10px]">
                      {b.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">{formatDateTime(b.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Payments */}
      {payments.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Payment History ({payments.length})
          </h2>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Platform Fee</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Provider Gets</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p.id} className={i < payments.length - 1 ? 'border-b border-zinc-800/50' : ''}>
                    <td className="px-4 py-3 text-zinc-300 font-medium">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3 text-zinc-400">{formatCurrency(p.platform_fee)}</td>
                    <td className="px-4 py-3 text-zinc-400">{formatCurrency(p.provider_amount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status === 'released' ? 'success' : p.status === 'paid' ? 'info' : p.status === 'refunded' ? 'danger' : 'warning'} className="capitalize">
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">{formatDateTime(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Star className="h-4 w-4" /> Reviews Given ({reviews.length}{avgRating ? (
              <> &middot; avg {avgRating} <Star className="inline h-3 w-3 fill-yellow-400 text-yellow-400" /></>
            ) : ''})
          </h2>
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-zinc-500 capitalize">{r.booking?.service_type ?? ''} service</span>
                  </div>
                  <span className="text-xs text-zinc-600">{formatDateTime(r.created_at)}</span>
                </div>
                {r.comment && <p className="text-sm text-zinc-400">{r.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Message count */}
      <section>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-zinc-500" />
          <div>
            <p className="text-sm text-zinc-300 font-medium">{(messagesCountRaw as unknown as { count: number })?.count ?? 0} messages sent</p>
            <p className="text-xs text-zinc-600">Total platform messages by this user</p>
          </div>
        </div>
      </section>
    </div>
  )
}
