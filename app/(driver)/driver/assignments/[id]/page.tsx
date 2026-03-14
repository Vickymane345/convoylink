import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import { formatDate } from '@/utils/helpers'
import { Badge } from '@/components/ui/badge'
import { DriverBroadcastPanel } from '@/features/tracking/DriverBroadcastPanel'
import { TripStatusControls } from '@/features/tracking/TripStatusControls'

export const metadata = { title: 'Assignment Detail' }

type TripDetail = {
  id: string
  status: string
  booking_id: string
  booking: {
    id: string
    pickup_location: string
    dropoff_location: string
    scheduled_at: string
    service_type: string
    status: string
  }
}

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const admin = await createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tripRaw } = await (admin as any)
    .from('convoy_trips')
    .select('id, status, booking_id, booking:bookings(id, pickup_location, dropoff_location, scheduled_at, service_type, status)')
    .eq('id', id)
    .eq('driver_id', user.id)
    .single()

  const trip = tripRaw as TripDetail | null
  if (!trip) notFound()

  const isActive = ['en_route', 'in_progress'].includes(trip.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/driver/assignments" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white capitalize">
            {trip.booking.service_type} Trip
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Trip ID: {trip.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <Badge variant={
          trip.status === 'completed' ? 'success' :
          isActive ? 'info' :
          trip.status === 'cancelled' ? 'danger' : 'warning'
        } className="ml-auto capitalize">
          {trip.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Trip info */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-zinc-500">Pickup</p>
            <p className="text-sm text-zinc-300">{trip.booking.pickup_location}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-zinc-500">Drop-off</p>
            <p className="text-sm text-zinc-300">{trip.booking.dropoff_location}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-zinc-500">Scheduled</p>
            <p className="text-sm text-zinc-300">{formatDate(trip.booking.scheduled_at)}</p>
          </div>
        </div>
      </div>

      {/* Trip status controls */}
      <TripStatusControls tripId={trip.id} currentStatus={trip.status} />

      {/* GPS Broadcast — only when active */}
      {isActive && (
        <DriverBroadcastPanel
          tripId={trip.id}
          bookingId={trip.booking_id}
          pickupLocation={trip.booking.pickup_location}
          dropoffLocation={trip.booking.dropoff_location}
        />
      )}
    </div>
  )
}
