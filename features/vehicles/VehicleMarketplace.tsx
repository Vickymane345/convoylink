'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Car, Star, Users, SlidersHorizontal } from 'lucide-react'
import { SearchBar } from '@/components/forms/SearchBar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/helpers'
import { NIGERIAN_STATES } from '@/utils/helpers'
import Link from 'next/link'
import type { Vehicle, VehicleType } from '@/types'

const vehicleTypeLabels: Record<VehicleType, string> = {
  sedan: 'Sedan', suv: 'SUV', bus: 'Bus', truck: 'Truck', armored: 'Armored', van: 'Van',
}
const vehicleTypeBadge: Record<VehicleType, 'default' | 'danger' | 'info' | 'success' | 'warning' | 'secondary'> = {
  sedan: 'secondary', suv: 'info', bus: 'success', truck: 'warning', armored: 'danger', van: 'secondary',
}

interface Props { initialData: Vehicle[] }

export function VehicleMarketplace({ initialData }: Props) {
  const [search, setSearch] = useState('')
  const [vehicleType, setVehicleType] = useState<string>('all')
  const [state, setState] = useState<string>('all')
  const [sort, setSort] = useState<string>('price_asc')

  const filtered = useMemo(() => {
    let data = [...initialData]
    if (search) data = data.filter(v => `${v.make} ${v.model}`.toLowerCase().includes(search.toLowerCase()))
    if (vehicleType !== 'all') data = data.filter(v => v.vehicle_type === vehicleType)
    if (state !== 'all') data = data.filter(v => v.state === state)
    if (sort === 'price_asc') data.sort((a, b) => a.daily_rate - b.daily_rate)
    if (sort === 'price_desc') data.sort((a, b) => b.daily_rate - a.daily_rate)
    if (sort === 'capacity') data.sort((a, b) => b.capacity - a.capacity)
    return data
  }, [initialData, search, vehicleType, state, sort])

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Car className="h-5 w-5 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Vehicle Rental</h1>
            </div>
            <p className="text-zinc-400">{initialData.length} verified vehicles available across Nigeria</p>
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
            <SearchBar placeholder="Search make, model..." value={search} onChange={setSearch} />
          </div>
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {(Object.keys(vehicleTypeLabels) as VehicleType[]).map(t => (
                <SelectItem key={t} value={t}>{vehicleTypeLabels[t]}</SelectItem>
              ))}
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
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="capacity">Most Seats</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <p className="text-sm text-zinc-500 mb-5">{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} found</p>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-zinc-500">
            <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No vehicles match your filters.</p>
            <button onClick={() => { setSearch(''); setVehicleType('all'); setState('all') }} className="mt-3 text-orange-400 text-sm hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function VehicleCard({ vehicle, index }: { vehicle: Vehicle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Link href={`/vehicles/${vehicle.id}`} className="group block">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200">
          <div className="h-44 bg-gradient-to-br from-blue-500/10 to-zinc-800 flex items-center justify-center relative">
            {vehicle.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={vehicle.images[0]} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
            ) : (
              <Car className="h-12 w-12 text-blue-500/30" />
            )}
            <div className="absolute top-3 left-3">
              <Badge variant={vehicleTypeBadge[vehicle.vehicle_type]}>
                {vehicleTypeLabels[vehicle.vehicle_type]}
              </Badge>
            </div>
            <div className="absolute top-3 right-3 bg-zinc-900/80 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-zinc-300">
              {vehicle.year}
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
            {vehicle.description && (
              <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{vehicle.description}</p>
            )}

            {/* Features */}
            {vehicle.features?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {vehicle.features.slice(0, 3).map(f => (
                  <span key={f} className="text-xs bg-zinc-800 text-zinc-400 rounded-md px-2 py-0.5">{f}</span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-white">{formatCurrency(vehicle.daily_rate)}</p>
                <p className="text-xs text-zinc-500">per day</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Users className="h-3.5 w-3.5" />
                  {vehicle.capacity} seats
                </div>
                {vehicle.state && (
                  <span className="text-xs text-zinc-500">{vehicle.state}</span>
                )}
              </div>
            </div>

            <Button size="sm" variant="secondary" className="w-full mt-4 border-blue-500/30 text-blue-300 hover:text-white hover:bg-blue-500/20">
              View Details
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
