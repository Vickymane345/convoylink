'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, MapPin, Star, ChevronDown, CheckCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'

const trustBadges = [
  { icon: <Shield className="h-3.5 w-3.5 text-orange-400" />, text: 'Armed Escort Available' },
  { icon: <MapPin className="h-3.5 w-3.5 text-blue-400" />, text: 'Live GPS Tracking' },
  { icon: <Star className="h-3.5 w-3.5 text-yellow-400" />, text: '4.9★ Rated Drivers' },
  { icon: <Zap className="h-3.5 w-3.5 text-green-400" />, text: 'Instant Booking' },
]

const guarantees = ['No hidden fees', 'Secure escrow payments', 'Cancel anytime']

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">

      {/* ── Background layers ──────────────────────────── */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 bg-zinc-950" />

        {/* Radial glows */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 90% 55% at 50% -5%, rgba(249,115,22,0.14) 0%, transparent 65%),
            radial-gradient(ellipse 55% 70% at 85% 45%, rgba(239,68,68,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 45% 55% at 8% 78%, rgba(59,130,246,0.05) 0%, transparent 55%)
          `
        }} />

        {/* Perspective road SVG — creates depth/motion feel */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 960"
          preserveAspectRatio="xMidYMid slice" aria-hidden>
          <defs>
            <linearGradient id="lineFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="30%" stopColor="white" stopOpacity="0.06" />
              <stop offset="100%" stopColor="white" stopOpacity="0.01" />
            </linearGradient>
            <radialGradient id="centerGlow" cx="50%" cy="40%">
              <stop offset="0%" stopColor="rgba(249,115,22,0.06)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="1440" height="960" fill="url(#centerGlow)" />
          {/* Perspective lines from vanishing point */}
          {Array.from({ length: 14 }).map((_, i) => {
            const spread = (i - 6.5) * 120
            return (
              <line key={i}
                x1={720 + spread * 0.05} y1={280}
                x2={720 + spread * 5} y2={960}
                stroke="url(#lineFade)" strokeWidth="0.8"
              />
            )
          })}
        </svg>

        {/* Grid */}
        <div className="absolute inset-0 bg-grid opacity-[0.22]" />
        {/* Vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 120% 120% at 50% 50%, transparent 40%, rgba(9,9,11,0.7) 100%)'
        }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-zinc-950 to-transparent" />
      </motion.div>

      {/* ── Floating orbs ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Main content ──────────────────────────────── */}
      <motion.div
        style={{ opacity: fadeOut }}
        className="relative z-10 w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-0 sm:pb-0"
      >
        <div className="flex flex-col items-center text-center">

          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2.5 rounded-full border border-orange-500/25 bg-orange-500/[0.08] px-5 py-2 text-sm text-orange-300 mb-7 backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
            Nigeria&apos;s #1 Convoy &amp; Logistics Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-hero font-bold text-white tracking-tight mb-6"
          >
            Move Safely.{' '}
            <span className="relative inline-block">
              <span className="gradient-text">Anywhere</span>
              <motion.span
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.9, ease: 'easeOut' }}
                className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-[3px] rounded-full origin-left"
                style={{ background: 'linear-gradient(90deg, #f97316 0%, #fbbf24 100%)' }}
              />
            </span>
            <br />
            in Nigeria.
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10 px-2"
          >
            Book professional convoy escorts, hire verified drivers, and rent vehicles —
            with{' '}
            <span className="text-zinc-200 font-medium">real-time GPS tracking</span>
            {' '}and{' '}
            <span className="text-zinc-200 font-medium">secure escrow payments</span>.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-10 w-full sm:w-auto"
          >
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button size="xl" className="group w-full sm:w-auto shadow-2xl shadow-orange-500/20 glow-orange-sm">
                Book a Convoy Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-200 shrink-0" />
              </Button>
            </Link>
            <Link href="/convoy" className="w-full sm:w-auto">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                Browse Services
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-12"
          >
            {trustBadges.map((b, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
                className="flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-900/70 backdrop-blur-sm px-3.5 py-1.5 text-xs sm:text-sm text-zinc-300"
              >
                {b.icon}
                {b.text}
              </motion.span>
            ))}
          </motion.div>

          {/* Guarantees */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-5"
          >
            {guarantees.map((g) => (
              <span key={g} className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500">
                <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                {g}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
      >
        <span className="text-[10px] text-zinc-600 tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
          <ChevronDown className="h-5 w-5 text-zinc-600" />
        </motion.div>
      </motion.div>
    </section>
  )
}
