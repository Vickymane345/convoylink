import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import Link from 'next/link'
import { CheckCircle2, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/helpers'

export const metadata = { title: 'Payment Successful' }

async function SuccessContent({
  sessionId,
  bookingId,
}: {
  sessionId: string
  bookingId: string
}) {
  const supabase = await createClient()

  // Fetch session from Stripe to confirm
  let sessionAmount = 0
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    sessionAmount = session.amount_total ? session.amount_total / 100 : 0
  } catch {
    // session may not exist yet — webhook will handle it
  }

  // Fetch booking details
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: booking } = await (supabase as any)
    .from('bookings')
    .select('service_type, pickup_location, dropoff_location, scheduled_at, total_amount')
    .eq('id', bookingId)
    .single() as {
      data: {
        service_type: string
        pickup_location: string
        dropoff_location: string
        scheduled_at: string
        total_amount: number
      } | null
    }

  const amount = sessionAmount || booking?.total_amount || 0

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-zinc-400 text-sm mb-6">
            Your payment has been received and is held securely in escrow.
          </p>

          {/* Amount */}
          {amount > 0 && (
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-5 py-4 mb-6">
              <p className="text-xs text-zinc-500 mb-1">Amount paid</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(amount)}</p>
              <p className="text-xs text-zinc-600 mt-1">Held in escrow until trip completion</p>
            </div>
          )}

          {/* Booking details */}
          {booking && (
            <div className="rounded-xl bg-zinc-800/60 p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Service</span>
                <span className="text-zinc-300 capitalize">{booking.service_type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">From</span>
                <span className="text-zinc-300 truncate max-w-[160px]">{booking.pickup_location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">To</span>
                <span className="text-zinc-300 truncate max-w-[160px]">{booking.dropoff_location}</span>
              </div>
            </div>
          )}

          {/* Escrow notice */}
          <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-300">Escrow Protection Active</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Your funds are held safely. They&apos;ll only be released to the service provider
                  once you confirm the trip is complete.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/dashboard/bookings">
              <Button className="w-full group" size="lg">
                Track My Booking
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; booking_id?: string }>
}) {
  const { session_id, booking_id } = await searchParams

  if (!session_id || !booking_id) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center text-zinc-400">
          <p>Invalid payment session.</p>
          <Link href="/dashboard" className="text-orange-400 mt-2 block hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    }>
      <SuccessContent sessionId={session_id} bookingId={booking_id} />
    </Suspense>
  )
}
