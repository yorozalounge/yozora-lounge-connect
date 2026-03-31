
-- Tips table
CREATE TABLE public.tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id),
  client_id uuid NOT NULL,
  talent_id text NOT NULL,
  amount integer NOT NULL,
  talent_share integer NOT NULL,
  platform_share integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;

-- Clients can read their own tips
CREATE POLICY "Clients can read own tips"
  ON public.tips FOR SELECT TO authenticated
  USING (client_id = auth.uid());

-- Talents can read tips sent to them (match by booking)
CREATE POLICY "Talents can read tips for their bookings"
  ON public.tips FOR SELECT TO authenticated
  USING (booking_id IN (
    SELECT b.id FROM public.bookings b WHERE b.talent_id IN (
      SELECT p.full_name FROM public.profiles p WHERE p.user_id = auth.uid()
    )
  ));

-- RPC to send a tip: deducts from client, records the tip
CREATE OR REPLACE FUNCTION public.send_tip(
  _booking_id uuid,
  _talent_id text,
  _amount integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _tip_id uuid;
  _balance integer;
  _talent_share integer;
  _platform_share integer;
BEGIN
  -- Validate tip amount
  IF _amount NOT IN (500, 1000, 3000, 10000, 30000) THEN
    RAISE EXCEPTION 'Invalid tip amount';
  END IF;

  -- Check client balance
  SELECT credit_balance INTO _balance
  FROM public.profiles
  WHERE user_id = auth.uid();

  IF _balance IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF _balance < _amount THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Calculate split
  _talent_share := _amount / 2;
  _platform_share := _amount - _talent_share;

  -- Deduct from client
  UPDATE public.profiles
  SET credit_balance = credit_balance - _amount, updated_at = now()
  WHERE user_id = auth.uid();

  -- Record tip
  _tip_id := gen_random_uuid();
  INSERT INTO public.tips (id, booking_id, client_id, talent_id, amount, talent_share, platform_share)
  VALUES (_tip_id, _booking_id, auth.uid(), _talent_id, _amount, _talent_share, _platform_share);

  RETURN _tip_id;
END;
$$;
