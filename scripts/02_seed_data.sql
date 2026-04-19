-- Insert sample users
INSERT INTO users (id, email, password_hash, full_name, role, location, phone, bio) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'john.recruiter@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36ZyWDHm', 'John Smith', 'recruiter', 'San Francisco, CA', '555-0001', 'Senior Recruiter with 5+ years of experience'),
  ('550e8400-e29b-41d4-a716-446655440001', 'jane.seeker@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36ZyWDHm', 'Jane Doe', 'job_seeker', 'New York, NY', '555-0002', 'Full Stack Developer seeking new opportunities'),
  ('550e8400-e29b-41d4-a716-446655440002', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36ZyWDHm', 'Admin User', 'admin', 'San Francisco, CA', '555-0003', 'Platform Administrator');

-- Insert sample jobs
INSERT INTO jobs (id, recruiter_id, title, description, location, salary_min, salary_max, job_type, experience_level, skills_required, status) VALUES
  ('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Senior Frontend Engineer', 'We are looking for an experienced Frontend Engineer to join our team. You will work on building scalable web applications using React and TypeScript.', 'San Francisco, CA', 120000, 180000, 'Full-time', 'Senior', ARRAY['React', 'TypeScript', 'Next.js', 'Tailwind CSS'], 'open'),
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Product Manager', 'Join our product team to shape the future of our platform. You will lead cross-functional teams and drive product strategy.', 'Remote', 130000, 160000, 'Full-time', 'Mid-level', ARRAY['Product Strategy', 'Analytics', 'Leadership'], 'open'),
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'DevOps Engineer', 'Help us build and maintain our infrastructure. We are looking for someone with experience in cloud deployment and CI/CD pipelines.', 'Remote', 110000, 150000, 'Full-time', 'Mid-level', ARRAY['Docker', 'Kubernetes', 'AWS', 'CI/CD'], 'open');

-- Insert sample pipeline stages
INSERT INTO pipeline_stages (job_id, name, order_index) VALUES
  ('650e8400-e29b-41d4-a716-446655440000', 'Applied', 0),
  ('650e8400-e29b-41d4-a716-446655440000', 'Screening', 1),
  ('650e8400-e29b-41d4-a716-446655440000', 'Interview', 2),
  ('650e8400-e29b-41d4-a716-446655440000', 'Offer', 3),
  ('650e8400-e29b-41d4-a716-446655440001', 'Applied', 0),
  ('650e8400-e29b-41d4-a716-446655440001', 'Screening', 1),
  ('650e8400-e29b-41d4-a716-446655440001', 'Interview', 2),
  ('650e8400-e29b-41d4-a716-446655440001', 'Offer', 3),
  ('650e8400-e29b-41d4-a716-446655440002', 'Applied', 0),
  ('650e8400-e29b-41d4-a716-446655440002', 'Screening', 1),
  ('650e8400-e29b-41d4-a716-446655440002', 'Interview', 2),
  ('650e8400-e29b-41d4-a716-446655440002', 'Offer', 3);

-- Insert sample applications
INSERT INTO applications (job_id, applicant_id, status, pipeline_stage_id, cover_letter) VALUES
  ('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'applied', (SELECT id FROM pipeline_stages WHERE job_id = '650e8400-e29b-41d4-a716-446655440000' AND order_index = 0 LIMIT 1), 'I am very interested in this Senior Frontend Engineer position. With my 8 years of experience in React and modern web development, I am confident I can contribute significantly to your team.');
