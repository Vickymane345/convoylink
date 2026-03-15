'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, MapPin, Star, ChevronDown, CheckCircle, Zap, Clock, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

const trustBadges = [
  { icon: <Shield className="h-3.5 w-3.5 text-orange-400" />, text: 'Armed Escort Available' },
  { icon: <MapPin className="h-3.5 w-3.5 text-blue-400" />, text: 'Live GPS Tracking' },
  { icon: <Star className="h-3.5 w-3.5 text-yellow-400" />, text: '4.9 Rated Drivers' },
  { icon: <Zap className="h-3.5 w-3.5 text-green-400" />, text: 'Instant Booking' },
]

const guarantees = ['No hidden fees', 'Secure escrow payments', 'Cancel anytime']

// Animated convoy status updates shown in the route card
const statusMessages = [
  { text: 'Convoy departed Abuja', time: '09:14 AM', color: 'text-orange-400' },
  { text: 'Passed Lokoja checkpoint', time: '11:32 AM', color: 'text-blue-400' },
  { text: 'ETA Lagos: 2h 15m', time: '01:48 PM', color: 'text-green-400' },
]

function LiveRouteCard() {
  const [currentStatus, setCurrentStatus] = useState(0)
  const [dotProgress, setDotProgress] = useState(0)

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setCurrentStatus(p => (p + 1) % statusMessages.length)
    }, 3200)
    return () => clearInterval(statusInterval)
  }, [])

  useEffect(() => {
    let frame: number
    let start: number | null = null
    const duration = 6000
    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = (elapsed % duration) / duration
      setDotProgress(progress)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Cubic bezier path: Lagos (60,155) → Abuja (245,45)
  const pathD = 'M 60 155 C 80 100 180 110 245 45'
  const t = dotProgress
  // Cubic bezier formula
  const bx = (t: number) => {
    const p0x = 60, p1x = 80, p2x = 180, p3x = 245
    return Math.pow(1-t,3)*p0x + 3*Math.pow(1-t,2)*t*p1x + 3*(1-t)*Math.pow(t,2)*p2x + Math.pow(t,3)*p3x
  }
  const by = (t: number) => {
    const p0y = 155, p1y = 100, p2y = 110, p3y = 45
    return Math.pow(1-t,3)*p0y + 3*Math.pow(1-t,2)*t*p1y + 3*(1-t)*Math.pow(t,2)*p2y + Math.pow(t,3)*p3y
  }
  const dotX = bx(t)
  const dotY = by(t)

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-sm xl:max-w-md"
    >
      {/* Ambient glow behind card */}
      <div className="absolute -inset-6 rounded-[2.5rem] blur-[40px] bg-orange-500/10 pointer-events-none" />

      {/* Main card */}
      <div className="relative rounded-3xl border border-zinc-700/60 bg-zinc-900/80 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-black/50 neon-orange">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Live Tracking</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Shield className="h-3 w-3 text-orange-500/60" />
            <span>Convoy #CV-4829</span>
          </div>
        </div>

        {/* Route map area */}
        <div className="relative h-52 bg-zinc-900 overflow-hidden">
          {/* Map grid */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 310 210" preserveAspectRatio="none">
            {/* Grid */}
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`vl-${i}`} x1={i * 31} y1="0" x2={i * 31} y2="210" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`hl-${i}`} x1="0" y1={i * 30} x2="310" y2={i * 30} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
            ))}

            {/* Route shadow */}
            <path d={pathD} stroke="rgba(249,115,22,0.08)" strokeWidth="8" fill="none" strokeLinecap="round" />

            {/* Dashed route line */}
            <path
              d={pathD}
              stroke="rgba(249,115,22,0.5)"
              strokeWidth="1.5"
              strokeDasharray="7,5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Lagos pin (origin) */}
            <circle cx="60" cy="155" r="16" fill="rgba(34,197,94,0.08)" />
            <circle cx="60" cy="155" r="8" fill="rgba(34,197,94,0.15)" />
            <circle cx="60" cy="155" r="4" fill="#22c55e" />

            {/* Abuja pin (destination) */}
            <circle cx="245" cy="45" r="16" fill="rgba(249,115,22,0.08)" />
            <circle cx="245" cy="45" r="8" fill="rgba(249,115,22,0.15)" />
            <circle cx="245" cy="45" r="4" fill="#f97316" />

            {/* Animated convoy dot (outer pulse) */}
            <circle cx={dotX} cy={dotY} r="9" fill="rgba(249,115,22,0.15)" />
            {/* Inner dot */}
            <circle cx={dotX} cy={dotY} r="5" fill="#f97316" />
            <circle cx={dotX} cy={dotY} r="2.5" fill="white" />
          </svg>

          {/* City labels */}
          <div className="absolute bottom-3 left-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
              <div>
                <p className="text-[10px] text-zinc-500 leading-none">Origin</p>
                <p className="text-xs font-bold text-white">Lagos</p>
              </div>
            </div>
          </div>
          <div className="absolute top-3 right-4">
            <div className="flex items-center gap-1.5">
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 leading-none">Destination</p>
                <p className="text-xs font-bold text-white">Abuja</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-orange-400 shrink-0" />
            </div>
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-3 right-4">
            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
              <Clock className="h-3 w-3" />
              <span>ETA 2h 15m</span>
            </div>
          </div>
        </div>

        {/* Status updates */}
        <div className="px-5 py-3 border-t border-zinc-800/60">
          <div className="relative h-5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStatus}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-between"
              >
                <span className={`text-xs font-medium ${statusMessages[currentStatus].color}`}>
                  {statusMessages[currentStatus].text}
                </span>
                <span className="text-[10px] text-zinc-600">{statusMessages[currentStatus].time}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Escort info */}
        <div className="grid grid-cols-3 gap-0 border-t border-zinc-800/60">
          {[
            { label: 'Escort Type', value: 'Armed', color: 'text-orange-400' },
            { label: 'Vehicles', value: '4 SUVs', color: 'text-blue-400' },
            { label: 'Personnel', value: '8 Agents', color: 'text-green-400' },
          ].map((item, i) => (
            <div key={i} className={`px-4 py-3 text-center ${i < 2 ? 'border-r border-zinc-800/60' : ''}`}>
              <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Payment escrow row */}
        <div className="px-5 py-3 bg-zinc-950/40 flex items-center justify-between border-t border-zinc-800/60">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15">
              <CheckCircle className="h-3 w-3 text-green-400" />
            </div>
            Payment in escrow
          </div>
          <span className="text-xs font-bold text-white">₦ 385,000</span>
        </div>
      </div>

      {/* Floating mini stat cards */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-10 top-1/3 hero-stat px-3.5 py-2.5 rounded-2xl"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-500/15">
            <TrendingUp className="h-3.5 w-3.5 text-orange-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">2,400+</p>
            <p className="text-[10px] text-zinc-500">Trips Done</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -right-8 bottom-1/3 hero-stat px-3.5 py-2.5 rounded-2xl"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-green-500/15">
            <Users className="h-3.5 w-3.5 text-green-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">500+</p>
            <p className="text-[10px] text-zinc-500">Providers</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const fadeOut = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <section ref={ref} className="relative min-h-[100svh] flex items-center overflow-hidden">

      {/* ── Background image ──────────────────────────────── */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/bgImage1.jpg"
          alt=""
          fill
          priority
          quality={80}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Deep dark overlay */}
        <div className="absolute inset-0 bg-zinc-950/80" />

        {/* Orange atmospheric top */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 100% 60% at 40% -10%, rgba(249,115,22,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 90% 50%, rgba(239,68,68,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 5% 80%, rgba(59,130,246,0.04) 0%, transparent 55%)
          `
        }} />

        {/* Fine grid */}
        <div className="absolute inset-0 bg-grid opacity-[0.15]" />

        {/* Vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 130% 130% at 50% 50%, transparent 35%, rgba(9,9,11,0.8) 100%)'
        }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-zinc-950 to-transparent" />
      </motion.div>

      {/* ── Floating orbs ────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-48 left-1/3 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -right-48 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Main layout ──────────────────────────────────── */}
      <motion.div
        style={{ opacity: fadeOut }}
        className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-20 lg:pt-0 lg:pb-0 min-h-[100svh] flex items-center"
      >
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

          {/* ── Left column: copy ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl lg:max-w-xl xl:max-w-2xl">

            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2.5 rounded-full border border-orange-500/25 bg-orange-500/[0.07] px-5 py-2 text-sm text-orange-300 mb-7 backdrop-blur-sm"
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
              <span className="text-zinc-200">in Nigeria.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-xl text-zinc-300 leading-relaxed mb-10 px-2 lg:px-0"
            >
              Book professional convoy escorts, hire verified drivers, and rent vehicles —
              with{' '}
              <span className="text-white font-medium">real-time GPS tracking</span>
              {' '}and{' '}
              <span className="text-white font-medium">secure escrow payments</span>.
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
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 mb-8"
            >
              {trustBadges.map((b, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
                  className="flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-sm px-3.5 py-1.5 text-xs sm:text-sm text-zinc-300"
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
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5"
            >
              {guarantees.map((g) => (
                <span key={g} className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  {g}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Right column: Live Route Card ── */}
          <div className="lg:flex shrink-0 hidden">
            <LiveRouteCard />
          </div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
      >
        <span className="text-[10px] text-zinc-500 tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
          <ChevronDown className="h-5 w-5 text-zinc-500" />
        </motion.div>
      </motion.div>
    </section>
  )
}
