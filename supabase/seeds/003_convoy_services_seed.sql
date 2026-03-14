-- ─── ConvoyLink — Seed Convoy Services ───────────────────────────────────────
-- Run this in Supabase SQL Editor AFTER running 001_initial_schema.sql
-- This creates a demo provider account and 6 sample Nigerian convoy services
-- so the marketplace is not empty on launch.
-- ─────────────────────────────────────────────────────────────────────────────

-- Step 1: Create demo provider in auth.users
insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token
) values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'demo-provider@convoylink.ng',
  crypt('ConvoyLink@2025!', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"ConvoyLink Featured","role":"provider"}',
  '', ''
) on conflict (id) do nothing;

-- Step 2: Ensure user_profiles row exists for demo provider
insert into public.user_profiles (id, email, full_name, role, is_verified)
values (
  '00000000-0000-0000-0000-000000000001',
  'demo-provider@convoylink.ng',
  'ConvoyLink Featured',
  'provider',
  true
) on conflict (id) do nothing;

-- Step 3: Insert 6 convoy services
insert into public.convoy_services (
  id, provider_id, title, description, service_type,
  price_per_km, base_price, max_distance_km,
  available_states, vehicle_count,
  is_active, rating, total_bookings
) values

-- 1. Armed Escort — Lagos
(
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000001',
  'Eagle Shield Armed Convoy',
  'Premium armed escort service for high-value cargo, executives, and VIPs across Lagos and South-West Nigeria. Our team comprises ex-military and DSS-trained personnel with armored vehicles.',
  'armed',
  850.00, 45000.00, 600,
  ARRAY['Lagos','Ogun','Oyo','Osun','Ekiti','Ondo'],
  4, true, 4.9, 87
),

-- 2. VIP Escort — Abuja
(
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000001',
  'Apex VIP Motorcade — Abuja',
  'Discreet VIP and diplomatic motorcade services in Abuja and North-Central Nigeria. Serving government officials, corporate executives, and high-net-worth individuals since 2015.',
  'vip',
  700.00, 55000.00, 800,
  ARRAY['Abuja','Nasarawa','Niger','Kogi','Benue'],
  5, true, 4.8, 124
),

-- 3. Corporate — Port Harcourt
(
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000001',
  'DeltaForce Corporate Escort — PH',
  'Reliable corporate and oil & gas convoy services across the Niger Delta region. Specialized in protecting oil workers, supply chain logistics, and corporate movements in challenging terrain.',
  'corporate',
  950.00, 60000.00, 500,
  ARRAY['Rivers','Bayelsa','Delta','Edo','Cross River','Akwa Ibom'],
  6, true, 4.7, 203
),

-- 4. Logistics — Kano
(
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000001',
  'NorthStar Logistics Convoy',
  'Specialized long-distance logistics and cargo escort across Northern Nigeria. We protect goods in transit on high-risk routes with GPS-tracked escort vehicles and 24/7 control room monitoring.',
  'logistics',
  600.00, 35000.00, 1200,
  ARRAY['Kano','Kaduna','Katsina','Zamfara','Sokoto','Kebbi','Niger','Abuja'],
  3, true, 4.6, 156
),

-- 5. Unarmed Escort — Lagos
(
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000001',
  'SafeRoute Unarmed Escort',
  'Affordable unarmed escort and route security for businesses, families, and goods across Lagos, Ogun, and Oyo states. Ideal for everyday business movements and inter-state travel.',
  'unarmed',
  400.00, 18000.00, 400,
  ARRAY['Lagos','Ogun','Oyo','Osun'],
  2, true, 4.5, 312
),

-- 6. Armed Escort — Enugu / South East
(
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000001',
  'SouthEast Sentinel Armed Escort',
  'Trusted armed escort and route security across South-East Nigeria. Licensed security operatives, real-time GPS tracking, and armored follow-up vehicles for maximum protection on all routes.',
  'armed',
  780.00, 42000.00, 550,
  ARRAY['Enugu','Anambra','Imo','Abia','Ebonyi'],
  3, true, 4.7, 98
);
