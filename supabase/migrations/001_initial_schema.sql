-- ============================================================
-- ConvoyLink — Full Database Schema
-- Migration: 001_initial_schema
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";  -- for geo queries (optional, skip if unavailable)

-- ============================================================
-- ENUMS
-- ============================================================

create type user_role as enum ('customer', 'provider', 'driver', 'admin');
create type driver_status as enum ('pending', 'verified', 'suspended');
create type vehicle_type as enum ('sedan', 'suv', 'bus', 'truck', 'armored', 'van');
create type vehicle_status as enum ('available', 'booked', 'maintenance', 'pending_verification');
create type convoy_service_type as enum ('armed', 'unarmed', 'corporate', 'vip', 'logistics');
create type booking_service_type as enum ('convoy', 'driver', 'vehicle');
create type booking_status as enum ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed');
create type payment_status as enum ('pending', 'held', 'released', 'refunded', 'failed');
create type trip_status as enum ('starting', 'moving', 'stopped', 'arrived', 'cancelled');
create type notification_type as enum (
  'booking_confirmed', 'booking_cancelled', 'trip_started', 'trip_arrived',
  'payment_held', 'payment_released', 'new_message', 'driver_verified'
);

-- ============================================================
-- USERS / PROFILES
-- ============================================================

create table public.user_profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  full_name    text not null,
  phone        text,
  avatar_url   text,
  role         user_role not null default 'customer',
  is_verified  boolean not null default false,
  location     text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Index
create index idx_user_profiles_role on public.user_profiles(role);
create index idx_user_profiles_email on public.user_profiles(email);

-- ============================================================
-- DRIVERS
-- ============================================================

create table public.drivers (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.user_profiles(id) on delete cascade,
  license_number    text not null unique,
  license_expiry    date not null,
  years_experience  int not null default 0,
  status            driver_status not null default 'pending',
  rating            numeric(3,2) not null default 0.00,
  total_trips       int not null default 0,
  bio               text,
  nin               text,                          -- National ID Number
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_drivers_user_id on public.drivers(user_id);
create index idx_drivers_status on public.drivers(status);

-- ============================================================
-- VEHICLES
-- ============================================================

create table public.vehicles (
  id           uuid primary key default uuid_generate_v4(),
  owner_id     uuid not null references public.user_profiles(id) on delete cascade,
  make         text not null,
  model        text not null,
  year         int not null,
  plate_number text not null unique,
  vehicle_type vehicle_type not null default 'sedan',
  capacity     int not null default 4,
  daily_rate   numeric(12,2) not null,
  images       text[] not null default '{}',
  status       vehicle_status not null default 'pending_verification',
  is_verified  boolean not null default false,
  features     text[] not null default '{}',
  description  text,
  state        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_vehicles_owner_id on public.vehicles(owner_id);
create index idx_vehicles_status on public.vehicles(status);
create index idx_vehicles_type on public.vehicles(vehicle_type);
create index idx_vehicles_state on public.vehicles(state);

-- ============================================================
-- CONVOY SERVICES
-- ============================================================

create table public.convoy_services (
  id                uuid primary key default uuid_generate_v4(),
  provider_id       uuid not null references public.user_profiles(id) on delete cascade,
  title             text not null,
  description       text not null,
  service_type      convoy_service_type not null default 'unarmed',
  price_per_km      numeric(10,2) not null,
  base_price        numeric(12,2) not null,
  max_distance_km   int not null default 500,
  available_states  text[] not null default '{}',
  vehicle_count     int not null default 1,
  images            text[] not null default '{}',
  is_active         boolean not null default true,
  rating            numeric(3,2) not null default 0.00,
  total_bookings    int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_convoy_services_provider on public.convoy_services(provider_id);
create index idx_convoy_services_type on public.convoy_services(service_type);
create index idx_convoy_services_active on public.convoy_services(is_active);

-- ============================================================
-- BOOKINGS
-- ============================================================

create table public.bookings (
  id                uuid primary key default uuid_generate_v4(),
  customer_id       uuid not null references public.user_profiles(id) on delete restrict,
  service_type      booking_service_type not null,
  service_id        uuid not null,                -- references convoy_services, vehicles, or drivers
  driver_id         uuid references public.drivers(id),
  status            booking_status not null default 'pending',
  pickup_location   text not null,
  pickup_lat        numeric(10,7),
  pickup_lng        numeric(10,7),
  dropoff_location  text not null,
  dropoff_lat       numeric(10,7),
  dropoff_lng       numeric(10,7),
  scheduled_at      timestamptz not null,
  total_amount      numeric(12,2) not null,
  platform_fee      numeric(12,2) not null,
  provider_amount   numeric(12,2) not null,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_bookings_customer on public.bookings(customer_id);
create index idx_bookings_service on public.bookings(service_id);
create index idx_bookings_driver on public.bookings(driver_id);
create index idx_bookings_status on public.bookings(status);
create index idx_bookings_scheduled on public.bookings(scheduled_at);

-- ============================================================
-- PAYMENTS
-- ============================================================

create table public.payments (
  id                          uuid primary key default uuid_generate_v4(),
  booking_id                  uuid not null unique references public.bookings(id) on delete cascade,
  customer_id                 uuid not null references public.user_profiles(id),
  provider_id                 uuid not null references public.user_profiles(id),
  amount                      numeric(12,2) not null,
  currency                    text not null default 'NGN',
  platform_fee                numeric(12,2) not null,
  provider_amount             numeric(12,2) not null,
  status                      payment_status not null default 'pending',
  stripe_payment_intent_id    text,
  stripe_session_id           text,
  stripe_transfer_id          text,
  paid_at                     timestamptz,
  released_at                 timestamptz,
  created_at                  timestamptz not null default now()
);

create index idx_payments_booking on public.payments(booking_id);
create index idx_payments_customer on public.payments(customer_id);
create index idx_payments_provider on public.payments(provider_id);
create index idx_payments_status on public.payments(status);

-- ============================================================
-- CONVOY TRIPS (Real-Time)
-- ============================================================

create table public.convoy_trips (
  id               uuid primary key default uuid_generate_v4(),
  booking_id       uuid not null unique references public.bookings(id) on delete cascade,
  driver_id        uuid not null references public.drivers(id),
  status           trip_status not null default 'starting',
  started_at       timestamptz,
  arrived_at       timestamptz,
  current_lat      numeric(10,7),
  current_lng      numeric(10,7),
  route_polyline   text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_convoy_trips_booking on public.convoy_trips(booking_id);
create index idx_convoy_trips_driver on public.convoy_trips(driver_id);
create index idx_convoy_trips_status on public.convoy_trips(status);

-- ============================================================
-- TRACKING LOCATIONS (GPS Stream)
-- ============================================================

create table public.tracking_locations (
  id           uuid primary key default uuid_generate_v4(),
  trip_id      uuid not null references public.convoy_trips(id) on delete cascade,
  driver_id    uuid not null references public.drivers(id),
  lat          numeric(10,7) not null,
  lng          numeric(10,7) not null,
  speed        numeric(6,2),
  heading      numeric(5,2),
  recorded_at  timestamptz not null default now()
);

create index idx_tracking_trip on public.tracking_locations(trip_id);
create index idx_tracking_driver on public.tracking_locations(driver_id);
create index idx_tracking_recorded on public.tracking_locations(recorded_at desc);

-- Partition hint: keep only last 30 days of raw tracking data
-- (implement via pg_cron or scheduled function in production)

-- ============================================================
-- REVIEWS
-- ============================================================

create table public.reviews (
  id           uuid primary key default uuid_generate_v4(),
  booking_id   uuid not null references public.bookings(id) on delete cascade,
  reviewer_id  uuid not null references public.user_profiles(id),
  reviewee_id  uuid not null references public.user_profiles(id),
  rating       int not null check (rating between 1 and 5),
  comment      text,
  created_at   timestamptz not null default now(),
  unique(booking_id, reviewer_id)
);

create index idx_reviews_reviewee on public.reviews(reviewee_id);
create index idx_reviews_booking on public.reviews(booking_id);

-- ============================================================
-- MESSAGES
-- ============================================================

create table public.messages (
  id          uuid primary key default uuid_generate_v4(),
  booking_id  uuid not null references public.bookings(id) on delete cascade,
  sender_id   uuid not null references public.user_profiles(id),
  content     text not null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index idx_messages_booking on public.messages(booking_id);
create index idx_messages_sender on public.messages(sender_id);
create index idx_messages_created on public.messages(created_at desc);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

create table public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.user_profiles(id) on delete cascade,
  type        notification_type not null,
  title       text not null,
  body        text not null,
  data        jsonb,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_unread on public.notifications(user_id, is_read) where is_read = false;

-- ============================================================
-- TRIGGERS: updated_at
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function update_updated_at();

create trigger trg_drivers_updated_at
  before update on public.drivers
  for each row execute function update_updated_at();

create trigger trg_vehicles_updated_at
  before update on public.vehicles
  for each row execute function update_updated_at();

create trigger trg_convoy_services_updated_at
  before update on public.convoy_services
  for each row execute function update_updated_at();

create trigger trg_bookings_updated_at
  before update on public.bookings
  for each row execute function update_updated_at();

create trigger trg_convoy_trips_updated_at
  before update on public.convoy_trips
  for each row execute function update_updated_at();

-- ============================================================
-- TRIGGER: auto-create user_profile on signup
-- ============================================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- TRIGGER: update convoy_services.total_bookings & rating
-- ============================================================

create or replace function update_service_stats()
returns trigger as $$
begin
  if new.status = 'completed' and old.status != 'completed' then
    -- update total_bookings for convoy_services
    if new.service_type = 'convoy' then
      update public.convoy_services
      set total_bookings = total_bookings + 1
      where id = new.service_id;
    end if;
    -- update driver total_trips
    if new.driver_id is not null then
      update public.drivers
      set total_trips = total_trips + 1
      where id = new.driver_id;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_booking_stats
  after update on public.bookings
  for each row execute function update_service_stats();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table public.user_profiles      enable row level security;
alter table public.drivers             enable row level security;
alter table public.vehicles            enable row level security;
alter table public.convoy_services     enable row level security;
alter table public.bookings            enable row level security;
alter table public.payments            enable row level security;
alter table public.convoy_trips        enable row level security;
alter table public.tracking_locations  enable row level security;
alter table public.reviews             enable row level security;
alter table public.messages            enable row level security;
alter table public.notifications       enable row level security;

-- Helper function to get current user's role
create or replace function get_my_role()
returns user_role as $$
  select role from public.user_profiles where id = auth.uid();
$$ language sql security definer stable;

-- ─── user_profiles ───────────────────────────────────────────
create policy "Public profiles viewable by all"
  on public.user_profiles for select using (true);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (id = auth.uid());

create policy "Admins can update any profile"
  on public.user_profiles for update
  using (get_my_role() = 'admin');

-- ─── drivers ─────────────────────────────────────────────────
create policy "Verified drivers viewable by all"
  on public.drivers for select using (true);

create policy "Users can create own driver profile"
  on public.drivers for insert
  with check (user_id = auth.uid());

create policy "Drivers can update own profile"
  on public.drivers for update
  using (user_id = auth.uid());

create policy "Admins can update any driver"
  on public.drivers for update
  using (get_my_role() = 'admin');

-- ─── vehicles ────────────────────────────────────────────────
create policy "Available verified vehicles viewable by all"
  on public.vehicles for select using (true);

create policy "Providers can create vehicles"
  on public.vehicles for insert
  with check (owner_id = auth.uid());

create policy "Owners can update own vehicles"
  on public.vehicles for update
  using (owner_id = auth.uid());

create policy "Admins can update any vehicle"
  on public.vehicles for update
  using (get_my_role() = 'admin');

-- ─── convoy_services ─────────────────────────────────────────
create policy "Active convoy services viewable by all"
  on public.convoy_services for select using (true);

create policy "Providers can create convoy services"
  on public.convoy_services for insert
  with check (provider_id = auth.uid());

create policy "Providers can update own services"
  on public.convoy_services for update
  using (provider_id = auth.uid());

create policy "Admins can manage all services"
  on public.convoy_services for all
  using (get_my_role() = 'admin');

-- ─── bookings ────────────────────────────────────────────────
create policy "Customers see own bookings"
  on public.bookings for select
  using (
    customer_id = auth.uid()
    or service_id in (
      select id from public.convoy_services where provider_id = auth.uid()
      union
      select id from public.vehicles where owner_id = auth.uid()
    )
    or driver_id in (select id from public.drivers where user_id = auth.uid())
    or get_my_role() = 'admin'
  );

create policy "Customers can create bookings"
  on public.bookings for insert
  with check (customer_id = auth.uid());

create policy "Booking parties can update status"
  on public.bookings for update
  using (
    customer_id = auth.uid()
    or service_id in (
      select id from public.convoy_services where provider_id = auth.uid()
      union
      select id from public.vehicles where owner_id = auth.uid()
    )
    or driver_id in (select id from public.drivers where user_id = auth.uid())
    or get_my_role() = 'admin'
  );

-- ─── payments ────────────────────────────────────────────────
create policy "Parties can view own payments"
  on public.payments for select
  using (
    customer_id = auth.uid()
    or provider_id = auth.uid()
    or get_my_role() = 'admin'
  );

-- ─── convoy_trips ─────────────────────────────────────────────
create policy "Trip parties can view trip"
  on public.convoy_trips for select
  using (
    driver_id in (select id from public.drivers where user_id = auth.uid())
    or booking_id in (select id from public.bookings where customer_id = auth.uid())
    or get_my_role() = 'admin'
  );

create policy "Drivers can update own trips"
  on public.convoy_trips for update
  using (driver_id in (select id from public.drivers where user_id = auth.uid()));

create policy "Admins can create trips"
  on public.convoy_trips for insert
  with check (get_my_role() = 'admin' or driver_id in (select id from public.drivers where user_id = auth.uid()));

-- ─── tracking_locations ──────────────────────────────────────
create policy "Trip parties can view locations"
  on public.tracking_locations for select
  using (
    driver_id in (select id from public.drivers where user_id = auth.uid())
    or trip_id in (
      select ct.id from public.convoy_trips ct
      join public.bookings b on b.id = ct.booking_id
      where b.customer_id = auth.uid()
    )
    or get_my_role() = 'admin'
  );

create policy "Drivers can insert own locations"
  on public.tracking_locations for insert
  with check (driver_id in (select id from public.drivers where user_id = auth.uid()));

-- ─── reviews ─────────────────────────────────────────────────
create policy "Reviews viewable by all"
  on public.reviews for select using (true);

create policy "Reviewers can create reviews"
  on public.reviews for insert
  with check (reviewer_id = auth.uid());

-- ─── messages ────────────────────────────────────────────────
create policy "Booking parties can view messages"
  on public.messages for select
  using (
    sender_id = auth.uid()
    or booking_id in (
      select id from public.bookings
      where customer_id = auth.uid()
      or service_id in (
        select id from public.convoy_services where provider_id = auth.uid()
        union
        select id from public.vehicles where owner_id = auth.uid()
      )
    )
  );

create policy "Booking parties can send messages"
  on public.messages for insert
  with check (sender_id = auth.uid());

-- ─── notifications ───────────────────────────────────────────
create policy "Users see own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "Users can mark own notifications read"
  on public.notifications for update
  using (user_id = auth.uid());

-- ============================================================
-- REALTIME: enable for live tracking + messages + notifications
-- ============================================================

alter publication supabase_realtime add table public.convoy_trips;
alter publication supabase_realtime add table public.tracking_locations;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;

-- ============================================================
-- STORAGE BUCKETS (run these via Supabase dashboard or API)
-- ============================================================
-- bucket: avatars        (public)
-- bucket: vehicles       (public)
-- bucket: convoy-docs    (private)
-- bucket: driver-docs    (private)
