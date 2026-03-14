// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'provider' | 'driver' | 'admin'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  is_verified: boolean
  location: string | null
  created_at: string
  updated_at: string
}

// ─── Driver ─────────────────────────────────────────────────────────────────

export type DriverStatus = 'pending' | 'verified' | 'suspended'

export interface Driver {
  id: string
  user_id: string
  license_number: string
  license_expiry: string
  years_experience: number
  status: DriverStatus
  rating: number
  total_trips: number
  bio: string | null
  profile?: UserProfile
  created_at: string
}

// ─── Vehicle ─────────────────────────────────────────────────────────────────

export type VehicleType = 'sedan' | 'suv' | 'bus' | 'truck' | 'armored' | 'van'
export type VehicleStatus = 'available' | 'booked' | 'maintenance' | 'pending_verification'

export interface Vehicle {
  id: string
  owner_id: string
  make: string
  model: string
  year: number
  plate_number: string
  vehicle_type: VehicleType
  capacity: number
  daily_rate: number
  images: string[]
  status: VehicleStatus
  is_verified: boolean
  features: string[]
  description: string | null
  state: string | null
  owner?: UserProfile
  created_at: string
}

// ─── Convoy Service ──────────────────────────────────────────────────────────

export type ConvoyServiceType = 'armed' | 'unarmed' | 'corporate' | 'vip' | 'logistics'

export interface ConvoyService {
  id: string
  provider_id: string
  title: string
  description: string
  service_type: ConvoyServiceType
  price_per_km: number
  base_price: number
  max_distance_km: number
  available_states: string[]
  vehicle_count: number
  images: string[]
  is_active: boolean
  rating: number
  total_bookings: number
  provider?: UserProfile
  created_at: string
}

// ─── Booking ─────────────────────────────────────────────────────────────────

export type BookingServiceType = 'convoy' | 'driver' | 'vehicle'
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed'

export interface Booking {
  id: string
  customer_id: string
  service_type: BookingServiceType
  service_id: string
  driver_id: string | null
  status: BookingStatus
  pickup_location: string
  pickup_lat: number | null
  pickup_lng: number | null
  dropoff_location: string
  dropoff_lat: number | null
  dropoff_lng: number | null
  scheduled_at: string
  total_amount: number
  platform_fee: number
  provider_amount: number
  notes: string | null
  customer?: UserProfile
  payment?: Payment
  trip?: ConvoyTrip | null
  created_at: string
  updated_at: string
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export type PaymentStatus = 'pending' | 'held' | 'released' | 'refunded' | 'failed'

export interface Payment {
  id: string
  booking_id: string
  customer_id: string
  provider_id: string
  amount: number
  currency: string
  platform_fee: number
  provider_amount: number
  status: PaymentStatus
  stripe_payment_intent_id: string | null
  stripe_session_id: string | null
  stripe_transfer_id: string | null
  paid_at: string | null
  released_at: string | null
  created_at: string
}

// ─── Convoy Trip (Real-Time) ──────────────────────────────────────────────────

export type TripStatus = 'starting' | 'moving' | 'stopped' | 'arrived' | 'cancelled'

export interface ConvoyTrip {
  id: string
  booking_id: string
  driver_id: string
  status: TripStatus
  started_at: string | null
  arrived_at: string | null
  current_lat: number | null
  current_lng: number | null
  route_polyline: string | null
  driver?: UserProfile
  created_at: string
  updated_at: string
}

// ─── Tracking Location ────────────────────────────────────────────────────────

export interface TrackingLocation {
  id: string
  trip_id: string
  driver_id: string
  latitude: number
  longitude: number
  speed: number | null
  heading: number | null
  accuracy: number | null
  recorded_at: string
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  booking_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  reviewer?: UserProfile
  created_at: string
}

// ─── Message ─────────────────────────────────────────────────────────────────

export interface Message {
  id: string
  booking_id: string
  sender_id: string
  content: string
  is_read: boolean
  sender?: UserProfile
  created_at: string
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'trip_started'
  | 'trip_arrived'
  | 'payment_held'
  | 'payment_released'
  | 'new_message'
  | 'driver_verified'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  data: Record<string, unknown> | null
  is_read: boolean
  created_at: string
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface ConvoyFilters {
  service_type?: ConvoyServiceType
  state?: string
  min_price?: number
  max_price?: number
  sort_by?: 'price_asc' | 'price_desc' | 'rating' | 'bookings'
}

export interface VehicleFilters {
  vehicle_type?: VehicleType
  min_rate?: number
  max_rate?: number
  capacity?: number
  sort_by?: 'price_asc' | 'price_desc' | 'rating'
}

export interface DriverFilters {
  min_experience?: number
  min_rating?: number
  sort_by?: 'rating' | 'experience' | 'trips'
}
