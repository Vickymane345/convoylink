import { createClient } from '@/lib/supabase/server'
import { ConvoyMarketplace } from '@/features/convoy/ConvoyMarketplace'
import type { ConvoyService } from '@/types'

export const metadata = { title: 'Convoy Services' }

export default async function ConvoyPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from('convoy_services')
    .select('*, provider:user_profiles!provider_id(*)')
    .eq('is_active', true)
    .order('rating', { ascending: false })

  return <ConvoyMarketplace initialData={(services ?? []) as unknown as ConvoyService[]} />
}
