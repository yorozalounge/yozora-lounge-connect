
CREATE OR REPLACE FUNCTION public.extend_session(_booking_id uuid, _extra_minutes integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  _balance integer;
  _per_minute numeric;
  _raw_cost integer;
  _cost integer;
  _min_cost integer;
  _max_cost integer;
  _client_id uuid;
  _talent_id text;
  _talent_share integer;
  _platform_share integer;
BEGIN
  IF _extra_minutes NOT IN (10, 20) THEN
    RAISE EXCEPTION 'Invalid extension duration';
  END IF;

  -- Set cost bounds based on duration
  IF _extra_minutes = 10 THEN
    _min_cost := 1000;
    _max_cost := 5000;
  ELSE
    _min_cost := 2000;
    _max_cost := 8000;
  END IF;

  -- Get booking info
  SELECT b.client_id, b.talent_id, CEIL(b.credits_charged::numeric / b.duration_minutes)
  INTO _client_id, _talent_id, _per_minute
  FROM public.bookings b
  WHERE b.id = _booking_id;

  IF _client_id IS NULL THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  IF _client_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Calculate and clamp cost
  _raw_cost := (_per_minute * _extra_minutes)::integer;
  _cost := GREATEST(_min_cost, LEAST(_max_cost, _raw_cost));

  -- 60/40 split
  _talent_share := (_cost * 0.6)::integer;
  _platform_share := _cost - _talent_share;

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

  -- Deduct from client
  UPDATE public.profiles
  SET credit_balance = credit_balance - _cost, updated_at = now()
  WHERE user_id = auth.uid();

  -- Credit creator (60%)
  UPDATE public.profiles
  SET credit_balance = credit_balance + _talent_share, updated_at = now()
  WHERE user_id = (
    SELECT p.user_id FROM public.profiles p
    JOIN public.user_roles ur ON ur.user_id = p.user_id
    WHERE ur.role = 'talent' AND p.full_name = _talent_id
    LIMIT 1
  );

  -- Extend booking
  UPDATE public.bookings
  SET duration_minutes = duration_minutes + _extra_minutes
  WHERE id = _booking_id;
END;
$$;
