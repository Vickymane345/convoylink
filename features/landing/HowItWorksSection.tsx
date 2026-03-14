'use client'

import { motion } from 'framer-motion'
import { Search, CreditCard, MapPin, CheckCircle, ArrowRight } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Browse & Select',
    description: 'Search convoy services, vehicles, or drivers. Filter by state, price, and service type to find the perfect match.',
    color: 'orange',
    accent: 'rgba(249,115,22,0.12)',
    border: 'border-orange-500/20',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    step: '02',
    icon: CreditCard,
    title: 'Book & Pay Securely',
    description: 'Complete your booking and pay via Stripe. Funds are held in escrow until your trip is successfully complete.',
    color: 'blue',
    accent: 'rgba(59,130,246,0.12)',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    step: '03',
    icon: MapPin,
    title: 'Track in Real-Time',
    description: 'Watch your convoy or driver move live on the map. Receive status notifications throughout your journey.',
    color: 'purple',
    accent: 'rgba(168,85,247,0.12)',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    step: '04',
    icon: CheckCircle,
    title: 'Arrive Safely',
    description: 'Confirm arrival, release payment to the provider, and leave a review to help build the community.',
    color: 'green',
    accent: 'rgba(34,197,94,0.12)',
    border: 'border-green-500/20',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-zinc-950 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-dot opacity-[0.18]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

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
            From booking to safe arrival — ConvoyLink makes every step simple, transparent, and secure.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-[2.6rem] left-[16%] right-[16%] h-px overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
              className="h-full origin-left"
              style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.3), rgba(34,197,94,0.3))' }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex flex-col items-center text-center"
                >
                  {/* Mobile connector */}
                  {i < steps.length - 1 && (
                    <div className="sm:hidden absolute top-8 left-1/2 h-16 w-px bg-gradient-to-b from-zinc-700/50 to-transparent translate-x-16 -z-10" />
                  )}

                  {/* Icon circle */}
                  <div
                    className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border ${step.border} ${step.bg} ${step.text} mb-5 group-hover:scale-110 transition-transform duration-300`}
                    style={{ boxShadow: `0 0 25px ${step.accent}` }}
                  >
                    <Icon className="h-7 w-7" />
                    {/* Step number */}
                    <span className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-300">
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mb-2.5">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-[200px]">{step.description}</p>

                  {/* Mobile arrow */}
                  {i < steps.length - 1 && (
                    <div className="sm:hidden mt-5 text-zinc-700">
                      <ArrowRight className="h-4 w-4 mx-auto rotate-90" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
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
