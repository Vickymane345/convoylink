import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Car, Users, ArrowLeft, MapPin, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/helpers'
import type { Vehicle } from '@/types'

type VehicleWithOwner = Vehicle & {
  owner: { full_name: string; location: string | null }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('vehicles')
    .select('*, owner:user_profiles!owner_id(*)')
    .eq('id', id)
    .single()

  if (!data) notFound()
  const v = data as unknown as VehicleWithOwner

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/vehicles" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Vehicles
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 rounded-2xl bg-gradient-to-br from-blue-500/10 to-zinc-800 flex items-center justify-center overflow-hidden">
              {v.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.images[0]} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover" />
              ) : (
                <Car className="h-16 w-16 text-blue-500/20" />
              )}
            </div>

            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl font-bold text-white">{v.make} {v.model} ({v.year})</h1>
                <Badge variant="info">{v.vehicle_type.toUpperCase()}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-1"><Users className="h-4 w-4" />{v.capacity} seats</div>
                {v.state && <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{v.state}</div>}
                <div className="flex items-center gap-1 text-green-400"><CheckCircle2 className="h-4 w-4" />Verified</div>
              </div>
            </div>

            {v.description && (
              <div>
                <h2 className="text-base font-semibold text-white mb-2">About This Vehicle</h2>
                <p className="text-zinc-400 leading-relaxed text-sm">{v.description}</p>
              </div>
            )}

            {v.features?.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-white mb-3">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {v.features.map((f: string) => (
                    <div key={f} className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
              <p className="text-3xl font-bold text-white">{formatCurrency(v.daily_rate)}</p>
              <p className="text-sm text-zinc-500 mb-1">per day</p>
              <p className="text-xs text-zinc-600">Plate: {v.plate_number}</p>
              <Link href={`/book?service=vehicle&id=${v.id}`} className="block mt-6">
                <Button className="w-full" size="lg">Rent This Vehicle</Button>
              </Link>
              <p className="text-xs text-zinc-600 mt-3 text-center">Payment held securely in escrow</p>
            </div>

            {v.owner && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                <h3 className="text-sm font-semibold text-zinc-400 mb-3">Listed By</h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    {v.owner.full_name?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{v.owner.full_name}</p>
                    {v.owner.location && <p className="text-xs text-zinc-500">{v.owner.location}</p>}
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
