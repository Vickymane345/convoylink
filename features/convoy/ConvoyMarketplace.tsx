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
        {filtered.length === 0 ? (
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
