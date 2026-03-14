import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { BookingWizard } from '@/features/bookings/BookingWizard'

export const metadata = { title: 'Book a Service' }

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; id?: string }>
}) {
  const { service, id } = await searchParams
  const supabase = await createClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()

  let serviceData = null
  let providerData = null

  if (id && service === 'convoy') {
    const { data } = await supabase
      .from('convoy_services')
      .select('*, provider:user_profiles!provider_id(*)')
      .eq('id', id)
      .single()
    serviceData = data
    providerData = (serviceData as unknown as { provider: { id: string } })?.provider
  } else if (id && service === 'vehicle') {
    const { data } = await supabase
      .from('vehicles')
      .select('*, owner:user_profiles!owner_id(*)')
      .eq('id', id)
      .single()
    serviceData = data
    providerData = (serviceData as unknown as { owner: { id: string } })?.owner
  } else if (id && service === 'driver') {
    const { data } = await supabase
      .from('drivers')
      .select('*, profile:user_profiles!user_id(*)')
      .eq('id', id)
      .single()
    serviceData = data
    providerData = (serviceData as unknown as { profile: { id: string } })?.profile
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" /></div>}>
        <BookingWizard
          serviceType={(service as 'convoy' | 'vehicle' | 'driver') ?? 'convoy'}
          serviceId={id ?? ''}
          serviceData={serviceData}
          providerId={(providerData as { id: string } | null)?.id ?? ''}
          userId={authUser?.id ?? null}
        />
      </Suspense>
    </div>
  )
}
