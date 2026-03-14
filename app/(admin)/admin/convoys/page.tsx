import { createAdminClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/utils/helpers'
import { Badge } from '@/components/ui/badge'
import { Navigation, MapPin } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Live Convoys' }

type TripRow = {
  id: string
  status: string
  started_at: string | null
  ended_at: string | null
  booking: {
    id: string
    service_type: string
    pickup_location: string
    dropoff_location: string
    total_amount: number
    customer: { full_name: string } | null
    provider: { full_name: string } | null
  } | null
  driver: { full_name: string; phone: string | null } | null
  last_location: { latitude: number; longitude: number; recorded_at: string } | null
}

export default async function AdminConvoysPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: statusFilter = 'active' } = await searchParams
  const admin = await createAdminClient()

  const activeStatuses = ['en_route', 'in_progress']
  const useStatuses = statusFilter === 'active' ? activeStatuses : statusFilter === 'all' ? undefined : [statusFilter]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (admin as any)
    .from('convoy_trips')
    .select(`
      id, status, started_at, ended_at,
      booking:bookings(id, service_type, pickup_location, dropoff_location, total_amount,
        customer:user_profiles!customer_id(full_name),
        provider:user_profiles!provider_id(full_name)
      ),
      driver:user_profiles!driver_id(full_name, phone)
    `)
    .order('started_at', { ascending: false })
    .limit(50)

  if (useStatuses) query = query.in('status', useStatuses)

  const { data: tripsRaw } = await query
  const trips = (tripsRaw ?? []) as TripRow[]

  // Fetch latest location for each active trip
  const tripIds = trips.filter(t => activeStatuses.includes(t.status)).map(t => t.id)
  type LocRow = { trip_id: string; latitude: number; longitude: number; recorded_at: string }
  let latestLocations: LocRow[] = []
  if (tripIds.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: locsRaw } = await (admin as any)
      .from('tracking_locations')
      .select('trip_id, latitude, longitude, recorded_at')
      .in('trip_id', tripIds)
      .order('recorded_at', { ascending: false })
    latestLocations = (locsRaw ?? []) as LocRow[]
  }

  const latestByTrip = new Map<string, LocRow>()
  for (const loc of latestLocations) {
    if (!latestByTrip.has(loc.trip_id)) latestByTrip.set(loc.trip_id, loc)
  }

  const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'info' | 'secondary'> = {
    pending:     'warning',
    en_route:    'info',
    in_progress: 'info',
    completed:   'success',
    cancelled:   'secondary',
  }

  const filters = [
    { key: 'active', label: 'Live' },
    { key: 'completed', label: 'Completed' },
    { key: 'all', label: 'All' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Convoys</h1>
          <p className="text-zinc-400 mt-1">{trips.length} trips</p>
        </div>
        {trips.some(t => activeStatuses.includes(t.status)) && (
          <div className="flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-green-400">{trips.filter(t => activeStatuses.includes(t.status)).length} active</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {filters.map(f => (
          <a
            key={f.key}
            href={`/admin/convoys?status=${f.key}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              (statusFilter ?? 'active') === f.key
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      <div className="space-y-3">
        {trips.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 py-12 text-center text-zinc-500">
            No {statusFilter === 'active' ? 'active' : ''} convoys.
          </div>
        ) : trips.map(trip => {
          const loc = latestByTrip.get(trip.id)
          const isLive = activeStatuses.includes(trip.status)
          return (
            <div key={trip.id} className={`rounded-2xl border bg-zinc-900/60 p-5 ${isLive ? 'border-green-500/20' : 'border-zinc-800'}`}>
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isLive ? 'bg-green-500/20' : 'bg-zinc-800'}`}>
                    <Navigation className={`h-5 w-5 ${isLive ? 'text-green-400' : 'text-zinc-500'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white capitalize">
                      {trip.booking?.service_type ?? 'Trip'} — {trip.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {trip.driver?.full_name ?? 'No driver'} · {trip.booking?.customer?.full_name ?? 'Unknown customer'}
                    </p>
                  </div>
                </div>
                <Badge variant={statusVariant[trip.status] ?? 'secondary'} className="capitalize">
                  {trip.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-500">Pickup</p>
                    <p className="text-xs text-zinc-300">{trip.booking?.pickup_location ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-500">Drop-off</p>
                    <p className="text-xs text-zinc-300">{trip.booking?.dropoff_location ?? '—'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 flex-wrap gap-2">
                <span>Started: {trip.started_at ? formatDateTime(trip.started_at) : '—'}</span>
                {loc && (
                  <span className="flex items-center gap-1 text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    Last ping {formatDateTime(loc.recorded_at)} · {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                  </span>
                )}
                {trip.booking?.id && (
                  <Link href={`/admin/bookings?q=${trip.booking.id}`} className="text-orange-400 hover:underline">
                    View booking →
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
