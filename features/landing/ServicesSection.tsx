'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Shield, Car, UserCheck, ArrowRight, MapPin, Lock, Star, CheckCircle2 } from 'lucide-react'

const services = [
  {
    icon: Shield,
    title: 'Convoy Escort',
    tag: 'Protection',
    description: 'Armed and unarmed convoy protection for corporate, VIP, and logistics movements across all 36 states.',
    features: ['Armed & Unarmed Options', 'Real-time GPS Tracking', 'Ex-Military Personnel', 'Armored Vehicles'],
    href: '/convoy',
    accent: '#f97316',
    accentRgb: '249,115,22',
    badge: 'Most Popular',
    cardImage: '/images/bgImage7.jpg',
    tagBg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    ctaColor: 'text-orange-400 border-orange-500/40 hover:bg-orange-500/10 hover:border-orange-500/70',
    checkColor: 'text-orange-400',
  },
  {
    icon: Car,
    title: 'Vehicle Rental',
    tag: 'Mobility',
    description: 'Rent verified, insured vehicles for any occasion — sedans, SUVs, luxury cars, buses, and armored vehicles.',
    features: ['Verified & Insured Fleet', 'Flexible Daily Rates', 'Delivery Available', 'GPS-Equipped'],
    href: '/vehicles',
    accent: '#3b82f6',
    accentRgb: '59,130,246',
    badge: null,
    cardImage: '/images/bgImage8.jpg',
    tagBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    ctaColor: 'text-blue-400 border-blue-500/40 hover:bg-blue-500/10 hover:border-blue-500/70',
    checkColor: 'text-blue-400',
  },
  {
    icon: UserCheck,
    title: 'Driver Hire',
    tag: 'Chauffeur',
    description: 'Hire experienced, background-checked professional drivers for daily runs, long trips, or dedicated corporate hire.',
    features: ['Background Verified', 'Licensed & Experienced', 'Corporate & Personal', '24/7 Available'],
    href: '/drivers',
    accent: '#22c55e',
    accentRgb: '34,197,94',
    badge: null,
    cardImage: '/images/bgImage9.jpg',
    tagBg: 'bg-green-500/20 text-green-300 border-green-500/30',
    ctaColor: 'text-green-400 border-green-500/40 hover:bg-green-500/10 hover:border-green-500/70',
    checkColor: 'text-green-400',
  },
]

const trustItems = [
  { icon: Lock, color: 'text-green-400', text: 'Secure Escrow Payments' },
  { icon: MapPin, color: 'text-blue-400', text: 'Real-time GPS Tracking' },
  { icon: Star, color: 'text-yellow-400', text: 'Verified Providers Only' },
  { icon: Shield, color: 'text-orange-400', text: '24/7 Support' },
]

export function ServicesSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Section background */}
      <div className="absolute inset-0">
        <Image
          src="/images/bgImage2.jpg"
          alt=""
          fill
          quality={60}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-zinc-950/92" />
        <div className="absolute inset-0 bg-dot opacity-[0.10]" />
      </div>

      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

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

        {/* ── Service cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-16 sm:mb-20">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={service.href} className="group block">
                  <div className="relative rounded-3xl overflow-hidden h-[520px] sm:h-[560px] cursor-pointer">

                    {/* ── Full photo layer ── */}
                    <Image
                      src={service.cardImage}
                      alt={service.title}
                      fill
                      quality={85}
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    {/* Cinematic gradient overlay — heavy at bottom, light at top */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(
                          to bottom,
                          rgba(0,0,0,0.15) 0%,
                          rgba(0,0,0,0.1) 30%,
                          rgba(0,0,0,0.55) 60%,
                          rgba(0,0,0,0.92) 100%
                        )`,
                      }}
                    />

                    {/* Subtle color wash */}
                    <div
                      className="absolute inset-0 opacity-40 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-60"
                      style={{ background: `linear-gradient(160deg, rgba(${service.accentRgb},0.4) 0%, transparent 60%)` }}
                    />

                    {/* ── Top row: tag + badge ── */}
                    <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-sm ${service.tagBg}`}>
                        <Icon className="h-3 w-3" />
                        {service.tag}
                      </span>
                      {service.badge && (
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/40">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    {/* ── Bottom content panel ── */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">

                      {/* Title */}
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                        {service.title}
                      </h3>

                      {/* Accent line */}
                      <div
                        className="h-0.5 w-12 rounded-full mb-4 transition-all duration-500 group-hover:w-20"
                        style={{ background: service.accent }}
                      />

                      {/* Description */}
                      <p className="text-sm text-zinc-300 leading-relaxed mb-5">
                        {service.description}
                      </p>

                      {/* Features — slide up on hover */}
                      <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-40 opacity-0 group-hover:opacity-100">
                        <ul className="space-y-2 mb-5">
                          {service.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-xs text-zinc-200">
                              <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${service.checkColor}`} />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA button */}
                      <div
                        className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all duration-300 ${service.ctaColor}`}
                      >
                        Explore {service.title}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>

                    {/* Border glow on hover */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ boxShadow: `inset 0 0 0 1.5px rgba(${service.accentRgb},0.5)` }}
                    />
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
            {trustItems.map(({ icon: IconComp, color, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm text-zinc-400">
                <IconComp className={`h-4 w-4 ${color} shrink-0`} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
