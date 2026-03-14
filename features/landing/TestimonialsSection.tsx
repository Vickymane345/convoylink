'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'Emeka Okafor',
    role: 'CEO, OkaforLogistics Ltd',
    location: 'Lagos → Port Harcourt',
    text: 'We move goods worth millions weekly. ConvoyLink gave us armed escorts with real-time tracking — our team watches the convoy live from the office. Absolutely game-changing.',
    rating: 5,
    initials: 'EO',
  },
  {
    name: 'Fatima Al-Hassan',
    role: 'VP Operations, Dangote Group',
    location: 'Abuja → Kano',
    text: 'The escrow payment system means I never worry about paying for services not delivered. The drivers are professional, punctual, and the live map is incredibly reassuring.',
    rating: 5,
    initials: 'FA',
  },
  {
    name: 'Chukwudi Nwosu',
    role: 'Private Client',
    location: 'Enugu → Lagos',
    text: 'Booked a VIP convoy for my family\'s relocation. The convoy team was professional from start to finish. Payment was held safely until we arrived. 10/10 would book again.',
    rating: 5,
    initials: 'CN',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-zinc-900/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-orange-400 uppercase tracking-wider">Testimonials</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
            Trusted by businesses across Nigeria
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-7 backdrop-blur-sm"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <blockquote className="text-sm text-zinc-300 leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm">{t.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                  <p className="text-xs text-orange-400 mt-0.5">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
