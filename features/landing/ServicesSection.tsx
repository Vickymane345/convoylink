'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Car, UserCheck, ArrowRight, MapPin, Lock, Star, CheckCircle2 } from 'lucide-react'

const services = [
  {
    icon: Shield,
    title: 'Convoy Escort',
    description: 'Armed and unarmed convoy protection for corporate, VIP, and logistics movements across all 36 states.',
    features: ['Armed & Unarmed Options', 'Real-time GPS Tracking', 'Ex-Military Personnel', 'Armored Vehicles'],
    href: '/convoy',
    color: 'orange',
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.15)',
    gradient: 'from-orange-500/[0.08] via-orange-500/[0.04] to-transparent',
    border: 'border-orange-500/[0.15] hover:border-orange-500/40',
    badge: 'Most Popular',
  },
  {
    icon: Car,
    title: 'Vehicle Rental',
    description: 'Rent verified, insured vehicles for any occasion — sedans, SUVs, luxury cars, buses, and armored vehicles.',
    features: ['Verified & Insured Fleet', 'Flexible Daily Rates', 'Delivery Available', 'GPS-Equipped'],
    href: '/vehicles',
    color: 'blue',
    accent: '#3b82f6',
    glow: 'rgba(59,130,246,0.12)',
    gradient: 'from-blue-500/[0.08] via-blue-500/[0.04] to-transparent',
    border: 'border-blue-500/[0.15] hover:border-blue-500/40',
    badge: null,
  },
  {
    icon: UserCheck,
    title: 'Driver Hire',
    description: 'Hire experienced, background-checked professional drivers for daily runs, long trips, or dedicated corporate hire.',
    features: ['Background Verified', 'Licensed & Experienced', 'Corporate & Personal', '24/7 Available'],
    href: '/drivers',
    color: 'green',
    accent: '#22c55e',
    glow: 'rgba(34,197,94,0.12)',
    gradient: 'from-green-500/[0.08] via-green-500/[0.04] to-transparent',
    border: 'border-green-500/[0.15] hover:border-green-500/40',
    badge: null,
  },
]

const colorText: Record<string, string> = {
  orange: 'text-orange-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
}
const colorBg: Record<string, string> = {
  orange: 'bg-orange-500/10',
  blue: 'bg-blue-500/10',
  green: 'bg-green-500/10',
}
const colorBadge: Record<string, string> = {
  orange: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
  blue: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  green: 'bg-green-500/15 text-green-300 border-green-500/25',
}

const trustItems = [
  { icon: Lock, color: 'text-green-400', text: 'Secure Escrow Payments' },
  { icon: MapPin, color: 'text-blue-400', text: 'Real-time GPS Tracking' },
  { icon: Star, color: 'text-yellow-400', text: 'Verified Providers Only' },
  { icon: Shield, color: 'text-orange-400', text: '24/7 Support' },
]

export function ServicesSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-zinc-950 overflow-hidden">
      {/* Subtle top separator glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-block text-xs sm:text-sm font-semibold text-orange-400 uppercase tracking-[0.15em] mb-3">
            What We Offer
          </span>
          <h2 className="text-section font-bold text-white mb-4">
            Every service you need,{' '}
            <span className="gradient-text">one platform</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Whether you need armed protection, a rental car, or a trusted driver —
            ConvoyLink connects you to verified professionals across Nigeria.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-16 sm:mb-20">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Popular badge */}
                {service.badge && (
                  <div className={`absolute -top-3 left-6 z-10 text-xs font-semibold px-3 py-1 rounded-full border ${colorBadge[service.color]}`}>
                    {service.badge}
                  </div>
                )}

                <Link href={service.href} className="group block h-full">
                  <div
                    className={`relative h-full rounded-2xl border bg-gradient-to-b ${service.gradient} ${service.border} p-6 sm:p-7 transition-all duration-300 card-lift overflow-hidden`}
                    style={{ background: `linear-gradient(160deg, ${service.glow} 0%, rgba(24,24,27,0.6) 60%)` }}
                  >
                    {/* Hover beam */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${service.glow} 0%, transparent 70%)` }}
                    />

                    {/* Icon */}
                    <div className={`relative inline-flex h-14 w-14 items-center justify-center rounded-2xl ${colorBg[service.color]} ${colorText[service.color]} mb-5 group-hover:scale-110 transition-transform duration-300`}
                      style={{ boxShadow: `0 0 20px ${service.glow}` }}>
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6">{service.description}</p>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-8">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                          <CheckCircle2 className={`h-4 w-4 shrink-0 ${colorText[service.color]}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className={`flex items-center gap-2 text-sm font-semibold ${colorText[service.color]} group-hover:gap-3 transition-all duration-200`}>
                      Browse {service.title}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative rounded-2xl border border-zinc-800/60 bg-zinc-900/40 px-6 py-5 overflow-hidden"
        >
          <div className="shimmer absolute inset-0 rounded-2xl" />
          <div className="relative flex flex-wrap justify-center gap-6 sm:gap-10 lg:gap-16">
            {trustItems.map(({ icon: Icon, color, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm text-zinc-400">
                <Icon className={`h-4 w-4 ${color} shrink-0`} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
