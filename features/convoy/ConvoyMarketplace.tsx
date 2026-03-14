'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Star, MapPin, SlidersHorizontal, Users, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'
import { SearchBar } from '@/components/forms/SearchBar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/helpers'
import { NIGERIAN_STATES } from '@/utils/helpers'
import Link from 'next/link'
import Image from 'next/image'
import type { ConvoyService, ConvoyServiceType } from '@/types'

/* ── helpers ─────────────────────────────────────────── */

const serviceTypeLabels: Record<ConvoyServiceType, string> = {
  armed: 'Armed Escort',
  unarmed: 'Unarmed Escort',
  corporate: 'Corporate',
  vip: 'VIP',
  logistics: 'Logistics',
}

// Colour palette per service type
const typeStyle: Record<ConvoyServiceType, { bg: string; text: string; border: string; glow: string; rgb: string }> = {
  armed:     { bg: 'bg-red-500/20',    text: 'text-red-300',    border: 'border-red-500/30',    glow: 'rgba(239,68,68,0.35)',    rgb: '239,68,68' },
  unarmed:   { bg: 'bg-zinc-500/20',   text: 'text-zinc-300',   border: 'border-zinc-500/30',   glow: 'rgba(161,161,170,0.25)',  rgb: '161,161,170' },
  corporate: { bg: 'bg-blue-500/20',   text: 'text-blue-300',   border: 'border-blue-500/30',   glow: 'rgba(59,130,246,0.35)',   rgb: '59,130,246' },
  vip:       { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', glow: 'rgba(234,179,8,0.35)',    rgb: '234,179,8' },
  logistics: { bg: 'bg-green-500/20',  text: 'text-green-300',  border: 'border-green-500/30',  glow: 'rgba(34,197,94,0.35)',    rgb: '34,197,94' },
}

// Cycle through bg images when service has no photos
const fallbackImages = [
  '/images/bgImage1.jpg',
  '/images/bgImage2.jpg',
  '/images/bgImage3.jpg',
  '/images/bgImage4.jpg',
  '/images/bgImage5.jpg',
  '/images/bgImage6.jpg',
  '/images/bgImage7.jpg',
  '/images/bgImage8.jpg',
  '/images/bgImage9.jpg',
]

/* ── main component ──────────────────────────────────── */

interface Props { initialData: ConvoyService[] }

export function ConvoyMarketplace({ initialData }: Props) {
  const [search, setSearch]           = useState('')
  const [serviceType, setServiceType] = useState<string>('all')
  const [state, setState]             = useState<string>('all')
  const [sort, setSort]               = useState<string>('rating')

  const filtered = useMemo(() => {
    let data = [...initialData]
    if (search)              data = data.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()))
    if (serviceType !== 'all') data = data.filter(s => s.service_type === serviceType)
    if (state !== 'all')     data = data.filter(s => s.available_states.includes(state))
    if (sort === 'rating')      data.sort((a, b) => b.rating - a.rating)
    if (sort === 'price_asc')   data.sort((a, b) => a.base_price - b.base_price)
    if (sort === 'price_desc')  data.sort((a, b) => b.base_price - a.base_price)
    if (sort === 'bookings')    data.sort((a, b) => b.total_bookings - a.total_bookings)
    return data
  }, [initialData, search, serviceType, state, sort])

  return (
    <div className="min-h-screen bg-zinc-950">

      {/* ── Hero header ────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-zinc-800/60">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src="/images/bgImage1.jpg" alt="" fill quality={70} className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-zinc-950/80" />
          <div className="absolute inset-0 bg-dot opacity-[0.12]" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 80% at 20% 50%, rgba(249,115,22,0.1) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-300 mb-5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              Nigeria&apos;s #1 Convoy Network
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              Convoy Escort{' '}
              <span className="gradient-text">Services</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-lg">
              Browse {initialData.length} verified convoy providers across Nigeria — armed escorts, VIP protection, corporate &amp; logistics.
            </p>

            {/* Quick stats row */}
            <div className="flex flex-wrap gap-5 mt-7">
              {[
                { icon: Shield, label: 'Verified Providers', val: initialData.length },
                { icon: MapPin, label: 'States Covered', val: '36' },
                { icon: Zap, label: 'Instant Booking', val: '24/7' },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                    <Icon className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">{val}</p>
                    <p className="text-xs text-zinc-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Filters ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
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
              <SelectItem value="price_asc">Price: Low → High</SelectItem>
              <SelectItem value="price_desc">Price: High → Low</SelectItem>
              <SelectItem value="bookings">Most Booked</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Results count */}
        <p className="text-xs text-zinc-500 mb-6 font-medium uppercase tracking-wider">
          {filtered.length} service{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* ── Grid ─────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {initialData.length === 0 ? (
            <ConvoyEmptyState />
          ) : filtered.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center text-zinc-500"
            >
              <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm mb-3">No services match your filters.</p>
              <button
                onClick={() => { setSearch(''); setServiceType('all'); setState('all') }}
                className="text-orange-400 text-sm hover:text-orange-300 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6"
            >
              {filtered.map((service, i) => (
                <ConvoyCard key={service.id} service={service} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ── Card ────────────────────────────────────────────── */

function ConvoyCard({ service, index }: { service: ConvoyService; index: number }) {
  const style   = typeStyle[service.service_type] ?? typeStyle.unarmed
  const imgSrc  = service.images?.[0] ?? fallbackImages[index % fallbackImages.length]
  const isNew   = service.rating === 0 || service.rating == null

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/convoy/${service.id}`} className="group block">
        <div className="relative rounded-3xl overflow-hidden h-[420px] sm:h-[440px] cursor-pointer">

          {/* ── Photo ── */}
          {service.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={service.images[0]}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <Image
              src={imgSrc}
              alt={service.title}
              fill
              quality={80}
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          )}

          {/* Cinematic gradient — light top, heavy bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.95) 100%)',
            }}
          />

          {/* Colour wash matching service type */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-50"
            style={{ background: `linear-gradient(160deg, rgba(${style.rgb},0.5) 0%, transparent 55%)` }}
          />

          {/* ── Top row ── */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
            {/* Service type pill */}
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-md ${style.bg} ${style.text} ${style.border}`}>
              <Shield className="h-3 w-3" />
              {serviceTypeLabels[service.service_type]}
            </span>

            {/* Vehicle count */}
            {service.vehicle_count > 1 && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full bg-zinc-900/70 backdrop-blur-md border border-zinc-700/60 text-zinc-300">
                <Users className="h-3 w-3" />
                {service.vehicle_count} vehicles
              </span>
            )}
          </div>

          {/* Rating badge — top right corner */}
          <div className="absolute top-14 right-4">
            <div className="flex items-center gap-1 bg-zinc-900/75 backdrop-blur-md border border-zinc-700/50 rounded-xl px-2.5 py-1.5">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-white">
                {isNew ? 'New' : service.rating.toFixed(1)}
              </span>
              {!isNew && service.total_bookings > 0 && (
                <span className="text-[10px] text-zinc-400">({service.total_bookings})</span>
              )}
            </div>
          </div>

          {/* ── Bottom content panel ── */}
          <div className="absolute bottom-0 left-0 right-0 p-5">

            {/* Provider row */}
            {service.provider && (
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border"
                  style={{ background: `rgba(${style.rgb},0.2)`, color: style.text.replace('text-', ''), borderColor: `rgba(${style.rgb},0.3)` }}
                >
                  {service.provider.full_name?.[0] ?? '?'}
                </div>
                <span className="text-xs text-zinc-400 truncate">{service.provider.full_name}</span>
                <CheckCircle2 className="h-3 w-3 text-green-400 shrink-0" />
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-1 line-clamp-2 group-hover:text-orange-300 transition-colors duration-300">
              {service.title}
            </h3>

            {/* Accent line */}
            <div
              className="h-0.5 w-8 rounded-full mb-3 transition-all duration-500 group-hover:w-16"
              style={{ background: style.glow.replace('0.35', '1').replace('rgba', 'rgb').replace(/,\s*[\d.]+\)/, ')') }}
            />

            {/* Description — shows on hover */}
            <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
              {service.description}
            </p>

            {/* States */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-5">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {service.available_states.slice(0, 3).join(' · ')}
                {service.available_states.length > 3 && ` +${service.available_states.length - 3} more`}
              </span>
            </div>

            {/* Price + CTA row */}
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white leading-none">
                  {formatCurrency(service.base_price)}
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  base · +{formatCurrency(service.price_per_km)}/km
                </p>
              </div>

              <div
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 group-hover:gap-2.5 shrink-0"
                style={{
                  background: `rgba(${style.rgb},0.15)`,
                  color: style.text.replace('text-', 'rgb(').replace(/-([\d]+)/, (_, n) => `)`) || '#f97316',
                  border: `1px solid rgba(${style.rgb},0.3)`,
                }}
              >
                <span className={style.text}>Book Now</span>
                <ArrowRight className={`h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 ${style.text}`} />
              </div>
            </div>
          </div>

          {/* Inset border glow on hover */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ boxShadow: `inset 0 0 0 1.5px rgba(${style.rgb},0.45)` }}
          />
        </div>
      </Link>
    </motion.div>
  )
}

/* ── Empty state ─────────────────────────────────────── */

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
          <rect x="0" y="95" width="260" height="25" rx="4" fill="#18181b"/>
          <rect x="100" y="104" width="16" height="4" rx="2" fill="#3f3f46"/>
          <rect x="126" y="104" width="16" height="4" rx="2" fill="#3f3f46"/>
          <rect x="10" y="62" width="80" height="36" rx="6" fill="#27272a" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.5"/>
          <path d="M22 62 L30 46 L72 46 L82 62 Z" fill="#3f3f46" stroke="#f97316" strokeWidth="1" strokeOpacity="0.3"/>
          <rect x="32" y="50" width="18" height="12" rx="2" fill="#7c2d12" fillOpacity="0.6" stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.4"/>
          <rect x="54" y="50" width="20" height="12" rx="2" fill="#7c2d12" fillOpacity="0.6" stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.4"/>
          <rect x="80" y="72" width="12" height="6" rx="3" fill="#fbbf24" fillOpacity="0.8"/>
          <circle cx="28" cy="98" r="10" fill="#18181b" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.5"/>
          <circle cx="28" cy="98" r="4" fill="#27272a"/>
          <circle cx="72" cy="98" r="10" fill="#18181b" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.5"/>
          <circle cx="72" cy="98" r="4" fill="#27272a"/>
          <rect x="100" y="68" width="70" height="30" rx="5" fill="#27272a" stroke="#f97316" strokeWidth="1" strokeOpacity="0.35"/>
          <path d="M112 68 L118 54 L158 54 L165 68 Z" fill="#3f3f46" stroke="#f97316" strokeWidth="1" strokeOpacity="0.2"/>
          <circle cx="116" cy="98" r="9" fill="#18181b" stroke="#f97316" strokeWidth="1.2" strokeOpacity="0.4"/>
          <circle cx="116" cy="98" r="4" fill="#27272a"/>
          <circle cx="154" cy="98" r="9" fill="#18181b" stroke="#f97316" strokeWidth="1.2" strokeOpacity="0.4"/>
          <circle cx="154" cy="98" r="4" fill="#27272a"/>
          <rect x="180" y="65" width="72" height="32" rx="6" fill="#27272a" stroke="#f97316" strokeWidth="1" strokeOpacity="0.3"/>
          <path d="M190 65 L198 50 L234 50 L244 65 Z" fill="#3f3f46" stroke="#f97316" strokeWidth="1" strokeOpacity="0.2"/>
          <rect x="179" y="72" width="10" height="5" rx="2" fill="#ef4444" fillOpacity="0.7"/>
          <circle cx="196" cy="97" r="9" fill="#18181b" stroke="#f97316" strokeWidth="1.2" strokeOpacity="0.4"/>
          <circle cx="196" cy="97" r="4" fill="#27272a"/>
          <circle cx="234" cy="97" r="9" fill="#18181b" stroke="#f97316" strokeWidth="1.2" strokeOpacity="0.4"/>
          <circle cx="234" cy="97" r="4" fill="#27272a"/>
          <line x1="0" y1="72" x2="8" y2="72" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round"/>
          <line x1="0" y1="78" x2="5" y2="78" stroke="#f97316" strokeWidth="1" strokeOpacity="0.25" strokeLinecap="round"/>
          <line x1="0" y1="84" x2="8" y2="84" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round"/>
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
