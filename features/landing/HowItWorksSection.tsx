'use client'

import { motion } from 'framer-motion'
import { Search, CreditCard, MapPin, CheckCircle } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: <Search className="h-6 w-6" />,
    title: 'Browse & Select',
    description: 'Search convoy services, vehicles, or drivers. Filter by state, price, and service type.',
  },
  {
    step: '02',
    icon: <CreditCard className="h-6 w-6" />,
    title: 'Book & Pay Securely',
    description: 'Complete your booking and pay via Stripe. Funds are held in escrow until your trip is complete.',
  },
  {
    step: '03',
    icon: <MapPin className="h-6 w-6" />,
    title: 'Track in Real-Time',
    description: 'Watch your convoy or driver move live on the map. Get status notifications throughout the journey.',
  },
  {
    step: '04',
    icon: <CheckCircle className="h-6 w-6" />,
    title: 'Arrive Safely',
    description: 'Confirm arrival, release payment to the provider, and leave a review to help the community.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-orange-400 uppercase tracking-wider">How It Works</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
            Get moving in 4 simple steps
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-400 mb-5">
                  {step.icon}
                  <span className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
