
-- Drop and recreate the public_workers view with security invoker
DROP VIEW IF EXISTS public.public_workers;

CREATE VIEW public.public_workers 
WITH (security_invoker = on)
AS
SELECT 
  w.id,
  w.user_id,
  w.services,
  w.hourly_rate,
  w.daily_rate,
  w.monthly_rate,
  w.experience_years,
  w.rating,
  w.total_jobs,
  w.verification_status,
  w.working_areas,
  w.languages,
  w.bio,
  w.agency_id,
  w.is_featured,
  w.nimc_verified,
  w.police_verified,
  p.full_name,
  p.avatar_url,
  p.location
FROM public.workers w
LEFT JOIN public.public_profiles p ON w.user_id = p.user_id
WHERE w.verification_status = 'verified';

-- Grant select to anon and authenticated roles
GRANT SELECT ON public.public_workers TO anon, authenticated;
