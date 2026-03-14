'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'

interface Props {
  bookingId: string
  status: string
}

export function ProviderBookingActions({ bookingId, status }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  const updateStatus = async (newStatus: string) => {
    setLoading(newStatus)
    await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    window.location.reload()
  }

  if (status === 'pending') {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          loading={loading === 'confirmed'}
          onClick={() => updateStatus('confirmed')}
          className="gap-1"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          loading={loading === 'cancelled'}
          onClick={() => updateStatus('cancelled')}
          className="gap-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
        >
          <XCircle className="h-3.5 w-3.5" />
          Decline
        </Button>
      </div>
    )
  }

  if (status === 'confirmed') {
    return (
      <Button
        size="sm"
        variant="secondary"
        loading={loading === 'in_progress'}
        onClick={() => updateStatus('in_progress')}
      >
        Start Trip
      </Button>
    )
  }

  if (status === 'in_progress') {
    return (
      <Button
        size="sm"
        loading={loading === 'completed'}
        onClick={() => updateStatus('completed')}
      >
        Mark Arrived
      </Button>
    )
  }

  return <span className="text-xs text-zinc-600 capitalize">{status.replace('_', ' ')}</span>
}
