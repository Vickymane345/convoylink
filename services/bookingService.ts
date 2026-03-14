import type { BookingServiceType, BookingStatus } from '@/types'

export interface CreateBookingInput {
  customer_id: string
  service_type: BookingServiceType
  service_id: string
  driver_id?: string
  pickup_location: string
  pickup_lat?: number
  pickup_lng?: number
  dropoff_location: string
  dropoff_lat?: number
  dropoff_lng?: number
  scheduled_at: string
  total_amount: number
  platform_fee: number
  provider_amount: number
  provider_id: string
  notes?: string
}

export interface BookingPriceBreakdown {
  base_price: number
  distance_cost: number
  subtotal: number
  platform_fee: number
  total: number
  provider_amount: number
}

export function calculateBookingPrice(
  basePrice: number,
  pricePerKm: number,
  estimatedKm: number,
  platformFeePercent = 10,
): BookingPriceBreakdown {
  const base_price = basePrice
  const distance_cost = Math.round(pricePerKm * estimatedKm)
  const subtotal = base_price + distance_cost
  const platform_fee = Math.round((subtotal * platformFeePercent) / 100)
  const total = subtotal + platform_fee
  const provider_amount = subtotal

  return { base_price, distance_cost, subtotal, platform_fee, total, provider_amount }
}

export function calculateVehicleBookingPrice(
  dailyRate: number,
  days: number,
  platformFeePercent = 10,
): BookingPriceBreakdown {
  const base_price = dailyRate * days
  const distance_cost = 0
  const subtotal = base_price
  const platform_fee = Math.round((subtotal * platformFeePercent) / 100)
  const total = subtotal + platform_fee
  const provider_amount = subtotal

  return { base_price, distance_cost, subtotal, platform_fee, total, provider_amount }
}

export function calculateDriverBookingPrice(
  dailyRate: number,
  days: number,
  platformFeePercent = 10,
): BookingPriceBreakdown {
  return calculateVehicleBookingPrice(dailyRate, days, platformFeePercent)
}

export const bookingStatusConfig: Record<
  BookingStatus,
  { label: string; color: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' }
> = {
  pending: { label: 'Pending', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'info' },
  in_progress: { label: 'In Progress', color: 'default' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'danger' },
  disputed: { label: 'Disputed', color: 'danger' },
}
