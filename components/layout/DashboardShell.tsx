'use client'

import { useState } from 'react'
import { Menu, Shield } from 'lucide-react'
import Link from 'next/link'
import { DashboardSidebar } from './DashboardSidebar'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-950">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="h-9 w-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-500">
            <Shield className="h-3 w-3 text-white" />
          </div>
          <span className="font-bold text-white text-sm">
            Convoy<span className="text-orange-500">Link</span>
          </span>
        </Link>
      </div>

      <main className="lg:ml-60 min-h-screen pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
