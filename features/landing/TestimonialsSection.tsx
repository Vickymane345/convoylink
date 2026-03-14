'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Emeka Okafor',
    role: 'CEO, OkaforLogistics Ltd',
    location: 'Lagos → Port Harcourt',
    text: 'We move goods worth millions weekly. ConvoyLink gave us armed escorts with real-time tracking — our team watches the convoy live from the office. Absolutely game-changing for our operations.',
    rating: 5,
    initials: 'EO',
    color: 'orange',
    glow: 'rgba(249,115,22,0.1)',
    border: 'border-orange-500/20',
    badge: 'bg-orange-500/10 text-orange-400',
  },
  {
    name: 'Fatima Al-Hassan',
    role: 'VP Operations, Dangote Group',
    location: 'Abuja → Kano',
    text: 'The escrow payment system means I never worry about paying for services not delivered. The drivers are professional, punctual, and the live map is incredibly reassuring during long hauls.',
    rating: 5,
    initials: 'FA',
    color: 'blue',
    glow: 'rgba(59,130,246,0.1)',
    border: 'border-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-400',
  },
  {
    name: 'Chukwudi Nwosu',
    role: 'Private Client',
    location: 'Enugu → Lagos',
    text: "Booked a VIP convoy for my family's relocation. The team was professional from start to finish. Payment was held safely in escrow until we arrived. 10/10 — would absolutely book again.",
    rating: 5,
    initials: 'CN',
    color: 'green',
    glow: 'rgba(34,197,94,0.1)',
    border: 'border-green-500/20',
    badge: 'bg-green-500/10 text-green-400',
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/bgImage5.jpg"
          alt=""
          fill
          quality={70}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-zinc-950/88" />
        <div className="absolute inset-0 bg-dot opacity-[0.12]" />
      </div>

      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-block text-xs sm:text-sm font-semibold text-orange-400 uppercase tracking-[0.15em] mb-3">
            Testimonials
          </span>
          <h2 className="text-section font-bold text-white mb-4">
            Trusted by businesses{' '}
            <span className="gradient-text">across Nigeria</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto">
            See what our clients say about moving safely with ConvoyLink.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative rounded-2xl border ${t.border} p-6 sm:p-7 overflow-hidden transition-all duration-300`}
              style={{ background: `linear-gradient(145deg, ${t.glow} 0%, rgba(24,24,27,0.7) 50%)` }}
            >
              {/* Hover top beam */}
              <div
                className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${t.glow.replace('0.1', '0.6')}, transparent)` }}
              />

              {/* Quote icon */}
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl mb-5 ${t.badge}`}>
                <Quote className="h-4 w-4" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="text-sm sm:text-[0.9rem] text-zinc-300 leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-zinc-800/70">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${t.badge}`}>
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{t.role}</p>
                  <p className="text-xs text-orange-400/80 mt-0.5">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {['EO', 'FA', 'CN', 'AK', 'MB'].map((init) => (
                <div
                  key={init}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-950 bg-zinc-700 text-[10px] font-bold text-white"
                >
                  {init}
                </div>
              ))}
            </div>
            <span className="text-sm text-zinc-400">
              <span className="text-white font-semibold">2,400+</span> happy clients
            </span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-zinc-700" />
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-zinc-400 ml-1">
              <span className="text-white font-semibold">4.9/5</span> average rating
            </span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-zinc-700" />
          <span className="text-sm text-zinc-400">
            <span className="text-white font-semibold">36</span> states covered
          </span>
        </motion.div>
      </div>
    </section>
  )
}
