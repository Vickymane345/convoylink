'use client'

import { useEffect, useRef, useState } from 'react'

interface Options {
  tripId: string
  onError?: (err: string) => void
}

/**
 * Broadcasts the driver's GPS position to /api/tracking every N seconds.
 * Uses navigator.geolocation.watchPosition for continuous updates.
 */
export function useDriverLocation({ tripId, onError }: Options) {
  const [isTracking, setIsTracking] = useState(false)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const lastSentRef = useRef<number>(0)
  const THROTTLE_MS = 5000 // send at most every 5 seconds

  const start = () => {
    if (!navigator.geolocation) {
      onError?.('Geolocation is not supported by your browser.')
      return
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const now = Date.now()
        if (now - lastSentRef.current < THROTTLE_MS) return
        lastSentRef.current = now

        setAccuracy(Math.round(position.coords.accuracy))
        setIsTracking(true)

        try {
          await fetch('/api/tracking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              trip_id: tripId,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              heading: position.coords.heading,
              speed: position.coords.speed,
              accuracy: position.coords.accuracy,
            }),
          })
        } catch {
          // silent — will retry on next position update
        }
      },
      (err) => {
        setIsTracking(false)
        onError?.(err.message)
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )
  }

  const stop = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsTracking(false)
  }

  useEffect(() => {
    return () => stop()
  }, [])

  return { start, stop, isTracking, accuracy }
}
