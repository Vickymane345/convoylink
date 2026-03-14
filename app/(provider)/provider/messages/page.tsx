import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BookingInbox } from '@/features/messaging/BookingInbox'

export const metadata = { title: 'Messages' }

export default async function ProviderMessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: bookingsRaw } = await (supabase as any)
    .from('bookings')
    .select(`
      id, service_type, pickup_location, dropoff_location, status,
      messages(id, content, is_read, sender_id, created_at)
    `)
    .eq('provider_id', user.id)
    .in('status', ['confirmed', 'in_progress', 'completed'])
    .order('created_at', { ascending: false })

  type RawBooking = {
    id: string
    service_type: string
    pickup_location: string
    dropoff_location: string
    status: string
    messages: Array<{ id: string; content: string; is_read: boolean; sender_id: string; created_at: string }>
  }

  const bookings = (bookingsRaw ?? []) as RawBooking[]

  const threads = bookings.map(b => {
    const msgs = b.messages.sort((a, b) => a.created_at < b.created_at ? -1 : 1)
    const last = msgs[msgs.length - 1]
    return {
      booking_id: b.id,
      service_type: b.service_type,
      pickup_location: b.pickup_location,
      dropoff_location: b.dropoff_location,
      status: b.status,
      unread_count: msgs.filter(m => !m.is_read && m.sender_id !== user!.id).length,
      last_message: last?.content ?? null,
      last_message_at: last?.created_at ?? null,
    }
  }).sort((a, b) => (b.last_message_at ?? '') > (a.last_message_at ?? '') ? 1 : -1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-zinc-400 mt-1">Chat with your customers</p>
      </div>
      <BookingInbox threads={threads} role="provider" />
    </div>
  )
}
