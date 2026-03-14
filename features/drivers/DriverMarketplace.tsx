'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { UserCheck, Star, Briefcase, MapPin, SlidersHorizontal, CheckCircle2 } from 'lucide-react'
import { SearchBar } from '@/components/forms/SearchBar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/utils/helpers'
import Link from 'next/link'
import type { Driver } from '@/types'

function DriverEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      {/* SVG Illustration */}
      <div className="mb-8 relative">
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Car seat / steering wheel area */}
          <ellipse cx="100" cy="148" rx="70" ry="8" fill="#22c55e" fillOpacity="0.07"/>

          {/* Car outline */}
          <rect x="20" y="100" width="160" height="50" rx="10" fill="#18181b" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.3"/>
          <path d="M40 100 L55 78 L145 78 L162 100 Z" fill="#27272a" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.2"/>

          {/* Windshield */}
          <path d="M58 78 L65 60 L135 60 L143 78 Z" fill="#14532d" fillOpacity="0.5" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.4"/>

          {/* Wheels */}
          <circle cx="55" cy="150" r="12" fill="#18181b" stroke="#22c55e" strokeWidth="2" strokeOpacity="0.5"/>
          <circle cx="55" cy="150" r="5" fill="#27272a"/>
          <circle cx="145" cy="150" r="12" fill="#18181b" stroke="#22c55e" strokeWidth="2" strokeOpacity="0.5"/>
          <circle cx="145" cy="150" r="5" fill="#27272a"/>

          {/* Driver person */}
          {/* Head */}
          <circle cx="100" cy="40" r="18" fill="#27272a" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.5"/>
          {/* Face features */}
          <circle cx="94" cy="37" r="2.5" fill="#22c55e" fillOpacity="0.7"/>
          <circle cx="106" cy="37" r="2.5" fill="#22c55e" fillOpacity="0.7"/>
          <path d="M93 46 Q100 51 107 46" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7"/>

          {/* Body / uniform */}
          <path d="M72 90 Q72 68 100 65 Q128 68 128 90 Z" fill="#14532d" fillOpacity="0.6" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.4"/>

          {/* Steering wheel */}
          <circle cx="100" cy="92" r="16" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeOpacity="0.6"/>
          <circle cx="100" cy="92" r="4" fill="#22c55e" fillOpacity="0.4"/>
          <line x1="100" y1="76" x2="100" y2="88" stroke="#22c55e" strokeWidth="2" strokeOpacity="0.5"/>
          <line x1="84" y1="92" x2="96" y2="92" stroke="#22c55e" strokeWidth="2" strokeOpacity="0.5"/>
          <line x1="104" y1="92" x2="116" y2="92" stroke="#22c55e" strokeWidth="2" strokeOpacity="0.5"/>

          {/* Badge / ID card */}
          <rect x="86" y="68" width="28" height="18" rx="3" fill="#166534" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.5"/>
          <circle cx="100" cy="74" r="3" fill="#22c55e" fillOpacity="0.6"/>
          <rect x="90" y="80" width="20" height="2" rx="1" fill="#22c55e" fillOpacity="0.4"/>

          {/* Stars above */}
          <circle cx="30" cy="20" r="1.5" fill="#22c55e" fillOpacity="0.4"/>
          <circle cx="170" cy="15" r="1.5" fill="#22c55e" fillOpacity="0.4"/>
          <circle cx="160" cy="40" r="1" fill="#22c55e" fillOpacity="0.3"/>
          <circle cx="15" cy="50" r="1" fill="#22c55e" fillOpacity="0.3"/>
          <path d="M178 30 L180 24 L182 30 L188 30 L183 34 L185 40 L180 36 L175 40 L177 34 L172 30 Z" fill="#22c55e" fillOpacity="0.2"/>
        </svg>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-2 right-0 bg-green-500/20 border border-green-500/30 rounded-xl px-3 py-1.5"
        >
          <span className="text-xs font-medium text-green-300">0 drivers yet</span>
        </motion.div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">No drivers available yet</h3>
      <p className="text-zinc-400 text-sm max-w-sm leading-relaxed mb-8">
        Professional drivers will appear here once verified. Are you a licensed driver? Join ConvoyLink and start earning from convoy escorts, executive trips, and daily hires.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/sign-up">
          <Button size="lg" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Register as a Driver
          </Button>
        </Link>
        <Link href="/sign-in">
          <Button size="lg" variant="outline" className="gap-2">
            Sign In
          </Button>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-6 text-center">
        {[
          { label: 'Avg. Trip Earnings', value: '₦12K+' },
          { label: 'Weekly Payouts', value: 'Instant' },
          { label: 'Verified Drivers', value: '100%' },
        ].map(stat => (
          <div key={stat.label}>
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

interface Props { initialData: Driver[] }

export function DriverMarketplace({ initialData }: Props) {
  const [search, setSearch] = useState('')
  const [minExp, setMinExp] = useState<string>('any')
  const [sort, setSort] = useState<string>('rating')

  const filtered = useMemo(() => {
    let data = [...initialData]
    if (search) {
      data = data.filter(d =>
        d.profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.bio?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (minExp !== 'any') data = data.filter(d => d.years_experience >= parseInt(minExp))
    if (sort === 'rating') data.sort((a, b) => b.rating - a.rating)
    if (sort === 'experience') data.sort((a, b) => b.years_experience - a.years_experience)
    if (sort === 'trips') data.sort((a, b) => b.total_trips - a.total_trips)
    return data
  }, [initialData, search, minExp, sort])

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-green-500/20 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Hire a Driver</h1>
            </div>
            <p className="text-zinc-400">{initialData.length} verified professional drivers available</p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="flex-1">
            <SearchBar placeholder="Search drivers by name or bio..." value={search} onChange={setSearch} />
          </div>
          <Select value={minExp} onValueChange={setMinExp}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Min. experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Experience</SelectItem>
              <SelectItem value="2">2+ Years</SelectItem>
              <SelectItem value="5">5+ Years</SelectItem>
              <SelectItem value="10">10+ Years</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="experience">Most Experienced</SelectItem>
              <SelectItem value="trips">Most Trips</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <p className="text-sm text-zinc-500 mb-5">{filtered.length} driver{filtered.length !== 1 ? 's' : ''} found</p>

        {initialData.length === 0 ? (
          <DriverEmptyState />
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-zinc-500">
            <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No drivers match your filters.</p>
            <button onClick={() => { setSearch(''); setMinExp('any') }} className="mt-3 text-orange-400 text-sm hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((driver, i) => (
              <DriverCard key={driver.id} driver={driver} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DriverCard({ driver, index }: { driver: Driver; index: number }) {
  const name = driver.profile?.full_name ?? 'Driver'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Link href={`/drivers/${driver.id}`} className="group block">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200">
          {/* Top */}
          <div className="flex items-start gap-4 mb-5">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarImage src={driver.profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors truncate">
                  {name}
                </h3>
                <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-zinc-300 font-medium">
                  {driver.rating > 0 ? driver.rating.toFixed(1) : 'New'}
                </span>
                <span className="text-xs text-zinc-600">({driver.total_trips} trips)</span>
              </div>
              {driver.profile?.location && (
                <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500">
                  <MapPin className="h-3 w-3" />
                  {driver.profile.location}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {driver.bio && (
            <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{driver.bio}</p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Briefcase className="h-3.5 w-3.5 text-zinc-500" />
              {driver.years_experience} yrs experience
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <UserCheck className="h-3.5 w-3.5 text-green-500" />
              Verified Driver
            </div>
          </div>

          <Button size="sm" variant="secondary" className="w-full border-green-500/20 text-green-300 hover:text-white hover:bg-green-500/20">
            View Profile & Hire
          </Button>
        </div>
      </Link>
    </motion.div>
  )
}
