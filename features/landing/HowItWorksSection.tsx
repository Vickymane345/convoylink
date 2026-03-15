'use client'

import { motion, useInView } from 'framer-motion'
import { Search, CreditCard, MapPin, CheckCircle } from 'lucide-react'
import { useRef } from 'react'

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Browse & Select',
    description: 'Search convoy services, vehicles, or drivers. Filter by state, price, and type to find your perfect match.',
    color: 'orange',
    accent: '#f97316',
    accentRgb: '249,115,22',
    border: 'border-orange-500/25',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    numColor: 'text-orange-500/20',
    detail: 'Available in 36 states',
  },
  {
    step: '02',
    icon: CreditCard,
    title: 'Book & Pay Securely',
    description: 'Complete your booking and pay via Stripe. Funds are held in escrow until your trip is successfully complete.',
    color: 'blue',
    accent: '#3b82f6',
    accentRgb: '59,130,246',
    border: 'border-blue-500/25',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    numColor: 'text-blue-500/20',
    detail: 'Powered by Stripe',
  },
  {
    step: '03',
    icon: MapPin,
    title: 'Track in Real-Time',
    description: 'Watch your convoy move live on Google Maps. Receive status updates and notifications throughout your journey.',
    color: 'purple',
    accent: '#a855f7',
    accentRgb: '168,85,247',
    border: 'border-purple-500/25',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    numColor: 'text-purple-500/20',
    detail: 'Google Maps integration',
  },
  {
    step: '04',
    icon: CheckCircle,
    title: 'Arrive Safely',
    description: 'Confirm arrival, release payment to your provider, and leave a review to help build the community.',
    color: 'green',
    accent: '#22c55e',
    accentRgb: '34,197,94',
    border: 'border-green-500/25',
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    numColor: 'text-green-500/20',
    detail: 'Escrow auto-releases',
  },
]

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = step.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      {/* Large step number watermark */}
      <div
        className={`absolute -top-4 -left-2 text-[5rem] sm:text-[6rem] font-black leading-none select-none pointer-events-none ${step.numColor} transition-opacity duration-300 group-hover:opacity-50`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {step.step}
      </div>

      {/* Card */}
      <div
        className={`relative rounded-3xl border ${step.border} bg-zinc-900/50 p-6 sm:p-7 pt-10 overflow-hidden transition-all duration-300 group-hover:bg-zinc-900/80 group-hover:-translate-y-1`}
        style={{ boxShadow: `0 0 0 0 rgba(${step.accentRgb},0)` }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 inset-x-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, rgba(${step.accentRgb},0.5), transparent)` }}
        />

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(${step.accentRgb},0.07) 0%, transparent 70%)` }}
        />

        {/* Icon */}
        <div
          className={`relative inline-flex h-12 w-12 items-center justify-center rounded-2xl ${step.bg} ${step.text} mb-5 transition-transform duration-300 group-hover:scale-110`}
          style={{ boxShadow: `0 0 20px rgba(${step.accentRgb},0.15)` }}
        >
          <Icon className="h-6 w-6" />
        </div>

        {/* Content */}
        <h3 className="text-base sm:text-lg font-bold text-white mb-3">{step.title}</h3>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-5">{step.description}</p>

        {/* Detail badge */}
        <div
          className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full border ${step.border} ${step.bg} ${step.text}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {step.detail}
        </div>
      </div>
    </motion.div>
  )
}

export function HowItWorksSection() {
  const lineRef = useRef<HTMLDivElement>(null)
  const lineInView = useInView(lineRef, { once: true, margin: '-80px' })

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-zinc-950">
      {/* Background texture */}
      <div className="absolute inset-0 bg-dot opacity-[0.07]" />

      {/* Accent glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-64 rounded-full blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 70%)' }}
      />

      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />

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
            How It Works
          </span>
          <h2 className="text-section font-bold text-white mb-4">
            Get moving in{' '}
            <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto">
            From booking to safe arrival — every step is simple, transparent, and secured.
          </p>
        </motion.div>

        {/* Desktop connector timeline */}
        <div ref={lineRef} className="hidden lg:block relative mb-0">
          <div className="absolute top-[4.5rem] left-[12.5%] right-[12.5%] h-px bg-zinc-800 overflow-hidden">
            <motion.div
              animate={lineInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.4, delay: 0.2, ease: 'easeInOut' }}
              className="absolute inset-0 origin-left"
              style={{ background: 'linear-gradient(90deg, #f97316, #3b82f6, #a855f7, #22c55e)' }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {steps.map((step, i) => (
            <StepCard key={step.step} step={step} index={i} />
          ))}
        </div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 sm:mt-20 text-center"
        >
          <p className="text-sm text-zinc-500">
            Ready to get started?{' '}
            <a href="/sign-up" className="text-orange-400 hover:text-orange-300 font-medium transition-colors link-underline">
              Create your free account →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
