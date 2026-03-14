import { createClient } from '@/lib/supabase/server'
import { VehicleMarketplace } from '@/features/vehicles/VehicleMarketplace'
import type { Vehicle } from '@/types'

export const metadata = { title: 'Vehicle Rental' }

export default async function VehiclesPage() {
  const supabase = await createClient()

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*, owner:user_profiles!owner_id(*)')
    .eq('is_verified', true)
    .eq('status', 'available')
    .order('daily_rate', { ascending: true })

  return <VehicleMarketplace initialData={(vehicles ?? []) as unknown as Vehicle[]} />
}
