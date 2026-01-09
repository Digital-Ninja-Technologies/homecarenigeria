-- Fix SECURITY DEFINER view warnings by recreating views with SECURITY INVOKER

-- Drop and recreate views with SECURITY INVOKER
DROP VIEW IF EXISTS public.public_agencies;
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate public agencies view with SECURITY INVOKER
CREATE VIEW public.public_agencies 
WITH (security_invoker = true) AS
SELECT 
  id,
  name,
  description,
  logo_url,
  verification_status,
  is_featured,
  created_at
FROM public.agencies
WHERE verification_status = 'verified';

-- Recreate public profiles view with SECURITY INVOKER
CREATE VIEW public.public_profiles 
WITH (security_invoker = true) AS
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  location,
  created_at
FROM public.profiles;

-- Grant SELECT on views to authenticated and anon roles
GRANT SELECT ON public.public_agencies TO authenticated, anon;
GRANT SELECT ON public.public_profiles TO authenticated, anon;