'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Car, UserCheck, ArrowRight, MapPin, Lock, Star } from 'lucide-react'

const services = [
  {
    icon: <Shield className="h-7 w-7" />,
    title: 'Convoy Escort',
    description: 'Armed and unarmed convoy protection for corporate, VIP, and logistics movements across all 36 states.',
    features: ['Armed & Unarmed Options', 'Real-time GPS Tracking', 'Trained Security Personnel'],
    href: '/convoy',
    color: 'orange',
    gradient: 'from-orange-500/20 to-red-500/5',
    border: 'border-orange-500/20 hover:border-orange-500/40',
  },
  {
    icon: <Car className="h-7 w-7" />,
    title: 'Vehicle Rental',
    description: 'Rent verified, insured vehicles for any occasion — sedans, SUVs, luxury cars, buses, and armored vehicles.',
    features: ['Verified & Insured Vehicles', 'Flexible Daily Rates', 'Delivery Available'],
    href: '/vehicles',
    color: 'blue',
    gradient: 'from-blue-500/20 to-cyan-500/5',
    border: 'border-blue-500/20 hover:border-blue-500/40',
  },
  {
    icon: <UserCheck className="h-7 w-7" />,
    title: 'Driver Hire',
    description: 'Hire experienced, background-checked professional drivers for daily runs, long trips, or dedicated corporate hire.',
    features: ['Background Verified', 'Experienced & Licensed', 'Corporate & Personal'],
    href: '/drivers',
    color: 'green',
    gradient: 'from-green-500/20 to-emerald-500/5',
    border: 'border-green-500/20 hover:border-green-500/40',
  },
]

const colorMap: Record<string, string> = {
  orange: 'text-orange-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
}

export function ServicesSection() {
  return (
    <section className="py-24 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-orange-400 uppercase tracking-wider">What We Offer</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white">
            Every service you need, in one platform
          </h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
            Whether you need armed protection, a rental car, or a trusted driver — ConvoyLink connects you to verified professionals.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={service.href} className="group block h-full">
                <div className={`relative h-full rounded-2xl border bg-gradient-to-b ${service.gradient} ${service.border} p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40`}>
                  {/* Icon */}
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 ${colorMap[service.color]} mb-6 group-hover:scale-110 transition-transform`}>
                    {service.icon}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">{service.description}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-8">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                        <span className={`h-1.5 w-1.5 rounded-full bg-current ${colorMap[service.color]}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className={`flex items-center gap-2 text-sm font-medium ${colorMap[service.color]} group-hover:gap-3 transition-all`}>
                    Browse {service.title}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {[
            { icon: <Lock className="h-4 w-4 text-green-400" />, text: 'Secure Escrow Payments' },
            { icon: <MapPin className="h-4 w-4 text-blue-400" />, text: 'Real-time GPS Tracking' },
            { icon: <Star className="h-4 w-4 text-yellow-400" />, text: 'Verified Providers Only' },
            { icon: <Shield className="h-4 w-4 text-orange-400" />, text: '24/7 Support' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-sm text-zinc-400">
              {item.icon}
              {item.text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
