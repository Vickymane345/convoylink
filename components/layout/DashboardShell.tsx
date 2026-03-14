'use client'

import { Shield } from 'lucide-react'
import Link from 'next/link'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardBottomTabs } from './DashboardBottomTabs'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">

      {/* ── Decorative background ────────────────────── */}
      {/* Dot grid */}
      <div className="fixed inset-0 bg-dot opacity-[0.18] pointer-events-none" />
      {/* Radial orange glow — top left */}
      <div
        className="fixed -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }}
      />
      {/* Radial blue glow — bottom right */}
      <div
        className="fixed -bottom-48 -right-48 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)' }}
      />
      {/* Subtle top gradient bar */}
      <div className="fixed top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/15 to-transparent pointer-events-none" />

      {/* ── Desktop Sidebar ──────────────────────────── */}
      <DashboardSidebar />

      {/* ── Mobile top bar ───────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md flex items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-500">
            <Shield className="h-3 w-3 text-white" />
          </div>
          <span className="font-bold text-white text-sm">
            Convoy<span className="text-orange-500">Link</span>
          </span>
        </Link>
      </div>

      {/* ── Main content ─────────────────────────────── */}
      <main className="relative z-10 lg:ml-60 min-h-screen pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom tabs ───────────────────────── */}
      <DashboardBottomTabs />
    </div>
  )
}
