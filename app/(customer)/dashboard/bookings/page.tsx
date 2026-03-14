import { createClient } from '@/lib/supabase/server'
import { BookingsList } from '@/features/bookings/BookingsList'

export const metadata = { title: 'My Bookings' }

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, payment:payments(*)')
    .eq('customer_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
        <p className="text-zinc-400 mt-1">Track and manage all your service bookings</p>
      </div>
      <BookingsList bookings={(bookings ?? []) as Parameters<typeof BookingsList>[0]['bookings']} />
    </div>
  )
}
