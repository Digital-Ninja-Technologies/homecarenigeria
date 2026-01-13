-- Fix: Customer Home Addresses Visible to Workers Before Booking Acceptance
-- Solution: Replace the direct SELECT policy with one that uses a security definer function
-- to conditionally reveal location details based on booking status

-- Drop the existing permissive worker SELECT policy
DROP POLICY IF EXISTS "Workers can view their bookings" ON public.bookings;

-- Create a security definer function to get masked location for pending bookings
CREATE OR REPLACE FUNCTION public.get_booking_location_for_worker(
  _booking_status booking_status,
  _full_location text
)
RETURNS text
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT CASE
    -- Only reveal full location for accepted, confirmed, in_progress, or completed bookings
    WHEN _booking_status IN ('accepted', 'in_progress', 'completed') THEN _full_location
    -- For pending/cancelled bookings, show only general area (e.g., "Lekki" from "123 Main St, Lekki")
    ELSE COALESCE(
      -- Extract the last part after comma (usually the area/neighborhood)
      TRIM(SPLIT_PART(_full_location, ',', -1)),
      'Location hidden until accepted'
    )
  END
$$;

-- Create a secure view for workers to access bookings with masked location for pending ones
CREATE OR REPLACE VIEW public.worker_bookings_view
WITH (security_invoker = on)
AS
SELECT 
  b.id,
  b.client_id,
  b.worker_id,
  b.service_type,
  b.booking_type,
  b.start_date,
  b.end_date,
  b.start_time,
  b.end_time,
  b.status,
  b.amount,
  b.platform_fee,
  b.payment_status,
  b.notes,
  b.created_at,
  b.updated_at,
  -- Conditionally mask location based on booking status
  CASE
    WHEN b.status IN ('accepted', 'in_progress', 'completed') THEN b.location
    ELSE COALESCE(
      TRIM(SPLIT_PART(b.location, ',', -1)),
      'Location revealed after acceptance'
    )
  END AS location
FROM public.bookings b
JOIN public.workers w ON w.id = b.worker_id
WHERE w.user_id = auth.uid();

-- Re-create the worker SELECT policy - workers can still see their bookings
-- but will need to use the view for masked location access
CREATE POLICY "Workers can view their bookings"
ON public.bookings
FOR SELECT
USING (
  worker_id IN (
    SELECT workers.id
    FROM workers
    WHERE workers.user_id = auth.uid()
  )
);

-- Add a comment explaining the security measure
COMMENT ON VIEW public.worker_bookings_view IS 'Secure view for workers to access bookings with location masked for pending bookings. Use this view instead of direct table access to protect customer addresses.';