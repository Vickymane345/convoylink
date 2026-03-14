'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation, Radio, Square, AlertTriangle, Gauge, Crosshair } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDriverLocation } from '@/hooks/useDriverLocation'
import { GoogleMapsProvider } from '@/components/maps/GoogleMapsProvider'
import { ConvoyMap, type MapMarker } from '@/components/maps/ConvoyMap'
import { useTrackingStore } from '@/store/useTrackingStore'

interface Props {
  tripId: string
  bookingId: string
  pickupLocation: string
  dropoffLocation: string
}

export function DriverBroadcastPanel({
  tripId,
  pickupLocation,
  dropoffLocation,
}: Props) {
  const [error, setError] = useState<string | null>(null)
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null)
  const { locationHistory } = useTrackingStore()

  const { start, stop, isTracking, accuracy } = useDriverLocation({
    tripId,
    onError: setError,
  })

  const latest = locationHistory[locationHistory.length - 1]

  const handleStart = () => {
    setError(null)
    // Get current position to set map center before starting watch
    navigator.geolocation?.getCurrentPosition(
      (pos) => setCurrentPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => null,
      { enableHighAccuracy: true, timeout: 5000 }
    )
    start()
  }

  const markers: MapMarker[] = []
  if (latest) {
    markers.push({
      id: 'driver',
      type: 'driver',
      label: 'Your Location',
      lat: latest.latitude,
      lng: latest.longitude,
    })
  }

  return (
    <GoogleMapsProvider>
      <div className="space-y-4">
        {/* Header card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Navigation className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Live Location Broadcast</h2>
                <p className="text-xs text-zinc-500">Share your GPS with the customer</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isTracking && (
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="flex items-center gap-1.5 rounded-full bg-green-500/20 border border-green-500/30 px-3 py-1"
                >
                  <Radio className="h-3.5 w-3.5 text-green-400" />
                  <span className="text-xs font-medium text-green-400">Broadcasting</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-zinc-800/60 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Crosshair className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-500">GPS Accuracy</span>
              </div>
              <p className="text-sm font-medium text-zinc-200">
                {accuracy != null ? `±${accuracy}m` : '—'}
              </p>
            </div>
            <div className="rounded-xl bg-zinc-800/60 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-500">Points Sent</span>
              </div>
              <p className="text-sm font-medium text-zinc-200">{locationHistory.length}</p>
            </div>
          </div>

          {/* Controls */}
          {!isTracking ? (
            <Button onClick={handleStart} className="w-full gap-2" size="lg">
              <Radio className="h-4 w-4" />
              Start Broadcasting Location
            </Button>
          ) : (
            <Button
              onClick={stop}
              variant="outline"
              className="w-full gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
              size="lg"
            >
              <Square className="h-4 w-4" />
              Stop Broadcasting
            </Button>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3"
              >
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live map */}
        <ConvoyMap
          markers={markers}
          center={latest ? { lat: latest.latitude, lng: latest.longitude } : currentPos ?? undefined}
          zoom={15}
          className="h-[360px]"
        />

        {/* Route summary */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Pickup</span>
            <span className="text-zinc-300 truncate max-w-[200px]">{pickupLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Drop-off</span>
            <span className="text-zinc-300 truncate max-w-[200px]">{dropoffLocation}</span>
          </div>
        </div>
      </div>
    </GoogleMapsProvider>
  )
}
