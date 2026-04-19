-- Create ENUM types
CREATE TYPE user_role AS ENUM ('job_seeker', 'recruiter', 'admin');
CREATE TYPE job_status AS ENUM ('open', 'closed');
CREATE TYPE application_status AS ENUM ('submitted', 'reviewing', 'interview', 'offer', 'rejected');

-- Create users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'job_seeker',
  avatar_url TEXT,
  location TEXT,
  phone TEXT,
  bio TEXT,
  profile_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status job_status NOT NULL DEFAULT 'open',
  salary_range TEXT,
  location TEXT,
  job_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'submitted',
  cover_letter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, user_id)
);

-- Create pipeline_stages table
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_pipeline_stages_job_id ON pipeline_stages(job_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON users FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- RLS Policies for jobs table
CREATE POLICY "Anyone can view open jobs"
  ON jobs FOR SELECT
  USING (status = 'open' OR auth.uid() = company_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Recruiters can create jobs"
  ON jobs FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'recruiter' OR role = 'admin'));

CREATE POLICY "Recruiters can edit their own jobs"
  ON jobs FOR UPDATE
  USING (auth.uid() = company_id OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- RLS Policies for applications table
CREATE POLICY "Job seekers can view their own applications"
  ON applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can view applications for their jobs"
  ON applications FOR SELECT
  USING (
    auth.uid() IN (
      SELECT company_id FROM jobs WHERE id = job_id
    ) OR auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

CREATE POLICY "Job seekers can create applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Recruiters can update applications for their jobs"
  ON applications FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT company_id FROM jobs WHERE id = job_id
    ) OR auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- RLS Policies for pipeline_stages table
CREATE POLICY "Recruiters can view pipeline for their jobs"
  ON pipeline_stages FOR SELECT
  USING (
    auth.uid() IN (
      SELECT company_id FROM jobs WHERE id = job_id
    ) OR auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

CREATE POLICY "Recruiters can manage pipeline for their jobs"
  ON pipeline_stages FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT company_id FROM jobs WHERE id = job_id
    )
  );

CREATE POLICY "Recruiters can update pipeline for their jobs"
  ON pipeline_stages FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT company_id FROM jobs WHERE id = job_id
    )
  );
