'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="py-24 bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-orange-500/20 bg-gradient-to-b from-orange-500/10 to-transparent p-12 overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/20 mb-6 mx-auto">
              <Shield className="h-7 w-7 text-orange-400" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to move safely?
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of Nigerians who move securely with ConvoyLink every day.
              Get started in under 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="xl" className="group">
                  Create Free Account
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/convoy">
                <Button size="xl" variant="glass">
                  Browse Convoys
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-xs text-zinc-600">
              No hidden fees · Secure escrow payments · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
