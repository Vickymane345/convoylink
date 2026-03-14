'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Shield, Menu, X, ChevronDown, Bell, User, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/useAuthStore'
import { getInitials } from '@/utils/helpers'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/convoy', label: 'Convoy Services' },
  { href: '/vehicles', label: 'Vehicle Rental' },
  { href: '/drivers', label: 'Hire Drivers' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, clearUser } = useAuthStore()
  const pathname = usePathname()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    clearUser()
    window.location.href = '/'
  }

  const getDashboardHref = () => {
    if (!user) return '/dashboard'
    if (user.role === 'admin') return '/admin/dashboard'
    if (user.role === 'provider') return '/provider/dashboard'
    if (user.role === 'driver') return '/driver/dashboard'
    return '/dashboard'
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="glass border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                Convoy<span className="text-orange-500">Link</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith(link.href)
                      ? 'text-white bg-white/10'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {/* Notifications */}
                  <button className="relative h-9 w-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500" />
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/10 transition-colors"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block text-sm text-zinc-300 max-w-[100px] truncate">
                        {user.full_name.split(' ')[0]}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-zinc-700/50 bg-zinc-900 shadow-xl shadow-black/40 overflow-hidden"
                          onMouseLeave={() => setUserMenuOpen(false)}
                        >
                          <div className="px-3 py-2.5 border-b border-zinc-800">
                            <p className="text-sm font-medium text-white truncate">{user.full_name}</p>
                            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                          </div>
                          <div className="p-1">
                            <Link
                              href={getDashboardHref()}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              Dashboard
                            </Link>
                            <Link
                              href="/dashboard/profile"
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <User className="h-4 w-4" />
                              Profile
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}

              {/* Mobile Toggle */}
              <button
                className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/[0.06] overflow-hidden"
            >
              <nav className="px-4 py-3 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
