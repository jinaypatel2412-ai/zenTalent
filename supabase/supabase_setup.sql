-- ==========================================
-- SUPABASE SCHEMA SETUP FOR Zentalent APP
-- ==========================================
-- Instructions: Copy and paste this entire script into your Supabase SQL Editor and run it.

-- 1. Create or replace the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Followers table (who follows whom)
CREATE TABLE IF NOT EXISTS public.followers (
  follower_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

-- 3. Posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  caption text,
  image_url text,
  location text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Post Likes
CREATE TABLE IF NOT EXISTS public.post_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(post_id, user_id)
);

-- 5. Post Comments
CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Job Postings
CREATE TABLE IF NOT EXISTS public.job_postings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  company text NOT NULL,
  description text,
  location text,
  salary_range text,
  job_type text,
  skills_required text[],
  status text DEFAULT 'open'::text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Job Applications
CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  job_posting_id uuid REFERENCES public.job_postings(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'applied'::text,
  technical_score integer DEFAULT 0,
  aptitude_score integer DEFAULT 0,
  coding_score integer DEFAULT 0,
  overall_score integer DEFAULT 0,
  interview_stage text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, job_posting_id)
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- DROP EXISTING POLICIES TO PREVENT ERRORS ON RE-RUN
DROP POLICY IF EXISTS "Allow public read access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated update on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access on followers" ON public.followers;
DROP POLICY IF EXISTS "Allow authenticated all on followers" ON public.followers;
DROP POLICY IF EXISTS "Allow public read access on posts" ON public.posts;
DROP POLICY IF EXISTS "Allow authenticated all on posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public read access on post_likes" ON public.post_likes;
DROP POLICY IF EXISTS "Allow authenticated all on post_likes" ON public.post_likes;
DROP POLICY IF EXISTS "Allow public read access on post_comments" ON public.post_comments;
DROP POLICY IF EXISTS "Allow authenticated all on post_comments" ON public.post_comments;
DROP POLICY IF EXISTS "Allow public read access on job_postings" ON public.job_postings;
DROP POLICY IF EXISTS "Allow authenticated all on job_postings" ON public.job_postings;
DROP POLICY IF EXISTS "Allow public read access on job_applications" ON public.job_applications;
DROP POLICY IF EXISTS "Allow authenticated all on job_applications" ON public.job_applications;

-- CREATE OPEN POLICIES FOR EASY DEVELOPMENT
-- (Note: In production, you would restrict these based on auth.uid())

CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update on profiles" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access on followers" ON public.followers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on followers" ON public.followers FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access on posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on posts" ON public.posts FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access on post_likes" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on post_likes" ON public.post_likes FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access on post_comments" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on post_comments" ON public.post_comments FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access on job_postings" ON public.job_postings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on job_postings" ON public.job_postings FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access on job_applications" ON public.job_applications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated all on job_applications" ON public.job_applications FOR ALL USING (auth.role() = 'authenticated');

-- FUNCTION TO HANDLE NEW USER SIGNUPS AND CREATE A PROFILE
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://i.pravatar.cc/150?img=' || (random() * 70)::int)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- DROP TRIGGER IF EXISTS AND RECREATE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- INSERT SOME MOCK DATA FOR JOB POSTINGS SO THE APP ISNT EMPTY
INSERT INTO public.job_postings (title, company, description, location, salary_range, job_type, skills_required, status)
VALUES 
('Senior Full Stack Engineer', 'Stellar Tech', 'Join our dynamic team to build scalable web applications. We are looking for someone with deep knowledge in React, Node.js, and modern cloud architectures.', 'San Francisco, CA (Remote)', '$140k - $190k', 'Full-time', ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL'], 'open'),
('Frontend Developer', 'Creative Solutions', 'We need a pixel-perfect frontend developer to bring our beautiful UI designs to life using modern CSS frameworks and React.', 'New York, NY', '$110k - $150k', 'Hybrid', ARRAY['React', 'Tailwind CSS', 'Figma', 'UI/UX'], 'open'),
('Backend Systems Engineer', 'DataFlow', 'Looking for an experienced backend engineer to optimize our high-throughput data processing pipelines.', 'Remote', '$130k - $170k', 'Full-time', ARRAY['Python', 'Go', 'Docker', 'AWS'], 'open')
ON CONFLICT DO NOTHING;

-- BACKFILL EXISTING USERS INTO PROFILES (To prevent Foreign Key constraint errors)
INSERT INTO public.profiles (id, username, full_name, avatar_url)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'username', 'user_' || substr(id::text, 1, 8)),
  COALESCE(raw_user_meta_data->>'full_name', 'User'),
  COALESCE(raw_user_meta_data->>'avatar_url', 'https://i.pravatar.cc/150?img=' || (random() * 70)::int)
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);



