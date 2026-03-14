'use client'

import { motion, useMotionValue, useSpring, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { TrendingUp, MapPin, ThumbsUp, Users } from 'lucide-react'
import Image from 'next/image'

const stats = [
  { value: 2400, suffix: '+', label: 'Trips Completed', icon: TrendingUp, color: 'text-orange-400', glow: 'rgba(249,115,22,0.15)' },
  { value: 36, suffix: '', label: 'States Covered', icon: MapPin, color: 'text-blue-400', glow: 'rgba(59,130,246,0.15)' },
  { value: 98, suffix: '%', label: 'Customer Satisfaction', icon: ThumbsUp, color: 'text-green-400', glow: 'rgba(34,197,94,0.15)' },
  { value: 500, suffix: '+', label: 'Verified Providers', icon: Users, color: 'text-yellow-400', glow: 'rgba(251,191,36,0.15)' },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 })
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
    <section className="relative py-20 sm:py-24 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/bgImage3.jpg"
          alt=""
          fill
          quality={70}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-zinc-900/85" />
        <div className="absolute inset-0 bg-dot opacity-25" />
      </div>

      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Trusted by thousands of Nigerians — from individuals to major corporations.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 28, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative group rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-5 sm:p-6 text-center overflow-hidden transition-all duration-300 hover:border-zinc-700/80"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${stat.glow} 0%, transparent 70%)` }}
                />

                {/* Icon */}
                <div className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4 ${stat.color}`}
                  style={{ background: stat.glow.replace('0.15', '0.08') }}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Number */}
                <div className={`relative text-3xl sm:text-4xl lg:text-5xl font-bold mb-1.5 ${stat.color}`}>
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <p className="relative text-xs sm:text-sm text-zinc-500 font-medium">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
