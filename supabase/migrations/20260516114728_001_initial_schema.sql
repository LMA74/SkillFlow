/*
  # SkillFlow Initial Database Schema

  1. New Tables
    - `profiles` - User profile data including personal info, education, employment status
    - `skills` - Master list of skills with categories and market demand
    - `resources` - Learning resources (videos, articles, quizzes, external links)
    - `courses` - Structured learning courses with skill associations
    - `course_modules` - Modules within each course
    - `user_skills` - Skills associated with users (existing or recommended)
    - `user_assessments` - Assessment responses and eligibility results
    - `user_schedules` - Flexible study schedules
    - `user_progress` - Progress tracking for courses and skills
    - `certificates` - Certificates earned by users
    - `opportunities` - Job and opportunity listings

  2. Security
    - RLS enabled on all tables
    - Users can only read/write their own data
    - Public read access for skills, resources, courses, and opportunities
    - Authenticated users can insert their own progress, schedules, etc.

  3. Important Notes
    - Vulnerability eligibility is determined by user_assessments
    - Skills have a market_demand field (1-10) for recommendation ranking
    - Schedules are flexible with day/time slots
    - Certificates are auto-generated upon course completion
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  date_of_birth date,
  gender text DEFAULT '',
  location text DEFAULT '',
  education_level text DEFAULT '',
  employment_status text DEFAULT '',
  current_skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  free_time_hours_per_week integer DEFAULT 0,
  preferred_study_times text[] DEFAULT '{}',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  is_eligible boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Skills master table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text DEFAULT '',
  market_demand integer DEFAULT 5 CHECK (market_demand >= 1 AND market_demand <= 10),
  icon_name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  resource_type text NOT NULL CHECK (resource_type IN ('video', 'article', 'quiz', 'external', 'mentor')),
  url text DEFAULT '',
  duration_minutes integer DEFAULT 0,
  is_free boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  difficulty text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours integer DEFAULT 0,
  image_url text DEFAULT '',
  is_free boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Course modules
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  module_order integer NOT NULL,
  resource_id uuid REFERENCES resources(id),
  created_at timestamptz DEFAULT now()
);

-- User skills (existing and recommended)
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level text DEFAULT 'beginner' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced')),
  source text DEFAULT 'assessment' CHECK (source IN ('assessment', 'recommended', 'manual')),
  is_learning boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- User assessments
CREATE TABLE IF NOT EXISTS user_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  responses jsonb DEFAULT '{}',
  eligibility_score integer DEFAULT 0,
  is_eligible boolean DEFAULT false,
  vulnerability_factors text[] DEFAULT '{}',
  recommended_skill_ids uuid[] DEFAULT '{}',
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- User schedules
CREATE TABLE IF NOT EXISTS user_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  day_of_week text NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  start_time text NOT NULL,
  duration_minutes integer DEFAULT 60,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User progress
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  module_id uuid REFERENCES course_modules(id) ON DELETE CASCADE,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_url text DEFAULT '',
  issued_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Opportunities
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  organization text DEFAULT '',
  location text DEFAULT '',
  opportunity_type text DEFAULT 'job' CHECK (opportunity_type IN ('job', 'internship', 'volunteer', 'training', 'scholarship')),
  required_skills uuid[] DEFAULT '{}',
  url text DEFAULT '',
  deadline date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Skills policies (public read)
CREATE POLICY "Anyone can read skills" ON skills FOR SELECT TO anon, authenticated USING (true);

-- Resources policies (public read)
CREATE POLICY "Anyone can read resources" ON resources FOR SELECT TO anon, authenticated USING (true);

-- Courses policies (public read)
CREATE POLICY "Anyone can read courses" ON courses FOR SELECT TO anon, authenticated USING (true);

-- Course modules policies (public read)
CREATE POLICY "Anyone can read course modules" ON course_modules FOR SELECT TO anon, authenticated USING (true);

-- User skills policies
CREATE POLICY "Users can read own skills" ON user_skills FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own skills" ON user_skills FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own skills" ON user_skills FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own skills" ON user_skills FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- User assessments policies
CREATE POLICY "Users can read own assessments" ON user_assessments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON user_assessments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessments" ON user_assessments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User schedules policies
CREATE POLICY "Users can read own schedules" ON user_schedules FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own schedules" ON user_schedules FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own schedules" ON user_schedules FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own schedules" ON user_schedules FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- User progress policies
CREATE POLICY "Users can read own progress" ON user_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Certificates policies
CREATE POLICY "Users can read own certificates" ON certificates FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own certificates" ON certificates FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Opportunities policies (public read)
CREATE POLICY "Anyone can read opportunities" ON opportunities FOR SELECT TO anon, authenticated USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_schedules_user_id ON user_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_skill_id ON resources(skill_id);
CREATE INDEX IF NOT EXISTS idx_courses_skill_id ON courses(skill_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
