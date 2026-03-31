
-- Talent applications table
CREATE TABLE public.talent_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  bio text DEFAULT '',
  specialty text DEFAULT '',
  portfolio_url text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  admin_notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);

ALTER TABLE public.talent_applications ENABLE ROW LEVEL SECURITY;

-- Admins can read all applications
CREATE POLICY "Admins can read all talent_applications"
  ON public.talent_applications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update applications (approve/reject)
CREATE POLICY "Admins can update talent_applications"
  ON public.talent_applications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can insert their own application
CREATE POLICY "Users can insert own application"
  ON public.talent_applications FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can read own application
CREATE POLICY "Users can read own application"
  ON public.talent_applications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Function to approve a talent application (updates role to talent)
CREATE OR REPLACE FUNCTION public.approve_talent_application(_application_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _app_user_id uuid;
BEGIN
  -- Verify caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT user_id INTO _app_user_id
  FROM public.talent_applications
  WHERE id = _application_id AND status = 'pending';

  IF _app_user_id IS NULL THEN
    RAISE EXCEPTION 'Application not found or already processed';
  END IF;

  -- Update application status
  UPDATE public.talent_applications
  SET status = 'approved', reviewed_at = now(), reviewed_by = auth.uid()
  WHERE id = _application_id;

  -- Update user role to talent
  UPDATE public.user_roles
  SET role = 'talent'
  WHERE user_id = _app_user_id;
END;
$$;

-- Function to reject a talent application
CREATE OR REPLACE FUNCTION public.reject_talent_application(_application_id uuid, _notes text DEFAULT '')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.talent_applications
  SET status = 'rejected', reviewed_at = now(), reviewed_by = auth.uid(), admin_notes = _notes
  WHERE id = _application_id AND status = 'pending';
END;
$$;
