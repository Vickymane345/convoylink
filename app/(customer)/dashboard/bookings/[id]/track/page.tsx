import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { LiveTrackingView } from '@/features/tracking/LiveTrackingView'
import { EscrowReleaseButton } from '@/features/payments/EscrowReleaseButton'

export const metadata = { title: 'Track Convoy' }

type BookingWithTrip = {
  id: string
  pickup_location: string
  dropoff_location: string
  status: string
  service_type: string
  convoy_trips: Array<{
    id: string
    status: string
  }>
  payments: Array<{
    id: string
    provider_amount: number
    status: string
  }>
}

export default async function TrackBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: bookingRaw } = await (supabase as any)
    .from('bookings')
    .select(`
      id, pickup_location, dropoff_location, status, service_type,
      convoy_trips(id, status),
      payments(id, provider_amount, status)
    `)
    .eq('id', id)
    .eq('customer_id', user.id)
    .single()

  const booking = bookingRaw as BookingWithTrip | null
  if (!booking) notFound()

  const trip = booking.convoy_trips?.[0] ?? null
  const payment = booking.payments?.[0] ?? null

  const isTrackable = ['confirmed', 'in_progress'].includes(booking.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/bookings" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white capitalize">
            Track {booking.service_type} Booking
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {booking.pickup_location} → {booking.dropoff_location}
          </p>
        </div>
      </div>

      {/* Escrow release */}
      {payment && booking.status === 'in_progress' && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">Trip in Progress</p>
              <p className="text-xs text-zinc-400 mt-1">
                Release escrow once your trip is complete to pay the provider.
              </p>
            </div>
          </div>
          <EscrowReleaseButton
            bookingId={booking.id}
            providerAmount={payment.provider_amount}
            paymentStatus={payment.status}
            bookingStatus={booking.status}
          />
        </div>
      )}

      {/* Tracking map */}
      {isTrackable && trip ? (
        <LiveTrackingView
          tripId={trip.id}
          pickupLocation={booking.pickup_location}
          dropoffLocation={booking.dropoff_location}
        />
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 py-16 text-center">
          <p className="text-zinc-500 text-sm">
            Live tracking will be available once the trip is confirmed and in progress.
          </p>
          <p className="text-xs text-zinc-600 mt-2 capitalize">
            Current status: {booking.status.replace('_', ' ')}
          </p>
        </div>
      )}
    </div>
  )
}
