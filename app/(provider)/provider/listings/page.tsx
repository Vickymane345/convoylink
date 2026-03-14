import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Car, Plus, Star } from 'lucide-react'
import { formatCurrency } from '@/utils/helpers'

export const metadata = { title: 'My Listings' }

export default async function ProviderListingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: servicesRaw }, { data: vehiclesRaw }] = await Promise.all([
    supabase.from('convoy_services').select('*').eq('provider_id', user!.id).order('created_at', { ascending: false }),
    supabase.from('vehicles').select('*').eq('owner_id', user!.id).order('created_at', { ascending: false }),
  ])
  const services = servicesRaw as unknown as Array<{ id: string; title: string; base_price: number; rating: number; total_bookings: number; is_active: boolean }> | null
  const vehicles = vehiclesRaw as unknown as Array<{ id: string; make: string; model: string; year: number; daily_rate: number; plate_number: string; is_verified: boolean }> | null

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">My Listings</h1>
          <p className="text-zinc-400 mt-1">{(services?.length ?? 0) + (vehicles?.length ?? 0)} total listings</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="/provider/listings/new-convoy">
            <Button size="sm" variant="secondary"><Plus className="h-4 w-4 mr-1" />Convoy Service</Button>
          </Link>
          <Link href="/provider/listings/new-vehicle">
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Vehicle</Button>
          </Link>
        </div>
      </div>

      {/* Convoy Services */}
      {(services?.length ?? 0) > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-400" /> Convoy Services
          </h2>
          <div className="space-y-2">
            {services!.map((service) => (
              <div key={service.id} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{service.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-500">
                    <span>{formatCurrency(service.base_price)} base</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3" />{service.rating > 0 ? service.rating : 'New'}</span>
                    <span>·</span>
                    <span>{service.total_bookings} bookings</span>
                  </div>
                </div>
                <Badge variant={service.is_active ? 'success' : 'secondary'}>
                  {service.is_active ? 'Active' : 'Paused'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vehicles */}
      {(vehicles?.length ?? 0) > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Car className="h-4 w-4 text-blue-400" /> Vehicles
          </h2>
          <div className="space-y-2">
            {vehicles!.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Car className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-500">
                    <span>{formatCurrency(vehicle.daily_rate)}/day</span>
                    <span>·</span>
                    <span>{vehicle.plate_number}</span>
                  </div>
                </div>
                <Badge variant={vehicle.is_verified ? 'success' : 'warning'}>
                  {vehicle.is_verified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {(services?.length ?? 0) === 0 && (vehicles?.length ?? 0) === 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 py-16 text-center text-zinc-500">
          <p className="mb-4">No listings yet. Create your first service to start earning.</p>
          <Link href="/provider/listings/new-convoy">
            <Button><Plus className="h-4 w-4 mr-2" />Create First Listing</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
