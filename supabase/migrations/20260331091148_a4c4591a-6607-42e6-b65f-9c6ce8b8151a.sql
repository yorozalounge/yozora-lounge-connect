
-- Add new columns to talent_applications
ALTER TABLE public.talent_applications
  ADD COLUMN IF NOT EXISTS stage_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS country text DEFAULT '',
  ADD COLUMN IF NOT EXISTS languages text DEFAULT '',
  ADD COLUMN IF NOT EXISTS motivation text DEFAULT '',
  ADD COLUMN IF NOT EXISTS photo_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS id_document_url text DEFAULT '';

-- Create storage buckets for talent uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('talent-photos', 'talent-photos', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('talent-id-docs', 'talent-id-docs', false)
  ON CONFLICT (id) DO NOTHING;

-- RLS for talent-photos: anyone can read (public), authenticated can upload own
CREATE POLICY "Anyone can view talent photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'talent-photos');

CREATE POLICY "Authenticated users can upload talent photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'talent-photos');

-- RLS for talent-id-docs: only admin can read, authenticated can upload
CREATE POLICY "Admins can view ID documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'talent-id-docs' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can upload ID documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'talent-id-docs');
