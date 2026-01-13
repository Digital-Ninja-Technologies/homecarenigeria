-- Fix: Remove overly permissive profiles SELECT policy
-- The policy "Users can view all profiles with limited fields" allows any authenticated user to see all profiles

-- Drop the permissive policies
DROP POLICY IF EXISTS "Users can view all profiles with limited fields" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile only" ON public.profiles;

-- Create a single, secure SELECT policy - users can ONLY see their own profile
CREATE POLICY "Users can view their own profile only"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Also add DELETE policy for notifications (info-level finding)
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
USING (auth.uid() = user_id);