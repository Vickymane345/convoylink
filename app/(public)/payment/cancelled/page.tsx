import Link from 'next/link'
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Payment Cancelled' }

export default async function PaymentCancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ booking_id?: string }>
}) {
  const { booking_id } = await searchParams

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-zinc-800 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-zinc-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Payment Cancelled</h1>
          <p className="text-zinc-400 text-sm mb-8">
            Your payment was not completed. Your booking is still saved — you can try again anytime.
          </p>

          <div className="flex flex-col gap-3">
            {booking_id && (
              <Link href={`/api/payments/checkout?booking_id=${booking_id}`}>
                <Button className="w-full gap-2" size="lg">
                  <RefreshCcw className="h-4 w-4" />
                  Try Payment Again
                </Button>
              </Link>
            )}
            <Link href="/dashboard/bookings">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Bookings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
