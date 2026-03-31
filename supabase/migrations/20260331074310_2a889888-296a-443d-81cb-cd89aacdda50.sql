
CREATE OR REPLACE FUNCTION public.book_session(
  _talent_id text,
  _talent_name text,
  _duration_minutes integer,
  _credits integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _booking_id uuid;
  _balance integer;
  _client_name text;
  _room_url text;
BEGIN
  IF _duration_minutes NOT IN (20, 40, 60) THEN
    RAISE EXCEPTION 'Invalid session duration';
  END IF;

  SELECT credit_balance, full_name INTO _balance, _client_name
  FROM public.profiles
  WHERE user_id = auth.uid();

  IF _balance IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF _balance < _credits THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  _booking_id := gen_random_uuid();
  _room_url := 'https://meet.jit.si/YozoraLounge-' || replace(_booking_id::text, '-', '');

  UPDATE public.profiles
  SET credit_balance = credit_balance - _credits,
      updated_at = now()
  WHERE user_id = auth.uid();

  INSERT INTO public.bookings (id, client_id, talent_id, talent_name, client_name, duration_minutes, credits_charged, room_url)
  VALUES (_booking_id, auth.uid(), _talent_id, _talent_name, _client_name, _duration_minutes, _credits, _room_url);

  RETURN _booking_id;
END;
$$;
