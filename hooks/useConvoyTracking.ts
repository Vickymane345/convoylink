'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTrackingStore } from '@/store/useTrackingStore'
import type { TrackingLocation } from '@/types'

/**
 * Subscribes to real-time tracking location updates for a given trip.
 * Updates the Zustand tracking store on each new location.
 */
export function useConvoyTracking(tripId: string | null) {
  const supabase = createClient()
  const { setActiveTrip, addLocation, setTracking } = useTrackingStore()
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    if (!tripId) return

    setTracking(true)

    // Subscribe to realtime inserts on tracking_locations for this trip
    const channel = supabase
      .channel(`tracking:${tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tracking_locations',
          filter: `trip_id=eq.${tripId}`,
        },
        (payload) => {
          const loc = payload.new as TrackingLocation
          addLocation(loc)
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      setTracking(false)
      supabase.removeChannel(channel)
    }
  }, [tripId, supabase, addLocation, setTracking])

  useEffect(() => {
    if (!tripId) return
    // Fetch the trip record
    async function fetchTrip() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('convoy_trips')
        .select('*')
        .eq('id', tripId)
        .single()
      if (data) setActiveTrip(data)
    }
    fetchTrip()
  }, [tripId, supabase, setActiveTrip])
}
