
-- Bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  talent_id text NOT NULL,
  talent_name text NOT NULL,
  client_name text NOT NULL DEFAULT '',
  duration_minutes integer NOT NULL CHECK (duration_minutes IN (20, 40, 60)),
  credits_charged integer NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Clients can read their own bookings
CREATE POLICY "Clients can read own bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (client_id = auth.uid());

-- Talents can read bookings for them (match by talent_id which is the slug)
-- We'll use a broader approach: authenticated users can read bookings where they are client or talent
CREATE POLICY "Talents can read their bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (
    talent_id IN (
      SELECT p.full_name FROM public.profiles p
      INNER JOIN public.user_roles ur ON ur.user_id = p.user_id
      WHERE ur.role = 'talent' AND p.user_id = auth.uid()
    )
  );

-- Book session function: validates balance, deducts credits, creates booking
CREATE OR REPLACE FUNCTION public.book_session(
  _talent_id text,
  _talent_name text,
  _duration_minutes integer,
  _credits integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _booking_id uuid;
  _balance integer;
  _client_name text;
BEGIN
  -- Check duration is valid
  IF _duration_minutes NOT IN (20, 40, 60) THEN
    RAISE EXCEPTION 'Invalid session duration';
  END IF;

  -- Get current balance
  SELECT credit_balance, full_name INTO _balance, _client_name
  FROM public.profiles
  WHERE user_id = auth.uid();

  IF _balance IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF _balance < _credits THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Deduct credits
  UPDATE public.profiles
  SET credit_balance = credit_balance - _credits,
      updated_at = now()
  WHERE user_id = auth.uid();

  -- Create booking
  INSERT INTO public.bookings (client_id, talent_id, talent_name, client_name, duration_minutes, credits_charged)
  VALUES (auth.uid(), _talent_id, _talent_name, _client_name, _duration_minutes, _credits)
  RETURNING id INTO _booking_id;

  RETURN _booking_id;
END;
$$;
