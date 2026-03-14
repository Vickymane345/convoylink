import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/utils/helpers'
import { bookingStatusConfig } from '@/services/bookingService'

export const metadata = { title: 'Driver Assignments' }

export default async function DriverAssignmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: driver } = await supabase
    .from('drivers')
    .select('id')
    .eq('user_id', user!.id)
    .single() as { data: { id: string } | null }

  const { data: assignmentsRaw } = driver
    ? await supabase
        .from('bookings')
        .select('*')
        .eq('driver_id', driver.id)
        .order('scheduled_at', { ascending: true })
    : { data: [] }
  const assignments = assignmentsRaw as unknown as Array<{ id: string; status: string; service_type: string; pickup_location: string; dropoff_location: string; scheduled_at: string }> | null

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Assignments</h1>
        <p className="text-zinc-400 mt-1">{assignments?.length ?? 0} total assignments</p>
      </div>

      {(!assignments || assignments.length === 0) ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 py-16 text-center text-zinc-500">
          No assignments yet. You&apos;ll be notified when you&apos;re assigned to a booking.
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => {
            const config = bookingStatusConfig[a.status as keyof typeof bookingStatusConfig]
            return (
              <div key={a.id} className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white capitalize">{a.service_type} Trip</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{a.pickup_location} → {a.dropoff_location}</p>
                  <p className="text-xs text-zinc-600 mt-1">{formatDateTime(a.scheduled_at)}</p>
                </div>
                <Badge variant={config?.color ?? 'secondary'}>{config?.label ?? a.status}</Badge>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
