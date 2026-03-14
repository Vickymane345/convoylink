-- ============================================================
-- ConvoyLink — Schema Fixes Migration 004
-- Run in Supabase SQL Editor
-- ============================================================

-- ─── 1. Fix handle_new_user trigger (search_path + safe role cast) ───
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _role text;
begin
  _role := coalesce(new.raw_user_meta_data->>'role', 'customer');
  if _role not in ('customer', 'provider', 'driver', 'admin') then
    _role := 'customer';
  end if;
  insert into public.user_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), split_part(new.email, '@', 1)),
    _role::user_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ─── 2. tracking_locations: add latitude/longitude/accuracy columns ───
-- The API inserts latitude/longitude/accuracy but schema had lat/lng
alter table public.tracking_locations
  add column if not exists latitude  numeric(10,7),
  add column if not exists longitude numeric(10,7),
  add column if not exists accuracy  numeric(8,2);

-- Copy existing lat/lng into new columns
update public.tracking_locations
  set latitude = lat, longitude = lng
  where latitude is null and lat is not null;

-- Create indexes on new columns
create index if not exists idx_tracking_lat_lng on public.tracking_locations(latitude, longitude);


-- ─── 3. drivers: add verification_status text column ───
-- Code uses verification_status with values: pending/approved/rejected/suspended
-- Schema had status enum: pending/verified/suspended
alter table public.drivers
  add column if not exists verification_status text not null default 'pending';

-- Sync from existing status column
update public.drivers set verification_status = 'approved' where status = 'verified';
update public.drivers set verification_status = 'suspended' where status = 'suspended';
update public.drivers set verification_status = 'pending' where status = 'pending';

create index if not exists idx_drivers_verification_status on public.drivers(verification_status);


-- ─── 4. vehicles: add is_available boolean column ───
alter table public.vehicles
  add column if not exists is_available boolean not null default true;

-- Sync from status column
update public.vehicles set is_available = true  where status = 'available';
update public.vehicles set is_available = false where status in ('booked', 'maintenance', 'pending_verification');

create index if not exists idx_vehicles_is_available on public.vehicles(is_available);


-- ─── 5. convoy_trips: add missing status values to enum ───
-- Code uses: pending, en_route, in_progress, completed, cancelled
-- Schema had: starting, moving, stopped, arrived, cancelled
do $$
begin
  alter type trip_status add value if not exists 'pending';
  alter type trip_status add value if not exists 'en_route';
  alter type trip_status add value if not exists 'in_progress';
  alter type trip_status add value if not exists 'completed';
exception when others then
  null; -- ignore if already exists
end;
$$;

-- Update default to 'pending'
alter table public.convoy_trips alter column status set default 'pending';


-- ─── 6. bookings: add provider_id column ───
-- Booking wizard sends provider_id, useful for direct queries
alter table public.bookings
  add column if not exists provider_id uuid references public.user_profiles(id);

create index if not exists idx_bookings_provider on public.bookings(provider_id);


-- ─── 7. payments: add insert policy for service role / API ───
-- Payments are inserted by the API via admin client (bypasses RLS)
-- but add policy for completeness
drop policy if exists "Service can insert payments" on public.payments;
create policy "Service can insert payments"
  on public.payments for insert
  with check (customer_id = auth.uid() or get_my_role() = 'admin');


-- ─── 8. notifications: add insert policy ───
drop policy if exists "System can insert notifications" on public.notifications;
create policy "System can insert notifications"
  on public.notifications for insert
  with check (true);  -- API uses admin client; this covers edge cases


-- ─── 9. Ensure Realtime is enabled for key tables ───
do $$
begin
  alter publication supabase_realtime add table public.convoy_trips;
exception when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.tracking_locations;
exception when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null;
end;
$$;


-- ─── 10. Re-confirm admin role for owner ───
update public.user_profiles
  set role = 'admin'
  where email = 'udechukwu1406@student.babcock.edu.ng';
