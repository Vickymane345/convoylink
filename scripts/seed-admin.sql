-- ─── Promote a user to admin ──────────────────────────────────────────────────
-- Run this in Supabase SQL Editor after creating your first user account.
-- Replace the email below with your admin account email.

update user_profiles
set role = 'admin', is_verified = true
where email = 'your-admin@email.com';

-- Verify it worked:
select id, full_name, email, role, is_verified
from user_profiles
where role = 'admin';
