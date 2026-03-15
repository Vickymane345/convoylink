'use client'

import Link from 'next/link'
import { Twitter, Linkedin, Instagram, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { FaHeart } from 'react-icons/fa'
import { GiNigeria } from 'react-icons/gi'
import { Logo } from '@/components/brand/Logo'
import { useState } from 'react'

const services = [
  { label: 'Convoy Escort', href: '/convoy' },
  { label: 'Vehicle Rental', href: '/vehicles' },
  { label: 'Driver Hire', href: '/drivers' },
  { label: 'Corporate Logistics', href: '/convoy' },
]

const company = [
  { label: 'About Us', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Press', href: '#' },
  { label: 'Contact', href: '#' },
]

const legal = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Cookie Policy', href: '#' },
  { label: 'Refund Policy', href: '#' },
]

const socials = [
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <footer className="relative border-t border-zinc-800/70 bg-zinc-950 overflow-hidden">
      {/* Top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/25 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 rounded-full blur-[60px] bg-orange-500/[0.05] pointer-events-none" />
      {/* Dot pattern */}
      <div className="absolute inset-0 bg-dot opacity-[0.06] pointer-events-none" />

      {/* ── Newsletter banner ── */}
      <div className="relative border-b border-zinc-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-md">
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                Stay updated on safety &amp; logistics
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Get convoy route advisories, new service alerts, and exclusive offers.
              </p>
            </div>

            {submitted ? (
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium text-green-400">You&apos;re subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 h-11 rounded-xl bg-zinc-900 border border-zinc-700/60 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 px-5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-orange-500/20"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Main footer content ── */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">

          {/* Brand — spans 2 cols */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex mb-5 group">
              <Logo iconSize={34} textSize="text-lg" className="group-hover:opacity-90 transition-opacity" />
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed mb-5 max-w-xs">
              Nigeria&apos;s premier marketplace for convoy escort services, vehicle rental, and professional driver hire. Move safely, anywhere.
            </p>

            {/* Contact info */}
            <ul className="space-y-2.5 mb-5">
              <li className="flex items-center gap-2.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors group">
                <Mail className="h-3.5 w-3.5 text-zinc-600 group-hover:text-orange-500/70 shrink-0 transition-colors" />
                support@convoylink.com
              </li>
              <li className="flex items-center gap-2.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors group">
                <Phone className="h-3.5 w-3.5 text-zinc-600 group-hover:text-orange-500/70 shrink-0 transition-colors" />
                +234 800 CONVOY
              </li>
              <li className="flex items-center gap-2.5 text-xs text-zinc-500">
                <MapPin className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                Lagos · Abuja · Port Harcourt
              </li>
            </ul>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-orange-300 hover:bg-orange-500/15 border border-zinc-700/50 hover:border-orange-500/25 transition-all duration-200"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.1em] mb-4">Services</h4>
            <ul className="space-y-2.5">
              {services.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors duration-150 link-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.1em] mb-4">Company</h4>
            <ul className="space-y-2.5">
              {company.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors duration-150 link-underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-[0.1em] mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {legal.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors duration-150 link-underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">© 2025 ConvoyLink. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-600 flex items-center gap-1">
              Made with <FaHeart className="text-red-500 h-3 w-3" /> in Nigeria <GiNigeria className="text-green-500 h-3.5 w-3.5" />
            </span>
            <span className="h-3.5 w-px bg-zinc-700" />
            <div className="flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-zinc-500">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
