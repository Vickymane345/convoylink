'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, CalendarCheck, MessageSquare, Star,
  Package, DollarSign, Navigation, ClipboardList,
  Users, BarChart3, Car, MapPin,
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/utils/helpers'
import type { UserRole } from '@/types'

type TabItem = { href: string; label: string; icon: React.ElementType }

// Show max 5 tabs per role — pick the most-used ones
const tabsByRole: Record<UserRole, TabItem[]> = {
  customer: [
    { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/dashboard/bookings', label: 'Bookings', icon: CalendarCheck },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  ],
  provider: [
    { href: '/provider/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/provider/listings', label: 'Listings', icon: Package },
    { href: '/provider/bookings', label: 'Bookings', icon: ClipboardList },
    { href: '/provider/earnings', label: 'Earnings', icon: DollarSign },
    { href: '/provider/messages', label: 'Messages', icon: MessageSquare },
  ],
  driver: [
    { href: '/driver/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/driver/assignments', label: 'Jobs', icon: ClipboardList },
    { href: '/driver/tracking', label: 'Tracking', icon: Navigation },
    { href: '/driver/messages', label: 'Messages', icon: MessageSquare },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
    { href: '/admin/vehicles', label: 'Vehicles', icon: Car },
    { href: '/admin/convoys', label: 'Convoys', icon: MapPin },
  ],
}

export function DashboardBottomTabs() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const role: UserRole = (user?.role as UserRole) ?? 'customer'
  const tabs = tabsByRole[role] ?? tabsByRole.customer

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
      {/* Top glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

      <div className={`grid h-16 px-2`} style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive =
            pathname === tab.href ||
            (tab.href !== '/dashboard' &&
              tab.href !== '/admin/dashboard' &&
              tab.href !== '/provider/dashboard' &&
              tab.href !== '/driver/dashboard' &&
              pathname.startsWith(tab.href))

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-150',
                isActive ? 'text-orange-400' : 'text-zinc-500 hover:text-zinc-300',
              )}
            >
              {/* Active pill indicator */}
              {isActive && (
                <motion.div
                  layoutId="tab-active-bg"
                  className="absolute inset-x-1 inset-y-1.5 rounded-xl bg-orange-500/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}

              {/* Active top dot */}
              {isActive && (
                <motion.div
                  layoutId="tab-active-dot"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-orange-500"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}

              <Icon className={cn('relative h-5 w-5 shrink-0', isActive && 'drop-shadow-[0_0_6px_rgba(249,115,22,0.6)]')} />
              <span className="relative text-[10px] font-medium leading-none truncate max-w-full px-1">
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
