'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, ShieldCheck, ShieldOff, UserX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  userId: string
  currentRole: string
  isVerified: boolean
}

export function AdminUserActions({ userId, currentRole, isVerified }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const doAction = async (action: 'verify' | 'unverify' | 'suspend') => {
    setLoading(true)
    setOpen(false)
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, action }),
    })
    setLoading(false)
    router.refresh()
  }

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
            {!isVerified ? (
              <button
                onClick={() => doAction('verify')}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <ShieldCheck className="h-4 w-4 text-green-400" />
                Verify User
              </button>
            ) : (
              <button
                onClick={() => doAction('unverify')}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <ShieldOff className="h-4 w-4 text-yellow-400" />
                Unverify
              </button>
            )}
            {currentRole !== 'admin' && (
              <button
                onClick={() => doAction('suspend')}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition-colors"
              >
                <UserX className="h-4 w-4" />
                Suspend
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
