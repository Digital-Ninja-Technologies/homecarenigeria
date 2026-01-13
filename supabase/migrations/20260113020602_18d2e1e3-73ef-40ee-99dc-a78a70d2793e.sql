-- Fix: All User Contact Information Exposed to Any Logged-In User
-- Must DROP and recreate views to change column structure

-- Drop views in correct order (dependent view first)
DROP VIEW IF EXISTS public.public_workers CASCADE;
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- Recreate public_profiles view with ONLY non-sensitive fields
CREATE VIEW public.public_profiles
WITH (security_invoker = on)
AS
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  location,
  created_at
  -- Deliberately EXCLUDES: email, phone (sensitive PII)
FROM public.profiles;

-- Recreate public_workers view with correct column order matching the types file
CREATE VIEW public.public_workers
WITH (security_invoker = on)
AS
SELECT 
  w.hourly_rate,
  w.services,
  w.user_id,
  w.id,
  w.police_verified,
  w.is_featured,
  w.agency_id,
  w.verification_status,
  w.total_jobs,
  w.rating,
  pp.location,
  w.bio,
  w.nimc_verified,
  w.languages,
  w.experience_years,
  w.monthly_rate,
  w.daily_rate,
  pp.full_name,
  pp.avatar_url,
  w.working_areas
FROM public.workers w
LEFT JOIN public.public_profiles pp ON pp.user_id = w.user_id
WHERE w.verification_status = 'verified';

-- Add comments explaining the security measures
COMMENT ON VIEW public.public_profiles IS 'Public view of profiles that excludes sensitive PII (email, phone). Use this view for displaying user information to other users.';
COMMENT ON VIEW public.public_workers IS 'Public view of verified workers with non-sensitive profile data for marketplace display.';

-- Fix the notifications INSERT policy gap
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;
CREATE POLICY "Authenticated users can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);