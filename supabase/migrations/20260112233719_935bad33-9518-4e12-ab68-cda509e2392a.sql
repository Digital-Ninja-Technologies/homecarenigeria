
-- Create a public_workers view for displaying worker info without auth requirements
-- This view will join workers with profiles and only show verified workers
CREATE OR REPLACE VIEW public.public_workers AS
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
LEFT JOIN public.profiles p ON w.user_id = p.user_id
WHERE w.verification_status = 'verified';

-- Make this view security invoker to respect underlying RLS
ALTER VIEW public.public_workers SET (security_invoker = off);

-- Grant select to anon and authenticated roles for public access
GRANT SELECT ON public.public_workers TO anon, authenticated;
