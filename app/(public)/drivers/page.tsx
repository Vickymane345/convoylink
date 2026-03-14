import { createClient } from '@/lib/supabase/server'
import { DriverMarketplace } from '@/features/drivers/DriverMarketplace'

export const metadata = { title: 'Hire Drivers' }

export default async function DriversPage() {
  const supabase = await createClient()

  const { data: drivers } = await supabase
    .from('drivers')
    .select('*, profile:user_profiles!user_id(*)')
    .eq('status', 'verified')
    .order('rating', { ascending: false })

  return <DriverMarketplace initialData={drivers ?? []} />
}
