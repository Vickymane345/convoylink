'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation, Signal, SignalZero, Clock, MapPin } from 'lucide-react'
import { GoogleMapsProvider } from '@/components/maps/GoogleMapsProvider'
import { ConvoyMap, type MapMarker } from '@/components/maps/ConvoyMap'
import { useConvoyTracking } from '@/hooks/useConvoyTracking'
import { useTrackingStore } from '@/store/useTrackingStore'
import { formatDate } from '@/utils/helpers'

interface Props {
  tripId: string
  pickupLocation: string
  dropoffLocation: string
  pickupCoords?: { lat: number; lng: number } | null
  dropoffCoords?: { lat: number; lng: number } | null
}

export function LiveTrackingView({
  tripId,
  pickupLocation,
  dropoffLocation,
  pickupCoords,
  dropoffCoords,
}: Props) {
  useConvoyTracking(tripId)

  const { locationHistory, isTracking, activeTrip } = useTrackingStore()
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const latest = locationHistory[locationHistory.length - 1]

  useEffect(() => {
    if (latest) setLastUpdate(new Date())
  }, [latest])

  const markers: MapMarker[] = []

  if (pickupCoords) {
    markers.push({ id: 'pickup', type: 'pickup', label: `Pickup: ${pickupLocation}`, ...pickupCoords })
  }
  if (dropoffCoords) {
    markers.push({ id: 'dropoff', type: 'dropoff', label: `Drop-off: ${dropoffLocation}`, ...dropoffCoords })
  }
  if (latest) {
    markers.push({
      id: 'driver',
      type: 'driver',
      label: 'Driver',
      lat: latest.latitude,
      lng: latest.longitude,
    })
  }

  const mapCenter = latest
    ? { lat: latest.latitude, lng: latest.longitude }
    : pickupCoords ?? undefined

  return (
    <GoogleMapsProvider>
      <div className="space-y-4">
        {/* Status bar */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
          <div className="flex items-center gap-2">
            {isTracking ? (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="h-2.5 w-2.5 rounded-full bg-green-400"
              />
            ) : (
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            )}
            <span className="text-sm font-medium text-zinc-300">
              {isTracking ? 'Live Tracking Active' : 'Waiting for driver location…'}
            </span>
            {isTracking ? (
              <Signal className="h-4 w-4 text-green-400" />
            ) : (
              <SignalZero className="h-4 w-4 text-zinc-600" />
            )}
          </div>
          {lastUpdate && (
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Map */}
        <ConvoyMap
          markers={markers}
          center={mapCenter}
          zoom={14}
          className="h-[420px]"
        />

        {/* Trip details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 mb-0.5">Pickup</p>
                <p className="text-sm text-zinc-300">{pickupLocation}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 mb-0.5">Drop-off</p>
                <p className="text-sm text-zinc-300">{dropoffLocation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver location stats */}
        {latest && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Navigation className="h-4 w-4 text-orange-400" />
              <p className="text-sm font-medium text-zinc-300">Driver Location</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { label: 'Latitude', value: latest.latitude.toFixed(6) },
                { label: 'Longitude', value: latest.longitude.toFixed(6) },
                { label: 'Speed', value: latest.speed ? `${Math.round(latest.speed * 3.6)} km/h` : '—' },
                { label: 'Accuracy', value: latest.accuracy ? `±${Math.round(latest.accuracy)}m` : '—' },
              ].map(stat => (
                <div key={stat.label} className="rounded-lg bg-zinc-800/60 p-2.5">
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                  <p className="text-sm font-mono text-zinc-200 mt-0.5">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trip status */}
        {activeTrip && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Trip status</span>
            <span className="text-xs font-medium text-orange-400 capitalize">
              {activeTrip.status.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>
    </GoogleMapsProvider>
  )
}
