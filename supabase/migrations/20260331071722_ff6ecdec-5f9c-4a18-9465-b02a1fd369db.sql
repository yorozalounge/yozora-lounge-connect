
-- Talent availability table
CREATE TABLE public.talent_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_hour integer NOT NULL CHECK (start_hour BETWEEN 0 AND 23),
  end_hour integer NOT NULL CHECK (end_hour BETWEEN 1 AND 24),
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, day_of_week)
);

ALTER TABLE public.talent_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Talents can read own availability"
  ON public.talent_availability FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Talents can insert own availability"
  ON public.talent_availability FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Talents can update own availability"
  ON public.talent_availability FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Talent payouts table
CREATE TABLE public.talent_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_amount integer NOT NULL,
  usd_amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payout_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.talent_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Talents can read own payouts"
  ON public.talent_payouts FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Function to upsert availability
CREATE OR REPLACE FUNCTION public.upsert_availability(
  _day_of_week integer,
  _start_hour integer,
  _end_hour integer,
  _is_available boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.talent_availability (user_id, day_of_week, start_hour, end_hour, is_available)
  VALUES (auth.uid(), _day_of_week, _start_hour, _end_hour, _is_available)
  ON CONFLICT (user_id, day_of_week)
  DO UPDATE SET start_hour = _start_hour, end_hour = _end_hour, is_available = _is_available, updated_at = now();
END;
$$;
