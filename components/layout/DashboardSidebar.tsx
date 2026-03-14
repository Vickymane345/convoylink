'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, CalendarCheck, MapPin, MessageSquare, Star,
  Shield, Car, Users, TruckIcon, BarChart3, Settings, LogOut,
  Package, ClipboardList, DollarSign, Navigation,
} from 'lucide-react'
import { cn, getInitials } from '@/utils/helpers'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/useAuthStore'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/types'

type NavItem = { href: string; label: string; icon: React.ReactNode }

const navByRole: Record<UserRole, NavItem[]> = {
  customer: [
    { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/dashboard/bookings', label: 'My Bookings', icon: <CalendarCheck className="h-4 w-4" /> },
    { href: '/dashboard/messages', label: 'Messages', icon: <MessageSquare className="h-4 w-4" /> },
    { href: '/dashboard/reviews', label: 'My Reviews', icon: <Star className="h-4 w-4" /> },
  ],
  provider: [
    { href: '/provider/dashboard', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/provider/listings', label: 'Listings', icon: <Package className="h-4 w-4" /> },
    { href: '/provider/bookings', label: 'Bookings', icon: <ClipboardList className="h-4 w-4" /> },
    { href: '/provider/earnings', label: 'Earnings', icon: <DollarSign className="h-4 w-4" /> },
    { href: '/provider/messages', label: 'Messages', icon: <MessageSquare className="h-4 w-4" /> },
  ],
  driver: [
    { href: '/driver/dashboard', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/driver/assignments', label: 'Assignments', icon: <ClipboardList className="h-4 w-4" /> },
    { href: '/driver/messages', label: 'Messages', icon: <MessageSquare className="h-4 w-4" /> },
    { href: '/driver/tracking', label: 'Live Tracking', icon: <Navigation className="h-4 w-4" /> },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { href: '/admin/users', label: 'Users', icon: <Users className="h-4 w-4" /> },
    { href: '/admin/drivers', label: 'Drivers', icon: <TruckIcon className="h-4 w-4" /> },
    { href: '/admin/vehicles', label: 'Vehicles', icon: <Car className="h-4 w-4" /> },
    { href: '/admin/convoys', label: 'Live Convoys', icon: <MapPin className="h-4 w-4" /> },
    { href: '/admin/bookings', label: 'Bookings', icon: <CalendarCheck className="h-4 w-4" /> },
    { href: '/admin/disputes', label: 'Disputes', icon: <Shield className="h-4 w-4" /> },
  ],
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, clearUser } = useAuthStore()
  const role = user?.role ?? 'customer'
  const navItems = navByRole[role]

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    clearUser()
    window.location.href = '/'
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 border-r border-zinc-800 bg-zinc-950 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500">
            <Shield className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-white">
            Convoy<span className="text-orange-500">Link</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-2 mb-2 text-xs font-medium text-zinc-600 uppercase tracking-wider">
          {role === 'admin' ? 'Admin' : role === 'provider' ? 'Provider' : role === 'driver' ? 'Driver' : 'Account'}
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'text-white bg-zinc-800'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-500 rounded-full"
                    />
                  )}
                  <span className={cn(isActive ? 'text-orange-400' : '')}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-4 pt-4 border-t border-zinc-800">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user?.avatar_url || undefined} />
            <AvatarFallback className="text-xs">
              {user ? getInitials(user.full_name) : '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
            <p className="text-xs text-zinc-500 truncate capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-zinc-500 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
