import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'
import { MessageThread } from '@/features/messaging/MessageThread'
import type { Message } from '@/types'

export const metadata = { title: 'Conversation' }

export default async function ProviderThreadPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const admin = await createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: booking } = await (admin as any)
    .from('bookings')
    .select('id, service_type, pickup_location, dropoff_location, status, provider_id')
    .eq('id', bookingId)
    .eq('provider_id', user.id)
    .single() as { data: { id: string; service_type: string; pickup_location: string; dropoff_location: string; status: string; provider_id: string } | null }

  if (!booking) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: messagesRaw } = await (admin as any)
    .from('messages')
    .select('*, sender:user_profiles(id, full_name, avatar_url, role)')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: true })

  const messages = (messagesRaw ?? []) as Message[]

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Link href="/provider/messages" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-white capitalize truncate">
            {booking.service_type} booking
          </h1>
          <p className="text-xs text-zinc-500 flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 shrink-0" />
            {booking.pickup_location} → {booking.dropoff_location}
          </p>
        </div>
      </div>

      <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden flex flex-col min-h-0">
        <MessageThread
          bookingId={bookingId}
          currentUserId={user.id}
          initialMessages={messages}
        />
      </div>
    </div>
  )
}
