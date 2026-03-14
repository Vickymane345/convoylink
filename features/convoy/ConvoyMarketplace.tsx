'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Shield, Star, MapPin, SlidersHorizontal } from 'lucide-react'
import { SearchBar } from '@/components/forms/SearchBar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/helpers'
import { NIGERIAN_STATES } from '@/utils/helpers'
import Link from 'next/link'
import type { ConvoyService, ConvoyServiceType } from '@/types'

const serviceTypeLabels: Record<ConvoyServiceType, string> = {
  armed: 'Armed Escort',
  unarmed: 'Unarmed Escort',
  corporate: 'Corporate',
  vip: 'VIP',
  logistics: 'Logistics',
}

const serviceTypeBadge: Record<ConvoyServiceType, 'default' | 'danger' | 'info' | 'success' | 'warning' | 'secondary'> = {
  armed: 'danger',
  unarmed: 'secondary',
  corporate: 'info',
  vip: 'default',
  logistics: 'success',
}

interface Props { initialData: ConvoyService[] }

export function ConvoyMarketplace({ initialData }: Props) {
  const [search, setSearch] = useState('')
  const [serviceType, setServiceType] = useState<string>('all')
  const [state, setState] = useState<string>('all')
  const [sort, setSort] = useState<string>('rating')

  const filtered = useMemo(() => {
    let data = [...initialData]
    if (search) data = data.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()))
    if (serviceType !== 'all') data = data.filter(s => s.service_type === serviceType)
    if (state !== 'all') data = data.filter(s => s.available_states.includes(state))
    if (sort === 'rating') data.sort((a, b) => b.rating - a.rating)
    if (sort === 'price_asc') data.sort((a, b) => a.base_price - b.base_price)
    if (sort === 'price_desc') data.sort((a, b) => b.base_price - a.base_price)
    if (sort === 'bookings') data.sort((a, b) => b.total_bookings - a.total_bookings)
    return data
  }, [initialData, search, serviceType, state, sort])

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-orange-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Convoy Services</h1>
            </div>
            <p className="text-zinc-400">Browse {initialData.length} verified convoy escort providers across Nigeria</p>
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
            <SearchBar placeholder="Search convoy services..." value={search} onChange={setSearch} />
          </div>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="armed">Armed Escort</SelectItem>
              <SelectItem value="unarmed">Unarmed Escort</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="logistics">Logistics</SelectItem>
            </SelectContent>
          </Select>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {NIGERIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="bookings">Most Booked</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Results count */}
        <p className="text-sm text-zinc-500 mb-5">
          {filtered.length} service{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Grid */}
        {initialData.length === 0 ? (
          <ConvoyEmptyState />
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-zinc-500">
            <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No services match your filters.</p>
            <button onClick={() => { setSearch(''); setServiceType('all'); setState('all') }} className="mt-3 text-orange-400 text-sm hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((service, i) => (
              <ConvoyCard key={service.id} service={service} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ConvoyEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="mb-8 relative">
        <svg width="260" height="120" viewBox="0 0 260 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Road */}
          <rect x="0" y="95" width="260" height="25" rx="4" fill="#18181b"/>
          <rect x="100" y="104" width="16" height="4" rx="2" fill="#3f3f46"/>
          <rect x="126" y="104" width="16" height="4" rx="2" fill="#3f3f46"/>

          {/* Lead armored vehicle */}
          <rect x="10" y="62" width="80" height="36" rx="6" fill="#27272a" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.5"/>
          <path d="M22 62 L30 46 L72 46 L82 62 Z" fill="#3f3f46" stroke="#f97316" strokeWidth="1" strokeOpacity="0.3"/>
          <rect x="32" y="50" width="18" height="12" rx="2" fill="#7c2d12" fillOpacity="0.6" stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.4"/>
          <rect x="54" y="50" width="20" height="12" rx="2" fill="#7c2d12" fillOpacity="0.6" stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.4"/>
          <rect x="80" y="72" width="12" height="6" rx="3" fill="#fbbf24" fillOpacity="0.8"/>
          <circle cx="28" cy="98" r="10" fill="#18181b" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.5"/>
          <circle cx="28" cy="98" r="4" fill="#27272a"/>
          <circle cx="72" cy="98" r="10" fill="#18181b" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.5"/>
          <circle cx="72" cy="98" r="4" fill="#27272a"/>

          {/* Middle sedan */}
          <rect x="100" y="68" width="70" height="30" rx="5" fill="#27272a" stroke="#f97316" strokeWidth="1" strokeOpacity="0.35"/>
          <path d="M112 68 L118 54 L158 54 L165 68 Z" fill="#3f3f46" stroke="#f97316" strokeWidth="1" strokeOpacity="0.2"/>
          <rect x="119" y="57" width="16" height="10" rx="2" fill="#7c2d12" fillOpacity="0.5"/>
          <rect x="140" y="57" width="16" height="10" rx="2" fill="#7c2d12" fillOpacity="0.5"/>
          <circle cx="116" cy="98" r="9" fill="#18181b" stroke="#f97316" strokeWidth="1.2" strokeOpacity="0.4"/>
          <circle cx="116" cy="98" r="4" fill="#27272a"/>
          <circle cx="154" cy="98" r="9" fill="#18181b" stroke="#f97316" strokeWidth="1.2" strokeOpacity="0.4"/>
          <circle cx="154" cy="98" r="4" fill="#27272a"/>

          {/* Rear escort */}
          <rect x="180" y="65" width="72" height="32" rx="6" fill="#27272a" stroke="#f97316" strokeWidth="1" strokeOpacity="0.3"/>
          <path d="M190 65 L198 50 L234 50 L244 65 Z" fill="#3f3f46" stroke="#f97316" strokeWidth="1" strokeOpacity="0.2"/>
          <rect x="199" y="54" width="16" height="10" rx="2" fill="#7c2d12" fillOpacity="0.5"/>
          <rect x="219" y="54" width="16" height="10" rx="2" fill="#7c2d12" fillOpacity="0.5"/>
          <rect x="179" y="72" width="10" height="5" rx="2" fill="#ef4444" fillOpacity="0.7"/>
          <circle cx="196" cy="97" r="9" fill="#18181b" stroke="#f97316" strokeWidth="1.2" strokeOpacity="0.4"/>
          <circle cx="196" cy="97" r="4" fill="#27272a"/>
          <circle cx="234" cy="97" r="9" fill="#18181b" stroke="#f97316" strokeWidth="1.2" strokeOpacity="0.4"/>
          <circle cx="234" cy="97" r="4" fill="#27272a"/>

          {/* Motion lines */}
          <line x1="0" y1="72" x2="8" y2="72" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round"/>
          <line x1="0" y1="78" x2="5" y2="78" stroke="#f97316" strokeWidth="1" strokeOpacity="0.25" strokeLinecap="round"/>
          <line x1="0" y1="84" x2="8" y2="84" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round"/>

          {/* Shield icon above */}
          <path d="M122 18 L130 10 L138 18 L138 28 Q130 34 130 34 Q122 28 122 28 Z" fill="#f97316" fillOpacity="0.2" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.6"/>
          <path d="M126 22 L129 25 L134 19" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8"/>
        </svg>

        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-3 right-0 bg-orange-500/20 border border-orange-500/30 rounded-xl px-3 py-1.5"
        >
          <span className="text-xs font-medium text-orange-300">Coming soon</span>
        </motion.div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">No convoy services listed yet</h3>
      <p className="text-zinc-400 text-sm max-w-sm leading-relaxed mb-8">
        Verified convoy escort providers will appear here. Are you a licensed security company or convoy operator in Nigeria? List your services and connect with clients today.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/sign-up">
          <Button size="lg" className="gap-2">
            <Shield className="h-4 w-4" />
            List Your Convoy Service
          </Button>
        </Link>
        <a href="mailto:hello@convoylink.ng">
          <Button size="lg" variant="outline" className="gap-2">
            Contact Us
          </Button>
        </a>
      </div>
    </motion.div>
  )
}

function ConvoyCard({ service, index }: { service: ConvoyService; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Link href={`/convoy/${service.id}`} className="group block">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200">
          {/* Image placeholder */}
          <div className="h-44 bg-gradient-to-br from-orange-500/10 to-zinc-800 flex items-center justify-center relative">
            {service.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
            ) : (
              <Shield className="h-12 w-12 text-orange-500/30" />
            )}
            <div className="absolute top-3 left-3">
              <Badge variant={serviceTypeBadge[service.service_type]}>
                {serviceTypeLabels[service.service_type]}
              </Badge>
            </div>
            {service.vehicle_count > 1 && (
              <div className="absolute top-3 right-3 bg-zinc-900/80 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-zinc-300">
                {service.vehicle_count} vehicles
              </div>
            )}
          </div>

          <div className="p-5">
            <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-orange-400 transition-colors line-clamp-1">
              {service.title}
            </h3>
            <p className="text-xs text-zinc-500 line-clamp-2 mb-4">{service.description}</p>

            {/* Provider */}
            {service.provider && (
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-full bg-orange-500/20 flex items-center justify-center text-xs text-orange-400 font-bold">
                  {service.provider.full_name?.[0]}
                </div>
                <span className="text-xs text-zinc-500 truncate">{service.provider.full_name}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-white">{formatCurrency(service.base_price)}</p>
                <p className="text-xs text-zinc-500">+ {formatCurrency(service.price_per_km)}/km</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-zinc-300 font-medium">{service.rating > 0 ? service.rating.toFixed(1) : 'New'}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <MapPin className="h-3 w-3" />
                  {service.available_states.slice(0, 2).join(', ')}
                  {service.available_states.length > 2 && ` +${service.available_states.length - 2}`}
                </div>
              </div>
            </div>

            <Button size="sm" className="w-full mt-4">Book Now</Button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
