
-- Client reviews on talents (public)
CREATE TABLE public.session_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL,
  talent_id text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  reviewer_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(booking_id, reviewer_id)
);

ALTER TABLE public.session_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read client reviews (shown on talent profiles)
CREATE POLICY "Anyone can read reviews" ON public.session_reviews
  FOR SELECT TO authenticated USING (true);

-- Clients can insert their own review
CREATE POLICY "Users can insert own review" ON public.session_reviews
  FOR INSERT TO authenticated WITH CHECK (reviewer_id = auth.uid());

-- Talent private ratings on clients (internal quality tracking)
CREATE TABLE public.talent_session_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  talent_user_id uuid NOT NULL,
  client_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(booking_id, talent_user_id)
);

ALTER TABLE public.talent_session_ratings ENABLE ROW LEVEL SECURITY;

-- Only the talent who created the rating can see it
CREATE POLICY "Talents can read own ratings" ON public.talent_session_ratings
  FOR SELECT TO authenticated USING (talent_user_id = auth.uid());

-- Talents can insert their own rating
CREATE POLICY "Talents can insert own rating" ON public.talent_session_ratings
  FOR INSERT TO authenticated WITH CHECK (talent_user_id = auth.uid());
