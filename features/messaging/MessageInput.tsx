'use client'

import { useState, useRef } from 'react'
import { Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onSend: (content: string) => Promise<void>
  sending: boolean
  error: string | null
}

export function MessageInput({ onSend, sending, error }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = async () => {
    const trimmed = value.trim()
    if (!trimmed || sending) return
    setValue('')
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await onSend(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    // Auto-expand textarea
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`
    }
  }

  const canSend = value.trim().length > 0 && !sending

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-2">
        <div className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 focus-within:border-orange-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="w-full resize-none bg-transparent px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none max-h-[120px]"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleSend}
          disabled={!canSend}
          className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            canSend
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          {sending ? (
            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400 px-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
