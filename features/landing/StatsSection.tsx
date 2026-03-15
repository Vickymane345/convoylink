'use client'

import { motion, useMotionValue, useSpring, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { TrendingUp, MapPin, ThumbsUp, Users } from 'lucide-react'

const stats = [
  {
    value: 2400,
    suffix: '+',
    label: 'Trips Completed',
    sublabel: 'across all 36 states',
    icon: TrendingUp,
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-orange-500/0',
    glow: 'rgba(249,115,22,0.2)',
    border: 'border-orange-500/20',
  },
  {
    value: 36,
    suffix: '',
    label: 'States Covered',
    sublabel: 'full national coverage',
    icon: MapPin,
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-blue-500/0',
    glow: 'rgba(59,130,246,0.2)',
    border: 'border-blue-500/20',
  },
  {
    value: 98,
    suffix: '%',
    label: 'Satisfaction Rate',
    sublabel: 'verified client reviews',
    icon: ThumbsUp,
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-green-500/0',
    glow: 'rgba(34,197,94,0.2)',
    border: 'border-green-500/20',
  },
  {
    value: 500,
    suffix: '+',
    label: 'Verified Providers',
    sublabel: 'background-checked professionals',
    icon: Users,
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-yellow-500/0',
    glow: 'rgba(251,191,36,0.2)',
    border: 'border-yellow-500/20',
  },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: 2200, bounce: 0 })
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (isInView) motionValue.set(value)
  }, [isInView, motionValue, value])

  useEffect(() => {
    return springValue.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.floor(v).toLocaleString() + suffix
    })
  }, [springValue, suffix])

  return <span ref={ref}>0{suffix}</span>
}

export function StatsSection() {
  return (
    <section className="relative py-20 sm:py-24 overflow-hidden bg-zinc-950">
      {/* Background texture */}
      <div className="absolute inset-0 bg-dot opacity-[0.08]" />

      {/* Top/bottom lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />

      {/* Orange center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-64 rounded-full blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 sm:mb-16"
        >
          <span className="inline-block text-xs sm:text-sm font-semibold text-orange-400 uppercase tracking-[0.15em] mb-3">
            Platform Impact
          </span>
          <h2 className="text-section font-bold text-white mb-3">
            Trusted across{' '}
            <span className="gradient-text">Nigeria</span>
          </h2>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            From individuals to Fortune 500 companies — thousands move safely with ConvoyLink every day.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 32, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative rounded-2xl border ${stat.border} bg-zinc-900/50 p-5 sm:p-7 overflow-hidden transition-all duration-300 hover:bg-zinc-900/80`}
              >
                {/* Hover radial glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 80% 70% at 50% 0%, ${stat.glow} 0%, transparent 70%)` }}
                />

                {/* Top gradient stripe */}
                <div
                  className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r ${stat.gradient}`}
                />

                {/* Icon */}
                <div
                  className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl mb-5 ${stat.color} transition-transform duration-300 group-hover:scale-110`}
                  style={{ background: stat.glow.replace('0.2', '0.1') }}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Number */}
                <div className={`relative font-bold mb-1 leading-none ${stat.color}`}
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}
                >
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <p className="relative text-sm sm:text-base font-semibold text-white mb-1">{stat.label}</p>
                <p className="relative text-xs text-zinc-500">{stat.sublabel}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom social proof */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-center"
        >
          <p className="text-xs text-zinc-500">
            <span className="text-white font-semibold">Nigeria&apos;s most trusted</span> convoy marketplace since 2023
          </p>
          <span className="hidden sm:block h-4 w-px bg-zinc-800" />
          <p className="text-xs text-zinc-500">
            Covering Lagos · Abuja · Port Harcourt · Kano ·{' '}
            <span className="text-zinc-400">+32 more states</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
