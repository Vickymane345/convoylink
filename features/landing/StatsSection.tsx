'use client'

import { motion, useMotionValue, useSpring, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'

const stats = [
  { value: 2400, suffix: '+', label: 'Trips Completed' },
  { value: 36, suffix: '', label: 'States Covered' },
  { value: 98, suffix: '%', label: 'Customer Satisfaction' },
  { value: 500, suffix: '+', label: 'Verified Providers' },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 })
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) motionValue.set(value)
  }, [isInView, motionValue, value])

  useEffect(() => {
    springValue.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.floor(v).toLocaleString() + suffix
    })
  }, [springValue, suffix])

  return <span ref={ref}>0{suffix}</span>
}

export function StatsSection() {
  return (
    <section className="py-20 border-y border-zinc-800 bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 lg:divide-x lg:divide-zinc-800">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center px-6"
            >
              <div className="text-4xl sm:text-5xl font-bold gradient-text">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm text-zinc-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
