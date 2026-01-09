-- Fix MISSING_RLS: Remove dangerous wallet UPDATE policy and create secure functions

-- Drop the dangerous UPDATE policy that allows arbitrary wallet modifications
DROP POLICY IF EXISTS "Users can update their own wallet" ON public.wallets;

-- Create a SECURITY DEFINER function for crediting worker wallet after job completion
CREATE OR REPLACE FUNCTION public.credit_worker_wallet(
  _booking_id UUID,
  _amount INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _worker_user_id UUID;
  _platform_fee INTEGER;
  _net_amount INTEGER;
  _booking_status booking_status;
  _payment_status TEXT;
BEGIN
  -- Get worker and validate booking
  SELECT w.user_id, b.platform_fee, b.status, b.payment_status
  INTO _worker_user_id, _platform_fee, _booking_status, _payment_status
  FROM bookings b
  JOIN workers w ON w.id = b.worker_id
  WHERE b.id = _booking_id;
  
  IF _worker_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid booking';
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
$$;

-- Create a SECURITY DEFINER function for wallet withdrawal
CREATE OR REPLACE FUNCTION public.withdraw_from_wallet(
  _amount INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _transaction_id UUID;
  _current_balance INTEGER;
BEGIN
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Get current balance with row lock
  SELECT balance INTO _current_balance
  FROM wallets
  WHERE user_id = auth.uid()
  FOR UPDATE;
  
  IF _current_balance IS NULL THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;
  
  IF _current_balance < _amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  
  -- Update wallet
  UPDATE wallets
  SET 
    balance = balance - _amount,
    total_withdrawn = total_withdrawn + _amount,
    updated_at = now()
  WHERE user_id = auth.uid();
  
  -- Create withdrawal transaction
  INSERT INTO transactions (user_id, type, amount, status, description)
  VALUES (auth.uid(), 'withdrawal', _amount, 'pending', 'Withdrawal request')
  RETURNING id INTO _transaction_id;
  
  RETURN _transaction_id;
END;
$$;

-- Also secure the transactions table - remove direct INSERT for users
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;

-- Create a more restrictive policy - users can only view their transactions
-- Transactions should be created via secure functions only