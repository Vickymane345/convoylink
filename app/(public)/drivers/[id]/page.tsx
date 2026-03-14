import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star, Briefcase, CheckCircle2, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/utils/helpers'
import type { Driver } from '@/types'

type DriverWithProfile = Driver & {
  profile: { full_name: string; avatar_url: string | null; location: string | null; email: string }
}

export default async function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('drivers')
    .select('*, profile:user_profiles!user_id(*)')
    .eq('id', id)
    .single()

  if (!data) notFound()
  const d = data as unknown as DriverWithProfile
  const name = d.profile?.full_name ?? 'Driver'

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/drivers" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Drivers
        </Link>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <Avatar className="h-20 w-20 shrink-0">
              <AvatarImage src={d.profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-2xl">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">{name}</h1>
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-medium">{d.rating > 0 ? d.rating.toFixed(1) : 'New'}</span>
                  <span className="text-zinc-600">({d.total_trips} trips)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {d.years_experience} years experience
                </div>
                {d.profile?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {d.profile.location}
                  </div>
                )}
              </div>
            </div>
          </div>

          {d.bio && (
            <div className="mb-8">
              <h2 className="text-base font-semibold text-white mb-2">About</h2>
              <p className="text-zinc-400 leading-relaxed text-sm">{d.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Trips Completed', value: d.total_trips },
              { label: 'Years Driving', value: d.years_experience },
              { label: 'Rating', value: d.rating > 0 ? d.rating.toFixed(1) : 'New' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-zinc-800/60 p-4 text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <Link href={`/book?service=driver&id=${d.id}`}>
            <Button className="w-full" size="lg">Hire This Driver</Button>
          </Link>
          <p className="text-xs text-zinc-600 mt-3 text-center">Payment held securely in escrow until trip completes</p>
        </div>
      </div>
    </div>
  )
}
