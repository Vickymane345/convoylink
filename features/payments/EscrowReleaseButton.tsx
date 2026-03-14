'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Lock, Unlock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/helpers'

interface Props {
  bookingId: string
  providerAmount: number
  paymentStatus: string
  bookingStatus: string
}

export function EscrowReleaseButton({ bookingId, providerAmount, paymentStatus, bookingStatus }: Props) {
  const [loading, setLoading] = useState(false)
  const [released, setReleased] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const canRelease = paymentStatus === 'held' && bookingStatus === 'in_progress'

  if (paymentStatus === 'released' || released) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2.5 text-sm text-green-400">
        <CheckCircle2 className="h-4 w-4" />
        Payment Released to Provider
      </div>
    )
  }

  if (!canRelease) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Lock className="h-4 w-4" />
        {paymentStatus === 'held' ? 'Release available when trip is in progress' : `Payment ${paymentStatus}`}
      </div>
    )
  }

  const handleRelease = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payments/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Release failed')
      setReleased(true)
      setShowConfirm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4"
          >
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-300">Confirm Release</p>
                <p className="text-xs text-zinc-400 mt-1">
                  This will release <span className="text-white font-semibold">{formatCurrency(providerAmount)}</span> to
                  the provider. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                loading={loading}
                onClick={handleRelease}
                className="flex-1"
              >
                Confirm Release
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showConfirm && (
        <Button
          variant="secondary"
          className="gap-2 border-green-500/30 text-green-300 hover:text-white hover:bg-green-500/20"
          onClick={() => setShowConfirm(true)}
        >
          <Unlock className="h-4 w-4" />
          Release Escrow ({formatCurrency(providerAmount)})
        </Button>
      )}

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}
