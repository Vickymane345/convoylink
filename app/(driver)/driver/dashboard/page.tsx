import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Navigation, ClipboardList, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Driver Dashboard' }

export default async function DriverDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profileRaw }, { data: driverRaw }] = await Promise.all([
    supabase.from('user_profiles').select('full_name').eq('id', user!.id).single(),
    supabase.from('drivers').select('*').eq('user_id', user!.id).single(),
  ])
  const profile = profileRaw as unknown as { full_name: string } | null
  const driver = driverRaw as unknown as { id: string; total_trips: number; rating: number; status: string } | null

  const { data: assignmentsRaw } = driver
    ? await supabase
        .from('bookings')
        .select('id, status, pickup_location, dropoff_location, scheduled_at')
        .eq('driver_id', driver.id)
        .order('scheduled_at', { ascending: false })
        .limit(5)
    : { data: [] }
  const assignments = assignmentsRaw as unknown as Array<{ id: string; status: string; pickup_location: string; dropoff_location: string; scheduled_at: string }> | null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Driver Dashboard
        </h1>
        <p className="text-zinc-400 mt-1">
          Welcome back, {profile?.full_name?.split(' ')[0] ?? 'Driver'}
        </p>
      </div>

      {!driver ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-zinc-400 mb-4">Complete your driver profile to start accepting assignments.</p>
            <Link href="/driver/profile/setup">
              <Button>Complete Driver Profile</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Trips', value: driver.total_trips, icon: <Navigation className="h-5 w-5 text-orange-400" /> },
              { label: 'Rating', value: driver.rating > 0 ? driver.rating.toFixed(1) : 'New', icon: <Star className="h-5 w-5 text-yellow-400" /> },
              { label: 'Status', value: driver.status, icon: <TrendingUp className="h-5 w-5 text-green-400" /> },
              { label: 'Assignments', value: assignments?.length ?? 0, icon: <ClipboardList className="h-5 w-5 text-blue-400" /> },
            ].map(stat => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-white capitalize">{stat.value}</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            <Link href="/driver/tracking">
              <Button className="gap-2">
                <Navigation className="h-4 w-4" />
                Start Live Tracking
              </Button>
            </Link>
            <Link href="/driver/assignments">
              <Button variant="secondary" className="gap-2">
                <ClipboardList className="h-4 w-4" />
                View Assignments
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
