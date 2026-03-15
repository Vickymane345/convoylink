'use client'

import { motion } from 'framer-motion'
import { Star, Quote, Shield, MapPin } from 'lucide-react'

const allTestimonials = [
  {
    name: 'Emeka Okafor',
    role: 'CEO, OkaforLogistics Ltd',
    location: 'Lagos → Port Harcourt',
    text: 'We move goods worth millions weekly. ConvoyLink gave us armed escorts with real-time tracking — our team watches the convoy live from the office. Absolutely game-changing.',
    rating: 5,
    initials: 'EO',
    accent: 'orange',
    border: 'border-orange-500/20',
    badge: 'bg-orange-500/10 text-orange-400',
    bg: 'rgba(249,115,22,0.04)',
  },
  {
    name: 'Fatima Al-Hassan',
    role: 'VP Operations, Dangote Group',
    location: 'Abuja → Kano',
    text: 'The escrow payment system means I never worry about paying for services not delivered. The drivers are professional, punctual, and the live map is incredibly reassuring.',
    rating: 5,
    initials: 'FA',
    accent: 'blue',
    border: 'border-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-400',
    bg: 'rgba(59,130,246,0.04)',
  },
  {
    name: 'Chukwudi Nwosu',
    role: 'Private Client',
    location: 'Enugu → Lagos',
    text: 'Booked a VIP convoy for my family\'s relocation. The team was professional from start to finish. Payment held safely in escrow until we arrived. 10/10 — would book again.',
    rating: 5,
    initials: 'CN',
    accent: 'green',
    border: 'border-green-500/20',
    badge: 'bg-green-500/10 text-green-400',
    bg: 'rgba(34,197,94,0.04)',
  },
  {
    name: 'Adaeze Ike',
    role: 'Head of Security, UBA Group',
    location: 'Lagos → Abuja',
    text: 'We\'ve used ConvoyLink for executive transport for 8 months straight. Zero incidents, always on time. The ex-military personnel add an extra layer of trust for our executives.',
    rating: 5,
    initials: 'AI',
    accent: 'purple',
    border: 'border-purple-500/20',
    badge: 'bg-purple-500/10 text-purple-400',
    bg: 'rgba(168,85,247,0.04)',
  },
  {
    name: 'Tunde Adeyemi',
    role: 'Logistics Director, Flour Mills',
    location: 'Apapa → Ibadan',
    text: 'Freight convoy across three states with full armed escort — completed without a single hiccup. The GPS tracking integration with our operations center was seamless.',
    rating: 5,
    initials: 'TA',
    accent: 'yellow',
    border: 'border-yellow-500/20',
    badge: 'bg-yellow-500/10 text-yellow-400',
    bg: 'rgba(251,191,36,0.04)',
  },
  {
    name: 'Ngozi Eze',
    role: 'Personal Client',
    location: 'Owerri → Lagos',
    text: 'As a woman traveling alone late at night, ConvoyLink\'s driver hire service gave me total peace of mind. Background-checked, professional, and incredibly polite driver.',
    rating: 5,
    initials: 'NE',
    accent: 'orange',
    border: 'border-orange-500/20',
    badge: 'bg-orange-500/10 text-orange-400',
    bg: 'rgba(249,115,22,0.04)',
  },
]

// Duplicate for seamless loop
const row1 = [...allTestimonials, ...allTestimonials]
const row2 = [...allTestimonials.slice(3), ...allTestimonials.slice(0, 3), ...allTestimonials.slice(3), ...allTestimonials.slice(0, 3)]

function TestimonialCard({ t }: { t: typeof allTestimonials[0] }) {
  return (
    <div
      className={`flex-shrink-0 w-[320px] sm:w-[360px] rounded-2xl border ${t.border} p-5 sm:p-6 mx-2.5 group relative overflow-hidden`}
      style={{ background: `linear-gradient(145deg, ${t.bg} 0%, rgba(18,18,20,0.85) 60%)` }}
    >
      {/* Top beam on hover */}
      <div
        className={`absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400`}
        style={{ background: `linear-gradient(90deg, transparent, ${t.bg.replace('0.04', '0.6')}, transparent)` }}
      />

      {/* Quote icon + stars */}
      <div className="flex items-start justify-between mb-4">
        <div className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${t.badge}`}>
          <Quote className="h-3.5 w-3.5" />
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: t.rating }).map((_, j) => (
            <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>

      {/* Quote */}
      <blockquote className="text-sm text-zinc-300 leading-relaxed mb-5 line-clamp-4">
        &ldquo;{t.text}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/60">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${t.badge}`}>
          {t.initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{t.name}</p>
          <p className="text-xs text-zinc-500 truncate">{t.role}</p>
        </div>
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <MapPin className="h-3 w-3 text-orange-500/60" />
          <p className="text-[10px] text-orange-400/80">{t.location}</p>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-zinc-950">
      {/* Background */}
      <div className="absolute inset-0 bg-dot opacity-[0.07]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />

      {/* Soft top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-48 rounded-full blur-[60px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 70%)' }}
      />

      {/* Header */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block text-xs sm:text-sm font-semibold text-orange-400 uppercase tracking-[0.15em] mb-3">
            Testimonials
          </span>
          <h2 className="text-section font-bold text-white mb-4">
            Trusted by businesses{' '}
            <span className="gradient-text">across Nigeria</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto">
            Thousands of Nigerians move safely every day. Here&apos;s what they say.
          </p>
        </motion.div>
      </div>

      {/* ── Marquee rows ── */}
      <div className="marquee-pause overflow-hidden select-none">

        {/* Row 1 — left */}
        <div className="fade-sides overflow-hidden mb-4">
          <div className="marquee-track marquee flex">
            {row1.map((t, i) => (
              <TestimonialCard key={`r1-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Row 2 — right (reverse) */}
        <div className="fade-sides overflow-hidden">
          <div className="marquee-track marquee-reverse flex">
            {row2.map((t, i) => (
              <TestimonialCard key={`r2-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Social proof bar ── */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-14 sm:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10"
        >
          {/* Avatars + count */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['EO', 'FA', 'CN', 'AI', 'TA'].map((init) => (
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

          <div className="hidden sm:block h-4 w-px bg-zinc-800" />

          {/* Stars */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-zinc-400 ml-1">
              <span className="text-white font-semibold">4.9/5</span> average rating
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-zinc-800" />

          {/* Badge */}
          <div className="flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.06] px-4 py-1.5">
            <Shield className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-xs font-semibold text-orange-300">100% Verified Reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
