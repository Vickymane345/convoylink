'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, Bell, User, LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/useAuthStore'
import { getInitials } from '@/utils/helpers'
import { Logo } from '@/components/brand/Logo'

const navLinks = [
  { href: '/convoy', label: 'Convoy Services' },
  { href: '/vehicles', label: 'Vehicle Rental' },
  { href: '/drivers', label: 'Hire Drivers' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, clearUser } = useAuthStore()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleSignOut = async () => {
    clearUser()
    await fetch('/api/auth/signout', { method: 'POST' })
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
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-white/[0.07] shadow-lg shadow-black/20'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="shrink-0 group">
              <Logo
                iconSize={32}
                textSize="text-lg"
                className="group-hover:opacity-90 transition-opacity duration-200"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    pathname.startsWith(link.href)
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {pathname.startsWith(link.href) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-white/10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 shrink-0">
              {user ? (
                <>
                  {/* Notifications */}
                  <button
                    aria-label="Notifications"
                    className="relative h-9 w-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/10 transition-colors"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="text-xs bg-orange-500/20 text-orange-300">
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block text-sm text-zinc-300 max-w-[90px] truncate">
                        {user.full_name?.split(' ')[0] ?? 'Account'}
                      </span>
                      <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <>
                          {/* Backdrop */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setUserMenuOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-zinc-700/60 bg-zinc-900 shadow-xl shadow-black/50 overflow-hidden z-20"
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
                                <LayoutDashboard className="h-4 w-4 text-zinc-500" />
                                Dashboard
                              </Link>
                              <Link
                                href="/dashboard/profile"
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <User className="h-4 w-4 text-zinc-500" />
                                Profile
                              </Link>
                              <div className="my-1 h-px bg-zinc-800" />
                              <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                              >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className="hidden sm:block">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}

              {/* Mobile Toggle */}
              <button
                aria-label="Toggle menu"
                className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mobileOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </motion.div>
                </AnimatePresence>
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
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="md:hidden border-t border-white/[0.06] overflow-hidden glass"
            >
              <nav className="px-4 py-3 flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname.startsWith(link.href)
                        ? 'text-white bg-white/10'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {!user && (
                  <div className="flex gap-2 pt-3 mt-2 border-t border-white/[0.06]">
                    <Link href="/sign-in" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/sign-up" className="flex-1">
                      <Button size="sm" className="w-full">Get Started</Button>
                    </Link>
                  </div>
                )}

                {user && (
                  <div className="pt-3 mt-2 border-t border-white/[0.06] space-y-0.5">
                    <Link
                      href={getDashboardHref()}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-zinc-500" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
