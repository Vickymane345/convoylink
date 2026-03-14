'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  bookingId: string
  currentStatus: string
}

export function AdminBookingActions({ bookingId, currentStatus }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const doAction = async (action: string) => {
    setLoading(true)
    setOpen(false)
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId, action }),
    })
    setLoading(false)
    router.refresh()
  }

  const canDispute = ['confirmed', 'in_progress'].includes(currentStatus)
  const canCancel = ['pending', 'confirmed'].includes(currentStatus)
  const canResolve = currentStatus === 'disputed'

  if (!canDispute && !canCancel && !canResolve) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        disabled={loading}
        className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 top-8 z-50 w-44 rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl py-1"
          >
            {canResolve && (
              <button
                onClick={() => doAction('resolve')}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-green-400 hover:text-green-300 hover:bg-zinc-800 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                Resolve Dispute
              </button>
            )}
            {canDispute && (
              <button
                onClick={() => doAction('dispute')}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-yellow-400 hover:text-yellow-300 hover:bg-zinc-800 transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
                Flag Dispute
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => doAction('cancel')}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Cancel Booking
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
