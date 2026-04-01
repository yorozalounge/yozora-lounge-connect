
CREATE OR REPLACE FUNCTION public.extend_session(_booking_id uuid, _extra_minutes integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  _balance integer;
  _per_minute numeric;
  _cost integer;
  _client_id uuid;
BEGIN
  -- Validate extension
  IF _extra_minutes NOT IN (10, 20) THEN
    RAISE EXCEPTION 'Invalid extension duration';
  END IF;

  -- Get booking info and compute per-minute rate
  SELECT b.client_id, CEIL(b.credits_charged::numeric / b.duration_minutes)
  INTO _client_id, _per_minute
  FROM public.bookings b
  WHERE b.id = _booking_id;

  IF _client_id IS NULL THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  IF _client_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  _cost := (_per_minute * _extra_minutes)::integer;

  -- Check balance
  SELECT credit_balance INTO _balance
  FROM public.profiles
  WHERE user_id = auth.uid();

  IF _balance IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF _balance < _cost THEN
    RAISE EXCEPTION 'Insufficient credits. Need % credits.', _cost;
  END IF;

  -- Deduct credits
  UPDATE public.profiles
  SET credit_balance = credit_balance - _cost, updated_at = now()
  WHERE user_id = auth.uid();

  -- Extend booking duration
  UPDATE public.bookings
  SET duration_minutes = duration_minutes + _extra_minutes
  WHERE id = _booking_id;
END;
$$;
