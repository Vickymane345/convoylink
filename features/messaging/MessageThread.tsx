'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useMessages } from '@/hooks/useMessages'
import { MessageInput } from './MessageInput'
import type { Message } from '@/types'

interface Props {
  bookingId: string
  currentUserId: string
  initialMessages: Message[]
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDay(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function MessageThread({ bookingId, currentUserId, initialMessages }: Props) {
  const { messages, sendMessage, sending, error } = useMessages(bookingId, initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Group messages by day
  const grouped: { day: string; msgs: Message[] }[] = []
  for (const msg of messages) {
    const day = formatDay(msg.created_at)
    const last = grouped[grouped.length - 1]
    if (last?.day === day) {
      last.msgs.push(msg)
    } else {
      grouped.push({ day, msgs: [msg] })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <MessageCircle className="h-10 w-10 text-zinc-700 mb-3" />
            <p className="text-sm text-zinc-500">No messages yet.</p>
            <p className="text-xs text-zinc-600 mt-1">Start the conversation below.</p>
          </div>
        ) : (
          grouped.map(({ day, msgs }) => (
            <div key={day}>
              {/* Day divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-xs text-zinc-600 px-2">{day}</span>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {msgs.map((msg) => {
                    const isMine = msg.sender_id === currentUserId
                    const senderName = msg.sender?.full_name ?? 'User'
                    const initials = senderName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.15 }}
                        className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        {!isMine && (
                          <div className="h-7 w-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300 shrink-0 mb-0.5">
                            {initials}
                          </div>
                        )}

                        <div className={`max-w-[72%] space-y-0.5 ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                          {!isMine && (
                            <span className="text-xs text-zinc-500 px-1">{senderName}</span>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                              isMine
                                ? 'bg-orange-500 text-white rounded-br-sm'
                                : 'bg-zinc-800 text-zinc-200 rounded-bl-sm'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className={`text-xs text-zinc-600 px-1 ${isMine ? 'text-right' : 'text-left'}`}>
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 px-4 py-3">
        <MessageInput onSend={sendMessage} sending={sending} error={error} />
      </div>
    </div>
  )
}
