
-- Credit transactions table
CREATE TABLE public.credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bundle_name text NOT NULL,
  credits_purchased integer NOT NULL,
  bonus_credits integer NOT NULL DEFAULT 0,
  amount_paid numeric(10,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON public.credit_transactions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Function to purchase credits (adds to balance + logs transaction)
CREATE OR REPLACE FUNCTION public.purchase_credits(
  _bundle_name text,
  _credits integer,
  _bonus integer,
  _amount numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert transaction record
  INSERT INTO public.credit_transactions (user_id, bundle_name, credits_purchased, bonus_credits, amount_paid)
  VALUES (auth.uid(), _bundle_name, _credits, _bonus, _amount);

  -- Update balance
  UPDATE public.profiles
  SET credit_balance = credit_balance + _credits + _bonus,
      updated_at = now()
  WHERE user_id = auth.uid();
END;
$$;
