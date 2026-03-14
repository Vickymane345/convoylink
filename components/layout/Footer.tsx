import Link from 'next/link'
import { Twitter, Linkedin, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import { FaHeart } from 'react-icons/fa'
import { GiNigeria } from 'react-icons/gi'
import { Logo } from '@/components/brand/Logo'

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
  return (
    <footer className="relative border-t border-zinc-800/70 bg-zinc-950 overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 rounded-full blur-[60px] bg-orange-500/[0.04] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">

          {/* Brand — spans 2 cols on md */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex mb-5 group">
              <Logo iconSize={34} textSize="text-lg" className="group-hover:opacity-90 transition-opacity" />
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed mb-5 max-w-xs">
              Nigeria&apos;s premier marketplace for convoy escort services, vehicle rental, and professional driver hire. Move safely, anywhere.
            </p>

            {/* Contact info */}
            <ul className="space-y-2 mb-5">
              <li className="flex items-center gap-2 text-xs text-zinc-500">
                <Mail className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                support@convoylink.com
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-500">
                <Phone className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                +234 800 CONVOY
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-500">
                <MapPin className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                Lagos, Abuja, Port Harcourt
              </li>
            </ul>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-orange-500/20 hover:text-orange-300 border border-zinc-700/50 hover:border-orange-500/30 transition-all duration-200"
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
                    className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
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
                    className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
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
                    className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
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
