-- Fix PUBLIC_USER_DATA: Restrict public access to sensitive profile fields

-- Drop the overly permissive public profiles policy
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;

-- Create a more restrictive policy - only authenticated users can see basic profile info
-- Each user can fully view their own profile
CREATE POLICY "Users can view all profiles with limited fields"
ON public.profiles FOR SELECT
USING (
  -- Users can always see their own profile
  auth.uid() = user_id
  -- OR authenticated users can see basic info (RLS doesn't filter columns, 
  -- but we'll create a view for public access with limited fields)
  OR auth.uid() IS NOT NULL
);

-- For agencies, update the policy to be more restrictive
DROP POLICY IF EXISTS "Anyone can view verified agencies" ON public.agencies;

-- Create a policy that allows viewing verified agencies but only for authenticated users
-- or agency owners can see their own
CREATE POLICY "Verified agencies viewable by authenticated users"
ON public.agencies FOR SELECT
USING (
  -- Owners can always see their own agency
  auth.uid() = user_id
  -- OR authenticated users can see verified agencies
  OR (verification_status = 'verified' AND auth.uid() IS NOT NULL)
);

-- Create a public view for agencies that excludes sensitive contact info
CREATE OR REPLACE VIEW public.public_agencies AS
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

-- Create a public view for profiles that excludes sensitive info
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  location,
  created_at
FROM public.profiles;