import { create } from 'zustand'
import type { ConvoyTrip, TrackingLocation } from '@/types'

interface TrackingState {
  activeTrip: ConvoyTrip | null
  locationHistory: TrackingLocation[]
  isTracking: boolean
  setActiveTrip: (trip: ConvoyTrip | null) => void
  addLocation: (location: TrackingLocation) => void
  clearTracking: () => void
  setTracking: (tracking: boolean) => void
}

export const useTrackingStore = create<TrackingState>((set) => ({
  activeTrip: null,
  locationHistory: [],
  isTracking: false,
  setActiveTrip: (trip) => set({ activeTrip: trip }),
  addLocation: (location) =>
    set((state) => ({
      locationHistory: [...state.locationHistory.slice(-99), location], // keep last 100 points
    })),
  clearTracking: () => set({ activeTrip: null, locationHistory: [], isTracking: false }),
  setTracking: (isTracking) => set({ isTracking }),
}))
