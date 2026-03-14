import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Shield, Star, MapPin, Truck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/helpers'
import type { ConvoyService } from '@/types'

type ServiceWithProvider = ConvoyService & {
  provider: { full_name: string; avatar_url: string | null; location: string | null }
}

export default async function ConvoyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('convoy_services')
    .select('*, provider:user_profiles!provider_id(*)')
    .eq('id', id)
    .single()

  if (!data) notFound()
  const s = data as unknown as ServiceWithProvider

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/convoy" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Convoy Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 rounded-2xl bg-gradient-to-br from-orange-500/10 to-zinc-800 flex items-center justify-center overflow-hidden">
              {s.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.images[0]} alt={s.title} className="w-full h-full object-cover" />
              ) : (
                <Shield className="h-16 w-16 text-orange-500/20" />
              )}
            </div>

            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-2xl font-bold text-white">{s.title}</h1>
                <Badge variant="default">{s.service_type.toUpperCase()}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-medium">{s.rating > 0 ? s.rating.toFixed(1) : 'New'}</span>
                </div>
                <span>·</span>
                <span>{s.total_bookings} bookings</span>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  {s.vehicle_count} vehicle{s.vehicle_count !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white mb-2">About This Service</h2>
              <p className="text-zinc-400 leading-relaxed text-sm">{s.description}</p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white mb-3">Coverage Areas</h2>
              <div className="flex flex-wrap gap-2">
                {s.available_states.map((state: string) => (
                  <div key={state} className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300">
                    <MapPin className="h-3.5 w-3.5 text-orange-400" /> {state}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
              <p className="text-3xl font-bold text-white">{formatCurrency(s.base_price)}</p>
              <p className="text-sm text-zinc-500 mb-1">Base price</p>
              <p className="text-sm text-zinc-400">+ {formatCurrency(s.price_per_km)} per km</p>
              <p className="text-xs text-zinc-600 mt-1">Max distance: {s.max_distance_km} km</p>
              <Link href={`/book?service=convoy&id=${s.id}`} className="block mt-6">
                <Button className="w-full" size="lg">Book This Convoy</Button>
              </Link>
              <p className="text-xs text-zinc-600 mt-3 text-center">Payment held securely in escrow</p>
            </div>

            {s.provider && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                <h3 className="text-sm font-semibold text-zinc-400 mb-3">Service Provider</h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                    {s.provider.full_name?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{s.provider.full_name}</p>
                    {s.provider.location && <p className="text-xs text-zinc-500">{s.provider.location}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
