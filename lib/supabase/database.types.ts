export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          role: 'customer' | 'provider' | 'driver' | 'admin'
          is_verified: boolean
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>
      }
      drivers: {
        Row: {
          id: string
          user_id: string
          license_number: string
          license_expiry: string
          years_experience: number
          status: 'pending' | 'verified' | 'suspended'
          rating: number
          total_trips: number
          bio: string | null
          nin: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['drivers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['drivers']['Insert']>
      }
      vehicles: {
        Row: {
          id: string
          owner_id: string
          make: string
          model: string
          year: number
          plate_number: string
          vehicle_type: 'sedan' | 'suv' | 'bus' | 'truck' | 'armored' | 'van'
          capacity: number
          daily_rate: number
          images: string[]
          status: 'available' | 'booked' | 'maintenance' | 'pending_verification'
          is_verified: boolean
          features: string[]
          description: string | null
          state: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['vehicles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['vehicles']['Insert']>
      }
      convoy_services: {
        Row: {
          id: string
          provider_id: string
          title: string
          description: string
          service_type: 'armed' | 'unarmed' | 'corporate' | 'vip' | 'logistics'
          price_per_km: number
          base_price: number
          max_distance_km: number
          available_states: string[]
          vehicle_count: number
          images: string[]
          is_active: boolean
          rating: number
          total_bookings: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['convoy_services']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['convoy_services']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          customer_id: string
          service_type: 'convoy' | 'driver' | 'vehicle'
          service_id: string
          driver_id: string | null
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
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
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          customer_id: string
          provider_id: string
          amount: number
          currency: string
          platform_fee: number
          provider_amount: number
          status: 'pending' | 'held' | 'released' | 'refunded' | 'failed'
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          stripe_transfer_id: string | null
          paid_at: string | null
          released_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
      convoy_trips: {
        Row: {
          id: string
          booking_id: string
          driver_id: string
          status: 'starting' | 'moving' | 'stopped' | 'arrived' | 'cancelled'
          started_at: string | null
          arrived_at: string | null
          current_lat: number | null
          current_lng: number | null
          route_polyline: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['convoy_trips']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['convoy_trips']['Insert']>
      }
      tracking_locations: {
        Row: {
          id: string
          trip_id: string
          driver_id: string
          lat: number
          lng: number
          speed: number | null
          heading: number | null
          recorded_at: string
        }
        Insert: Omit<Database['public']['Tables']['tracking_locations']['Row'], 'id' | 'recorded_at'>
        Update: Partial<Database['public']['Tables']['tracking_locations']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      messages: {
        Row: {
          id: string
          booking_id: string
          sender_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string
          data: Json | null
          is_read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
    }
  }
}
