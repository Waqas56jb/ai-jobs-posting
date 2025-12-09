-- ============================================
-- Sample INSERT Queries for JobSpeedy AI Database
-- Run these in your Vercel Neon Postgres database
-- ============================================

-- ============================================
-- 1. ADMIN USERS
-- ============================================
-- Note: Passwords need to be hashed using bcrypt
-- In production, use the API endpoints to create admins
-- These are examples with hashed passwords (password: "Admin@123")

INSERT INTO admin_users (email, password_hash) VALUES
('admin@jobspeedy.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOeZqZqZqZqZqZqZqZqZqZqZqZqZqZq'),
('admin2@jobspeedy.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOeZqZqZqZqZqZqZqZqZqZqZqZqZq');

-- ============================================
-- 2. REGULAR USERS
-- ============================================
-- Note: Passwords need to be hashed using bcrypt
-- In production, use the API endpoints to create users
-- These are examples with hashed passwords (password: "User@123")

INSERT INTO users (full_name, email, password_hash) VALUES
('John Doe', 'john.doe@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOeZqZqZqZqZqZqZqZqZqZqZqZqZq'),
('Jane Smith', 'jane.smith@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOeZqZqZqZqZqZqZqZqZqZqZqZqZq'),
('Mike Johnson', 'mike.j@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOeZqZqZqZqZqZqZqZqZqZqZqZqZq'),
('Sarah Williams', 'sarah.w@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOeZqZqZqZqZqZqZqZqZqZqZqZqZq'),
('David Brown', 'david.brown@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOeZqZqZqZqZqZqZqZqZqZqZqZqZq');

-- ============================================
-- 3. JOBS
-- ============================================

INSERT INTO jobs (title, company, description, required_skills, location, job_type, category, language) VALUES
('Senior Full Stack Developer', 'Tech Corp', 'We are looking for an experienced full stack developer to join our team. You will be working on cutting-edge projects using modern technologies like React, Node.js, and PostgreSQL.', ARRAY['JavaScript', 'Node.js', 'React', 'PostgreSQL', 'AWS'], 'Remote', 'Full-time', 'Engineering', 'English'),

('Frontend Developer', 'Web Solutions Inc', 'Join our frontend team to build beautiful user interfaces using React and TypeScript. You will work closely with designers and backend developers to create seamless user experiences.', ARRAY['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript'], 'New York', 'Full-time', 'Engineering', 'English'),

('Backend Engineer', 'Cloud Systems', 'Design and implement scalable backend systems using Python and Django. You will work on API development, database optimization, and cloud infrastructure.', ARRAY['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'], 'San Francisco', 'Part-time', 'Engineering', 'English'),

('Data Scientist', 'AI Innovations', 'Work on machine learning models and data analysis to solve complex business problems. You will use Python, TensorFlow, and SQL to build predictive models.', ARRAY['Python', 'TensorFlow', 'SQL', 'Statistics', 'Machine Learning'], 'Remote', 'Full-time', 'Data Science', 'English'),

('Product Manager', 'StartupXYZ', 'Lead product development and strategy for our innovative platform. You will work with cross-functional teams to define product roadmap and prioritize features.', ARRAY['Product Strategy', 'Agile', 'Analytics', 'User Research'], 'Boston', 'Full-time', 'Product', 'English'),

('DevOps Engineer', 'CloudTech', 'Manage and optimize our cloud infrastructure using AWS, Docker, and Kubernetes. You will ensure high availability and scalability of our systems.', ARRAY['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'], 'Remote', 'Full-time', 'Engineering', 'English'),

('UI/UX Designer', 'Design Studio', 'Create beautiful and intuitive user interfaces for web and mobile applications. You will work with product managers and developers to bring designs to life.', ARRAY['Figma', 'Adobe XD', 'User Research', 'Prototyping'], 'Los Angeles', 'Full-time', 'Design', 'English'),

('Mobile App Developer', 'AppWorks', 'Develop native and cross-platform mobile applications using React Native and Flutter. You will work on both iOS and Android platforms.', ARRAY['React Native', 'Flutter', 'iOS', 'Android', 'JavaScript'], 'Seattle', 'Full-time', 'Engineering', 'English'),

('QA Engineer', 'Quality Assurance Inc', 'Ensure the quality of our software products through comprehensive testing. You will write test cases, perform manual and automated testing.', ARRAY['Testing', 'Selenium', 'Jest', 'QA', 'Automation'], 'Chicago', 'Full-time', 'Engineering', 'English'),

('Marketing Manager', 'Growth Co', 'Develop and execute marketing strategies to grow our user base. You will manage digital marketing campaigns, content creation, and brand awareness.', ARRAY['Digital Marketing', 'SEO', 'Content Marketing', 'Analytics'], 'Austin', 'Full-time', 'Marketing', 'English');

-- ============================================
-- 4. APPLICANTS (Resume Parsing)
-- ============================================

INSERT INTO applicants (name, email, phone, skills, experience, education, resume_filename, resume_mime) VALUES
('Jane Smith', 'jane.smith@example.com', '+1234567890', ARRAY['JavaScript', 'React', 'Node.js', 'PostgreSQL'], '{"years": 5, "companies": ["Tech Corp", "Web Solutions"], "positions": ["Junior Developer", "Senior Developer"]}'::jsonb, 'BS in Computer Science from State University', 'jane_resume.pdf', 'application/pdf'),

('Mike Johnson', 'mike.j@example.com', '+1987654321', ARRAY['Python', 'Django', 'AWS', 'Docker'], '{"years": 3, "companies": ["Cloud Systems"], "positions": ["Backend Developer"]}'::jsonb, 'MS in Software Engineering', 'mike_resume.pdf', 'application/pdf'),

('Sarah Williams', 'sarah.w@example.com', '+1555555555', ARRAY['React', 'TypeScript', 'CSS', 'Figma'], '{"years": 4, "companies": ["Design Studio", "Web Solutions"], "positions": ["Frontend Developer", "UI Developer"]}'::jsonb, 'BS in Computer Science', 'sarah_resume.pdf', 'application/pdf'),

('David Brown', 'david.brown@example.com', '+1444444444', ARRAY['Python', 'TensorFlow', 'SQL', 'Statistics'], '{"years": 6, "companies": ["AI Innovations", "Data Corp"], "positions": ["Data Analyst", "Data Scientist"]}'::jsonb, 'PhD in Data Science', 'david_resume.pdf', 'application/pdf'),

('Emily Davis', 'emily.d@example.com', '+1333333333', ARRAY['Product Strategy', 'Agile', 'Analytics'], '{"years": 4, "companies": ["StartupXYZ"], "positions": ["Product Manager"]}'::jsonb, 'MBA in Business Administration', 'emily_resume.pdf', 'application/pdf');

-- ============================================
-- 5. APPLICATIONS (Job Applications)
-- ============================================
-- Note: user_id references users table, job_id references jobs table
-- Make sure users and jobs exist before inserting applications

INSERT INTO applications (job_id, user_id, name, email, phone, resume_filename, resume_mime, ai_parsed_data) VALUES
(1, 1, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["JavaScript", "React", "Node.js"], "experience_years": 5, "education": "BS in Computer Science", "matches": ["JavaScript", "React", "Node.js"], "match_percentage": 85}'::jsonb),

(2, 2, 'Jane Smith', 'jane.smith@example.com', '+1987654321', 'jane_resume.pdf', 'application/pdf', '{"skills": ["React", "TypeScript", "CSS"], "experience_years": 4, "education": "BS in Computer Science", "matches": ["React", "TypeScript", "CSS"], "match_percentage": 90}'::jsonb),

(1, 3, 'Mike Johnson', 'mike.j@example.com', '+1555555555', 'mike_resume.pdf', 'application/pdf', '{"skills": ["Python", "Django", "PostgreSQL"], "experience_years": 3, "education": "MS in Software Engineering", "matches": ["PostgreSQL"], "match_percentage": 40}'::jsonb),

(3, 1, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["Python", "Django"], "experience_years": 2, "education": "BS in Computer Science", "matches": ["Python", "Django"], "match_percentage": 80}'::jsonb),

(4, 4, 'Sarah Williams', 'sarah.w@example.com', '+1444444444', 'sarah_resume.pdf', 'application/pdf', '{"skills": ["Python", "TensorFlow", "SQL"], "experience_years": 6, "education": "PhD in Data Science", "matches": ["Python", "TensorFlow", "SQL"], "match_percentage": 95}'::jsonb),

(5, 5, 'David Brown', 'david.brown@example.com', '+1333333333', 'david_resume.pdf', 'application/pdf', '{"skills": ["Product Strategy", "Agile", "Analytics"], "experience_years": 4, "education": "MBA in Business Administration", "matches": ["Product Strategy", "Agile", "Analytics"], "match_percentage": 100}'::jsonb),

(2, 1, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["React", "JavaScript"], "experience_years": 3, "education": "BS in Computer Science", "matches": ["React", "JavaScript"], "match_percentage": 70}'::jsonb);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify your data was inserted correctly

-- Count records in each table
SELECT 'admin_users' as table_name, COUNT(*) as count FROM admin_users
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL
SELECT 'applicants', COUNT(*) FROM applicants
UNION ALL
SELECT 'applications', COUNT(*) FROM applications;

-- View all jobs
SELECT id, title, company, location, job_type FROM jobs;

-- View all users
SELECT id, full_name, email FROM users;

-- View all applications with job and user info
SELECT 
    a.id,
    a.name,
    a.email,
    j.title as job_title,
    j.company as job_company,
    u.full_name as user_name
FROM applications a
LEFT JOIN jobs j ON a.job_id = j.id
LEFT JOIN users u ON a.user_id = u.id;

-- ============================================
-- NOTES
-- ============================================
-- 1. For admin_users and users, passwords are hashed using bcrypt
--    In production, always use the API endpoints to create users/admins
--    The password hashes above are just examples - they won't work for login
--    
-- 2. To create real users/admins, use these API endpoints:
--    POST /api/admin/register
--    POST /api/users/register
--
-- 3. For applications, make sure the user_id and job_id exist
--    before inserting applications
--
-- 4. The ai_parsed_data field is JSONB, so use ::jsonb cast
--
-- 5. The required_skills field is TEXT[], so use ARRAY['skill1', 'skill2']
--
-- 6. For resume files, you can only store metadata (filename, mime type)
--    Actual file data (BYTEA) should be uploaded via API endpoints

