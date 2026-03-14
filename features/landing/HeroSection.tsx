'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, MapPin, Star, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const floatingBadges = [
  { icon: <Shield className="h-3.5 w-3.5 text-orange-400" />, text: 'Armed Escort Available', delay: 0 },
  { icon: <MapPin className="h-3.5 w-3.5 text-blue-400" />, text: 'Live GPS Tracking', delay: 0.3 },
  { icon: <Star className="h-3.5 w-3.5 text-yellow-400" />, text: '4.9★ Rated Drivers', delay: 0.6 },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950" />

      {/* Glow orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-3xl pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, delay: 0.5 }}
        className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-blue-500/8 blur-3xl pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-sm text-orange-300 mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
          Nigeria&apos;s #1 Convoy &amp; Logistics Platform
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight"
        >
          Move Safely.{' '}
          <span className="gradient-text">Anywhere</span>
          <br />
          in Nigeria.
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
        >
          Book professional convoy escorts, hire verified drivers, and rent vehicles —
          all with real-time GPS tracking and secure escrow payments.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/sign-up">
            <Button size="xl" className="group shadow-2xl shadow-orange-500/20">
              Book a Convoy
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/convoy">
            <Button size="xl" variant="outline">
              Browse Services
            </Button>
          </Link>
        </motion.div>

        {/* Floating badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
          {floatingBadges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + badge.delay }}
              className="flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/80 backdrop-blur-sm px-4 py-2 text-sm text-zinc-300"
            >
              {badge.icon}
              {badge.text}
            </motion.div>
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-20 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-zinc-600"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
