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
import type { UserRole } from '@/types'
import { Logo } from '@/components/brand/Logo'

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
  const role = (user?.role as UserRole) ?? 'customer'
  const navItems = navByRole[role]

  const handleSignOut = async () => {
    clearUser()
    await fetch('/api/auth/signout', { method: 'POST' })
    window.location.href = '/'
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 border-r border-zinc-800/70 bg-zinc-950 flex-col z-50 overflow-hidden">

      {/* Sidebar ambient glow */}
      <div
        className="absolute top-0 right-0 w-32 h-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(249,115,22,0.06) 0%, transparent 70%)' }}
      />

      {/* Logo */}
      <div className="relative px-5 py-5 border-b border-zinc-800/70">
        <Link href="/" className="group inline-flex">
          <Logo iconSize={28} textSize="text-base" className="group-hover:opacity-90 transition-opacity" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.12em]">
          {role === 'admin' ? 'Admin Panel' : role === 'provider' ? 'Provider' : role === 'driver' ? 'Driver' : 'My Account'}
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin/dashboard' && item.href !== '/provider/dashboard' && item.href !== '/driver/dashboard' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'text-white bg-zinc-800/80'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-500 rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className={cn('shrink-0', isActive ? 'text-orange-400' : '')}>{item.icon}</span>
                  {item.label}

                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-glow"
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.06) 0%, transparent 80%)' }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-4 pt-4 border-t border-zinc-800/70">
          <Link
            href="/dashboard/settings"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors',
              pathname === '/dashboard/settings' && 'text-white bg-zinc-800/80',
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            Settings
          </Link>
        </div>
      </nav>

      {/* User footer */}
      <div className="relative px-3 py-4 border-t border-zinc-800/70">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-zinc-800/40 transition-colors">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user?.avatar_url || undefined} />
            <AvatarFallback className="text-xs bg-orange-500/15 text-orange-300">
              {user ? getInitials(user.full_name) : '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
            <p className="text-xs text-zinc-500 truncate capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-zinc-500 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
