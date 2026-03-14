'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  CalendarCheck, MapPin, Shield, Car, UserCheck,
  ChevronDown, ChevronUp, Navigation, MessageSquare,
  Clock, CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/utils/helpers'
import { bookingStatusConfig } from '@/services/bookingService'
import type { Booking } from '@/types'

type BookingWithPayment = Booking & {
  payment?: { status: string; stripe_session_id: string | null } | null
}

interface Props {
  bookings: BookingWithPayment[]
}

const serviceIcons = {
  convoy: <Shield className="h-4 w-4 text-orange-400" />,
  vehicle: <Car className="h-4 w-4 text-blue-400" />,
  driver: <UserCheck className="h-4 w-4 text-green-400" />,
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5" />,
  confirmed: <CheckCircle2 className="h-3.5 w-3.5" />,
  in_progress: <Navigation className="h-3.5 w-3.5" />,
  completed: <CheckCircle2 className="h-3.5 w-3.5" />,
  cancelled: <XCircle className="h-3.5 w-3.5" />,
  disputed: <AlertTriangle className="h-3.5 w-3.5" />,
}

export function BookingsList({ bookings }: Props) {
  const [filter, setFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filters = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled']

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter)

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 py-16 text-center">
        <CalendarCheck className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No bookings yet</h3>
        <p className="text-sm text-zinc-500 mb-6">Your bookings will appear here once you book a service.</p>
        <Link href="/convoy">
          <Button>Browse Services</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {f === 'all' ? `All (${bookings.length})` : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((booking, i) => {
            const isExpanded = expandedId === booking.id
            const statusConfig = bookingStatusConfig[booking.status]

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden"
              >
                {/* Header row */}
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                >
                  <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                    {serviceIcons[booking.service_type]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-white capitalize">
                        {booking.service_type} Service
                      </p>
                      <Badge variant={statusConfig.color}>
                        <span className="flex items-center gap-1">
                          {statusIcons[booking.status]}
                          {statusConfig.label}
                        </span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">{booking.pickup_location}</span>
                      </span>
                      <span>→</span>
                      <span className="truncate max-w-[120px]">{booking.dropoff_location}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 mr-2">
                    <p className="text-sm font-bold text-white">{formatCurrency(booking.total_amount)}</p>
                    <p className="text-xs text-zinc-500">{formatDateTime(booking.scheduled_at)}</p>
                  </div>

                  <div className="text-zinc-600">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-zinc-800 overflow-hidden"
                    >
                      <div className="p-5 space-y-4">
                        {/* Details grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-zinc-500 text-xs mb-1">Booking ID</p>
                            <p className="text-zinc-300 font-mono text-xs">{booking.id.slice(0, 12)}...</p>
                          </div>
                          <div>
                            <p className="text-zinc-500 text-xs mb-1">Scheduled</p>
                            <p className="text-zinc-300">{formatDateTime(booking.scheduled_at)}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500 text-xs mb-1">Payment Status</p>
                            <p className="text-zinc-300 capitalize">
                              {booking.payment?.status ?? 'Pending'}
                            </p>
                          </div>
                        </div>

                        {/* Price breakdown */}
                        <div className="rounded-xl bg-zinc-800/50 p-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-zinc-400">Service amount</span>
                            <span className="text-zinc-300">{formatCurrency(booking.provider_amount)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-zinc-400">Platform fee</span>
                            <span className="text-zinc-300">{formatCurrency(booking.platform_fee)}</span>
                          </div>
                          <div className="h-px bg-zinc-700 mb-2" />
                          <div className="flex justify-between text-sm font-bold">
                            <span className="text-white">Total paid</span>
                            <span className="text-orange-400">{formatCurrency(booking.total_amount)}</span>
                          </div>
                        </div>

                        {booking.notes && (
                          <div>
                            <p className="text-zinc-500 text-xs mb-1">Notes</p>
                            <p className="text-zinc-300 text-sm">{booking.notes}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {['confirmed', 'in_progress'].includes(booking.status) && (
                            <Link href={`/dashboard/bookings/${booking.id}/track`}>
                              <Button size="sm" className="gap-2">
                                <Navigation className="h-3.5 w-3.5" />
                                Track Live
                              </Button>
                            </Link>
                          )}
                          {(booking.status === 'confirmed' || booking.status === 'in_progress') && (
                            <Link href={`/dashboard/messages?booking=${booking.id}`}>
                              <Button size="sm" variant="secondary" className="gap-2">
                                <MessageSquare className="h-3.5 w-3.5" />
                                Message
                              </Button>
                            </Link>
                          )}
                          {booking.status === 'pending' && !booking.payment?.stripe_session_id && (
                            <Link href={`/api/payments/checkout?booking_id=${booking.id}`}>
                              <Button size="sm" variant="default" className="gap-2">
                                Complete Payment
                              </Button>
                            </Link>
                          )}
                          {booking.status === 'pending' && (
                            <CancelBookingButton bookingId={booking.id} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-zinc-500 text-sm">
            No {filter} bookings found.
          </div>
        )}
      </div>
    </div>
  )
}

function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setLoading(true)
    await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    window.location.reload()
  }

  return (
    <Button size="sm" variant="outline" loading={loading} onClick={handleCancel} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
      Cancel Booking
    </Button>
  )
}
