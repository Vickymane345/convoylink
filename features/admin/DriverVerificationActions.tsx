'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  driverId: string
  currentStatus: string
}

export function DriverVerificationActions({ driverId, currentStatus }: Props) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const doAction = async (status: string) => {
    setLoading(status)
    await fetch('/api/admin/drivers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driver_id: driverId, verification_status: status }),
    })
    setLoading(null)
    router.refresh()
  }

  if (currentStatus === 'approved') {
    return (
      <Button
        size="sm"
        variant="outline"
        loading={loading === 'suspended'}
        onClick={() => doAction('suspended')}
        className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1.5 text-xs"
      >
        <Ban className="h-3.5 w-3.5" />
        Suspend
      </Button>
    )
  }

  if (currentStatus === 'suspended' || currentStatus === 'rejected') {
    return (
      <Button
        size="sm"
        loading={loading === 'approved'}
        onClick={() => doAction('approved')}
        className="gap-1.5 text-xs"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Re-approve
      </Button>
    )
  }

  // pending
  return (
    <div className="flex gap-1.5">
      <Button
        size="sm"
        loading={loading === 'approved'}
        onClick={() => doAction('approved')}
        className="gap-1.5 text-xs"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        loading={loading === 'rejected'}
        onClick={() => doAction('rejected')}
        className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1.5 text-xs"
      >
        <XCircle className="h-3.5 w-3.5" />
        Reject
      </Button>
    </div>
  )
}
