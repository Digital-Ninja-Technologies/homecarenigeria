-- Fix: Notification spam vulnerability - restrict INSERT to legitimate business contexts
-- Replace overly permissive INSERT policy with secure function-based approach

-- Drop the permissive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;

-- Create a SECURITY DEFINER function that validates notification creation
-- Only allows notifications between booking participants
CREATE OR REPLACE FUNCTION public.create_booking_notification(
  _target_user_id UUID,
  _title TEXT,
  _message TEXT,
  _type TEXT DEFAULT 'info'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _notification_id UUID;
  _has_relationship BOOLEAN;
BEGIN
  -- Validate that the caller has a business relationship with the target user
  -- (they share a booking as client-worker pair)
  SELECT EXISTS (
    SELECT 1 FROM bookings b
    JOIN workers w ON w.id = b.worker_id
    WHERE 
      -- Caller is client, target is worker
      (b.client_id = auth.uid() AND w.user_id = _target_user_id)
      OR
      -- Caller is worker, target is client
      (w.user_id = auth.uid() AND b.client_id = _target_user_id)
  ) INTO _has_relationship;
  
  IF NOT _has_relationship THEN
    RAISE EXCEPTION 'Not authorized to send notifications to this user';
  END IF;
  
  -- Insert the notification
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (_target_user_id, _title, _message, _type)
  RETURNING id INTO _notification_id;
  
  RETURN _notification_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_booking_notification TO authenticated;