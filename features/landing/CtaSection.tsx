'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, CheckCircle, Zap, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

const perks = [
  { icon: CheckCircle, text: 'No hidden fees' },
  { icon: Lock, text: 'Secure escrow' },
  { icon: Zap, text: 'Book in 2 minutes' },
]

export function CtaSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/bgImage6.jpg"
          alt=""
          fill
          quality={75}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-zinc-950/85" />
        <div className="absolute inset-0 bg-dot opacity-[0.12]" />
        {/* Orange atmosphere */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(249,115,22,0.12) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden border border-orange-500/20 bg-zinc-950/60 backdrop-blur-sm"
        >
          {/* Inner top glow */}
          <div
            className="absolute top-0 inset-x-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)' }}
          />

          {/* Ambient glow */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[80px] pointer-events-none"
            style={{ background: 'rgba(249,115,22,0.1)' }}
          />

          {/* Shimmer */}
          <div className="shimmer absolute inset-0 rounded-3xl opacity-60" />

          <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-14 sm:py-20 flex flex-col items-center text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-7"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/15 border border-orange-500/30 mx-auto pulse-glow">
                <Shield className="h-8 w-8 text-orange-400" />
              </div>
              <div className="absolute inset-0 rounded-2xl blur-xl bg-orange-500/20" />
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-section font-bold text-white mb-5"
            >
              Ready to move{' '}
              <span className="gradient-text">safely?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-lg text-zinc-400 max-w-xl leading-relaxed mb-10"
            >
              Join thousands of Nigerians who move securely with ConvoyLink every day.
              Armed escorts, verified drivers, GPS tracking — all in one platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8"
            >
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button size="xl" className="group w-full sm:w-auto shadow-2xl shadow-orange-500/25 glow-orange-sm">
                  Create Free Account
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-200 shrink-0" />
                </Button>
              </Link>
              <Link href="/convoy" className="w-full sm:w-auto">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  Browse Convoys
                </Button>
              </Link>
            </motion.div>

            {/* Perks row */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
            >
              {perks.map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500">
                  <Icon className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  {text}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
