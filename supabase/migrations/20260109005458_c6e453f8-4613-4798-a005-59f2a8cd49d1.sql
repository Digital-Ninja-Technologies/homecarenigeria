-- Fix: Add caller authorization to credit_worker_wallet function
-- Only the client who made the booking can release payment to the worker

CREATE OR REPLACE FUNCTION public.credit_worker_wallet(_booking_id uuid, _amount integer)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _worker_user_id UUID;
  _client_id UUID;
  _platform_fee INTEGER;
  _net_amount INTEGER;
  _booking_status booking_status;
  _payment_status TEXT;
BEGIN
  -- Get worker and validate booking
  SELECT w.user_id, b.client_id, b.platform_fee, b.status, b.payment_status
  INTO _worker_user_id, _client_id, _platform_fee, _booking_status, _payment_status
  FROM bookings b
  JOIN workers w ON w.id = b.worker_id
  WHERE b.id = _booking_id;
  
  IF _worker_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid booking';
  END IF;
  
  -- CRITICAL: Authorization check - only the booking client can release payment
  IF auth.uid() != _client_id THEN
    RAISE EXCEPTION 'Only the booking client can release payment';
  END IF;
  
  IF _booking_status != 'completed' THEN
    RAISE EXCEPTION 'Booking must be completed before payment';
  END IF;
  
  IF _payment_status = 'released' THEN
    RAISE EXCEPTION 'Payment already released';
  END IF;
  
  _net_amount := _amount - COALESCE(_platform_fee, 0);
  
  -- Update wallet
  UPDATE wallets
  SET 
    balance = balance + _net_amount,
    total_earned = total_earned + _net_amount,
    updated_at = now()
  WHERE user_id = _worker_user_id;
  
  -- Update booking payment status
  UPDATE bookings
  SET payment_status = 'released', updated_at = now()
  WHERE id = _booking_id;
  
  -- Create transaction record
  INSERT INTO transactions (user_id, booking_id, type, amount, status, description)
  VALUES (_worker_user_id, _booking_id, 'credit', _net_amount, 'completed', 'Booking payment');
  
  RETURN TRUE;
END;
$function$;