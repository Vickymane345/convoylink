'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types'

export function useMessages(bookingId: string, initialMessages: Message[]) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  // Subscribe to realtime message inserts
  useEffect(() => {
    // Mark existing unread messages as read on mount
    fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId }),
    }).catch(() => null)

    const channel = supabase
      .channel(`messages:${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`,
        },
        async (payload) => {
          const newMsg = payload.new as Message
          // Fetch with sender profile if not present
          if (!newMsg.sender) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data } = await (supabase as any)
              .from('messages')
              .select('*, sender:user_profiles(id, full_name, avatar_url, role)')
              .eq('id', newMsg.id)
              .single()
            if (data) {
              setMessages(prev => [...prev, data as Message])
              return
            }
          }
          setMessages(prev => [...prev, newMsg])
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [bookingId, supabase])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, content }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Send failed')
      // Realtime will deliver the message — no need to push to state here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setSending(false)
    }
  }, [bookingId])

  return { messages, sendMessage, sending, error }
}
