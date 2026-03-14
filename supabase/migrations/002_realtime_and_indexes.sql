-- ─── Realtime Publications ────────────────────────────────────────────────────
-- Run this after the initial schema migration.
-- Enable Realtime on tables that need live subscriptions.

-- Messages realtime (booking-scoped chat)
alter publication supabase_realtime add table messages;

-- Tracking locations realtime (live convoy map)
alter publication supabase_realtime add table tracking_locations;

-- Convoy trips realtime (status changes)
alter publication supabase_realtime add table convoy_trips;

-- Notifications realtime (bell icon updates)
alter publication supabase_realtime add table notifications;


-- ─── Performance Indexes ──────────────────────────────────────────────────────

-- Booking lookups by customer / provider / driver
create index if not exists idx_bookings_customer_id  on bookings(customer_id);
create index if not exists idx_bookings_provider_id  on bookings(provider_id);
create index if not exists idx_bookings_driver_id    on bookings(driver_id);
create index if not exists idx_bookings_status       on bookings(status);

-- Payment lookups
create index if not exists idx_payments_booking_id   on payments(booking_id);
create index if not exists idx_payments_provider_id  on payments(provider_id);
create index if not exists idx_payments_status       on payments(status);

-- Messages by booking (for thread fetch)
create index if not exists idx_messages_booking_id   on messages(booking_id);
create index if not exists idx_messages_created_at   on messages(created_at);

-- Tracking locations by trip (time-ordered)
create index if not exists idx_tracking_trip_time    on tracking_locations(trip_id, recorded_at desc);

-- Convoy trips by driver / booking
create index if not exists idx_convoy_trips_driver   on convoy_trips(driver_id);
create index if not exists idx_convoy_trips_booking  on convoy_trips(booking_id);
create index if not exists idx_convoy_trips_status   on convoy_trips(status);

-- Notifications by user (unread badge count)
create index if not exists idx_notifications_user    on notifications(user_id, is_read);

-- Driver verification queue
create index if not exists idx_drivers_verification  on drivers(verification_status);
