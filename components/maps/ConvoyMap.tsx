'use client'

import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps'
import { motion } from 'framer-motion'

export type MapMarker = {
  id: string
  lat: number
  lng: number
  label?: string
  type: 'driver' | 'pickup' | 'dropoff' | 'vehicle'
}

interface Props {
  markers: MapMarker[]
  center?: { lat: number; lng: number }
  zoom?: number
  className?: string
}

const MARKER_COLORS = {
  driver:  { background: '#f97316', glyphColor: '#fff', borderColor: '#ea580c' },
  pickup:  { background: '#22c55e', glyphColor: '#fff', borderColor: '#16a34a' },
  dropoff: { background: '#ef4444', glyphColor: '#fff', borderColor: '#dc2626' },
  vehicle: { background: '#3b82f6', glyphColor: '#fff', borderColor: '#2563eb' },
}

export function ConvoyMap({ markers, center, zoom = 13, className = '' }: Props) {
  const defaultCenter = center ?? (
    markers.length > 0
      ? { lat: markers[0].lat, lng: markers[0].lng }
      : { lat: 6.5244, lng: 3.3792 } // Lagos default
  )

  return (
    <div className={`rounded-2xl overflow-hidden border border-zinc-800 ${className}`}>
      <Map
        defaultCenter={defaultCenter}
        center={center}
        defaultZoom={zoom}
        mapId="convoylink-map"
        style={{ width: '100%', height: '100%' }}
        gestureHandling="greedy"
        disableDefaultUI={false}
        colorScheme="DARK"
      >
        {markers.map((marker) => {
          const colors = MARKER_COLORS[marker.type]
          return (
            <AdvancedMarker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.label}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Pin
                  background={colors.background}
                  glyphColor={colors.glyphColor}
                  borderColor={colors.borderColor}
                />
              </motion.div>
            </AdvancedMarker>
          )
        })}
      </Map>
    </div>
  )
}
