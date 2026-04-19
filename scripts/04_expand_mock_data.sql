-- Extended seed data with more realistic mock data for realistic-looking platform

-- Add more job seekers
INSERT INTO users (id, email, full_name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440003', 'alex.dev@example.com', 'Alex Chen', 'job_seeker'),
  ('550e8400-e29b-41d4-a716-446655440004', 'sarah.designer@example.com', 'Sarah Williams', 'job_seeker'),
  ('550e8400-e29b-41d4-a716-446655440005', 'mike.pm@example.com', 'Mike Johnson', 'job_seeker');

-- Add more recruiters
INSERT INTO users (id, email, full_name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440006', 'recruiter2@example.com', 'Lisa Garcia', 'recruiter'),
  ('550e8400-e29b-41d4-a716-446655440007', 'recruiter3@example.com', 'Tom Brown', 'recruiter');

-- Add more jobs from different recruiters
INSERT INTO jobs (id, recruiter_id, title, description, location, salary_min, salary_max, job_type, experience_level, skills_required, status) VALUES
  ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 'UI/UX Designer', 'Looking for a talented UI/UX designer to create beautiful and intuitive user interfaces. Experience with Figma is required.', 'New York, NY', 80000, 120000, 'Full-time', 'Mid-level', ARRAY['Figma', 'UI Design', 'UX Research', 'Prototyping'], 'open'),
  ('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006', 'Backend Engineer (Node.js)', 'Build scalable backend systems using Node.js and PostgreSQL. You will work on microservices and cloud infrastructure.', 'Remote', 100000, 160000, 'Full-time', 'Mid-level', ARRAY['Node.js', 'PostgreSQL', 'Docker', 'AWS'], 'open'),
  ('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440007', 'Data Scientist', 'Join our data team to build ML models and analyze large datasets. Experience with Python and machine learning frameworks required.', 'San Francisco, CA', 120000, 180000, 'Full-time', 'Senior', ARRAY['Python', 'Machine Learning', 'TensorFlow', 'SQL'], 'open'),
  ('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007', 'QA Automation Engineer', 'Develop and maintain automated test suites. Experience with Selenium and CI/CD pipelines is essential.', 'Remote', 70000, 110000, 'Full-time', 'Mid-level', ARRAY['Selenium', 'Python', 'CI/CD', 'Testing'], 'open'),
  ('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Systems Administrator', 'Manage and maintain company infrastructure. Experience with Linux and cloud platforms required.', 'Remote', 85000, 130000, 'Full-time', 'Mid-level', ARRAY['Linux', 'AWS', 'Networking', 'System Administration'], 'open');

-- Insert more applications with varied statuses to show pipeline progression
INSERT INTO applications (job_id, user_id, status, cover_letter) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'reviewing', 'Very interested in the Product Manager role. I have 5 years of product experience at leading tech companies.'),
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'interview', 'Excited to discuss product strategy and vision for your platform.'),
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'submitted', 'Interest in DevOps role. Kubernetes expertise with 3+ years hands-on experience.'),
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'reviewing', 'DevOps professional with extensive cloud infrastructure background.'),
  ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'submitted', 'UI/UX Designer with 6 years experience. Portfolio available upon request.'),
  ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'interview', 'Product designer transitioning to UX. Passionate about user-centered design.'),
  ('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'reviewing', 'Full-stack developer looking to specialize in backend. Strong Node.js background.'),
  ('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'offer', 'Experienced Node.js engineer ready to contribute from day one.'),
  ('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'submitted', 'Data scientist with ML specialization. Published research in top-tier conferences.'),
  ('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'reviewing', 'QA automation engineer with 4 years Selenium experience.'),
  ('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'rejected', 'Systems admin applying for infrastructure role.'),
  ('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440004', 'offer', 'Senior Frontend Engineer with 10+ years React experience. Ready to lead teams.');

-- Insert notifications for various activities
INSERT INTO notifications (user_id, title, message, type) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Application Viewed', 'Your application to Senior Frontend Engineer has been viewed', 'info'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Status Update', 'Your application to Product Manager moved to Interview stage', 'success'),
  ('550e8400-e29b-41d4-a716-446655440003', 'New Application', 'You have a new applicant for Frontend Engineer role', 'info'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Job Posted', 'Your UI/UX Designer position received 12 applications', 'success'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Job Match', 'New job posting matches your profile: Senior Backend Engineer', 'info'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Interview Scheduled', 'Interview scheduled for Product Manager role - Tomorrow at 2 PM', 'warning');
