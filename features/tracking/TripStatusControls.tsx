'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Props {
  tripId: string
  currentStatus: string
}

type TripAction = 'start' | 'complete' | 'cancel'

const TRANSITIONS: Record<string, { action: TripAction; label: string; nextStatus: string; variant: 'default' | 'outline' | 'destructive' }[]> = {
  pending:     [{ action: 'start',    label: 'Start Trip',      nextStatus: 'en_route',    variant: 'default' }],
  en_route:    [{ action: 'complete', label: 'Mark Arrived',    nextStatus: 'in_progress', variant: 'default' }],
  in_progress: [{ action: 'complete', label: 'Complete Trip',   nextStatus: 'completed',   variant: 'default' }],
}

export function TripStatusControls({ tripId, currentStatus }: Props) {
  const [loading, setLoading] = useState<TripAction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const transitions = TRANSITIONS[currentStatus] ?? []
  if (transitions.length === 0) return null

  const handleAction = async (action: TripAction, nextStatus: string) => {
    setLoading(action)
    setError(null)
    try {
      const res = await fetch('/api/trips/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip_id: tripId, status: nextStatus }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Update failed')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
      <h3 className="text-sm font-semibold text-zinc-400">Trip Controls</h3>
      <div className="flex flex-wrap gap-2">
        {transitions.map(({ action, label, nextStatus, variant }) => (
          <Button
            key={action}
            variant={variant}
            loading={loading === action}
            onClick={() => handleAction(action, nextStatus)}
            className="gap-2"
          >
            {action === 'start' && <Play className="h-4 w-4" />}
            {action === 'complete' && <CheckCircle2 className="h-4 w-4" />}
            {action === 'cancel' && <XCircle className="h-4 w-4" />}
            {label}
          </Button>
        ))}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
