-- ==========================================
-- SETTINGS & PROFILE UPDATE SQL
-- ==========================================
-- Instructions: Copy and paste this into your Supabase SQL Editor and run it.

-- Ensure correct columns exist on your profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS resume_url text,
ADD COLUMN IF NOT EXISTS languages_known text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS content_language text DEFAULT 'English',
ADD COLUMN IF NOT EXISTS profile_visibility text DEFAULT 'everyone';

-- (Optional) If you haven't yet, create storage buckets for files
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true) ON CONFLICT DO NOTHING;

-- Storage public policies (so users can upload/view their files)
DROP POLICY IF EXISTS "Avatar Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Resume Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Resume Upload Access" ON storage.objects;

CREATE POLICY "Avatar Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Avatar Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Avatar Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Resume Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
CREATE POLICY "Resume Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');
CREATE POLICY "Resume Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');



