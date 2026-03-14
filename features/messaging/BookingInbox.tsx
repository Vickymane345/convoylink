'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { MessageCircle, MessageSquare, Shield, Car, UserCheck, ChevronRight } from 'lucide-react'
import { formatDateTime } from '@/utils/helpers'
import { Badge } from '@/components/ui/badge'

type BookingThread = {
  booking_id: string
  service_type: string
  pickup_location: string
  dropoff_location: string
  status: string
  unread_count: number
  last_message: string | null
  last_message_at: string | null
}

interface Props {
  threads: BookingThread[]
  role: 'customer' | 'provider' | 'driver'
}

const serviceIcons = {
  convoy: <Shield className="h-4 w-4 text-orange-400" />,
  vehicle: <Car className="h-4 w-4 text-blue-400" />,
  driver: <UserCheck className="h-4 w-4 text-green-400" />,
}

const basePaths: Record<string, string> = {
  customer: '/dashboard/messages',
  provider: '/provider/messages',
  driver:   '/driver/messages',
}

export function BookingInbox({ threads, role }: Props) {
  const [search, setSearch] = useState('')
  const base = basePaths[role]

  const filtered = threads.filter(t =>
    t.pickup_location.toLowerCase().includes(search.toLowerCase()) ||
    t.dropoff_location.toLowerCase().includes(search.toLowerCase())
  )

  if (threads.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 py-16 text-center">
        <MessageCircle className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No conversations yet</h3>
        <p className="text-sm text-zinc-500">Messages from your bookings will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search conversations…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-orange-500/50 transition-colors"
      />

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 divide-y divide-zinc-800 overflow-hidden">
        <AnimatePresence>
          {filtered.map((thread, i) => (
            <motion.div
              key={thread.booking_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={`${base}/${thread.booking_id}`}>
                <div className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-800/40 transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                    {serviceIcons[thread.service_type as keyof typeof serviceIcons] ?? <MessageSquare className="h-4 w-4 text-zinc-500" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-white capitalize truncate">
                        {thread.service_type} booking
                      </p>
                      {thread.unread_count > 0 && (
                        <span className="h-5 min-w-5 px-1.5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {thread.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 truncate">
                      {thread.pickup_location} → {thread.dropoff_location}
                    </p>
                    {thread.last_message && (
                      <p className="text-xs text-zinc-600 mt-0.5 truncate">{thread.last_message}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {thread.last_message_at && (
                      <span className="text-xs text-zinc-600">{formatDateTime(thread.last_message_at)}</span>
                    )}
                    <Badge variant={thread.status === 'in_progress' ? 'info' : thread.status === 'completed' ? 'success' : 'warning'} className="text-[10px]">
                      {thread.status.replace('_', ' ')}
                    </Badge>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-700" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-8 text-center text-zinc-500 text-sm">No conversations match your search.</div>
        )}
      </div>
    </div>
  )
}
