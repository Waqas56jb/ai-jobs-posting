-- ============================================
-- FIX: Insert Applications with Correct User IDs
-- ============================================
-- First, check which users exist in your database
-- Then use those user_ids in the applications INSERT

-- Step 1: Check existing users
SELECT id, full_name, email FROM users ORDER BY id;

-- Step 2: Check existing jobs
SELECT id, title, company FROM jobs ORDER BY id;

-- ============================================
-- OPTION 1: Create Users First (if they don't exist)
-- ============================================
-- Use API endpoints to create users (recommended):
-- POST /api/users/register

-- OR if you want to insert directly (NOT recommended - passwords won't work):
-- Note: These passwords are NOT hashed - they won't work for login!
-- You MUST use the API to create users with working passwords

-- ============================================
-- OPTION 2: Insert Applications with Existing User IDs
-- ============================================
-- Replace the user_id values below with actual user IDs from your database
-- Run the SELECT query above first to see which user_ids exist

-- Example: If you have users with IDs 1, 2, 3, 4, 5, use this:
INSERT INTO applications (job_id, user_id, name, email, phone, resume_filename, resume_mime, ai_parsed_data) VALUES
(1, 1, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["JavaScript", "React", "Node.js"], "experience_years": 5, "education": "BS in Computer Science", "matches": ["JavaScript", "React", "Node.js"], "match_percentage": 85}'::jsonb),

(2, 2, 'Jane Smith', 'jane.smith@example.com', '+1987654321', 'jane_resume.pdf', 'application/pdf', '{"skills": ["React", "TypeScript", "CSS"], "experience_years": 4, "education": "BS in Computer Science", "matches": ["React", "TypeScript", "CSS"], "match_percentage": 90}'::jsonb),

(1, 3, 'Mike Johnson', 'mike.j@example.com', '+1555555555', 'mike_resume.pdf', 'application/pdf', '{"skills": ["Python", "Django", "PostgreSQL"], "experience_years": 3, "education": "MS in Software Engineering", "matches": ["PostgreSQL"], "match_percentage": 40}'::jsonb),

(3, 1, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["Python", "Django"], "experience_years": 2, "education": "BS in Computer Science", "matches": ["Python", "Django"], "match_percentage": 80}'::jsonb),

(4, 4, 'Sarah Williams', 'sarah.w@example.com', '+1444444444', 'sarah_resume.pdf', 'application/pdf', '{"skills": ["Python", "TensorFlow", "SQL"], "experience_years": 6, "education": "PhD in Data Science", "matches": ["Python", "TensorFlow", "SQL"], "match_percentage": 95}'::jsonb),

(5, 5, 'David Brown', 'david.brown@example.com', '+1333333333', 'david_resume.pdf', 'application/pdf', '{"skills": ["Product Strategy", "Agile", "Analytics"], "experience_years": 4, "education": "MBA in Business Administration", "matches": ["Product Strategy", "Agile", "Analytics"], "match_percentage": 100}'::jsonb),

(2, 1, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["React", "JavaScript"], "experience_years": 3, "education": "BS in Computer Science", "matches": ["React", "JavaScript"], "match_percentage": 70}'::jsonb);

-- ============================================
-- OPTION 3: Insert Applications WITHOUT user_id (NULL)
-- ============================================
-- If you want to insert applications without linking to users:
-- Note: user_id can be NULL based on your schema (ON DELETE SET NULL)

INSERT INTO applications (job_id, user_id, name, email, phone, resume_filename, resume_mime, ai_parsed_data) VALUES
(1, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["JavaScript", "React", "Node.js"], "experience_years": 5, "education": "BS in Computer Science", "matches": ["JavaScript", "React", "Node.js"], "match_percentage": 85}'::jsonb),

(2, NULL, 'Jane Smith', 'jane.smith@example.com', '+1987654321', 'jane_resume.pdf', 'application/pdf', '{"skills": ["React", "TypeScript", "CSS"], "experience_years": 4, "education": "BS in Computer Science", "matches": ["React", "TypeScript", "CSS"], "match_percentage": 90}'::jsonb),

(1, NULL, 'Mike Johnson', 'mike.j@example.com', '+1555555555', 'mike_resume.pdf', 'application/pdf', '{"skills": ["Python", "Django", "PostgreSQL"], "experience_years": 3, "education": "MS in Software Engineering", "matches": ["PostgreSQL"], "match_percentage": 40}'::jsonb),

(3, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["Python", "Django"], "experience_years": 2, "education": "BS in Computer Science", "matches": ["Python", "Django"], "match_percentage": 80}'::jsonb),

(4, NULL, 'Sarah Williams', 'sarah.w@example.com', '+1444444444', 'sarah_resume.pdf', 'application/pdf', '{"skills": ["Python", "TensorFlow", "SQL"], "experience_years": 6, "education": "PhD in Data Science", "matches": ["Python", "TensorFlow", "SQL"], "match_percentage": 95}'::jsonb),

(5, NULL, 'David Brown', 'david.brown@example.com', '+1333333333', 'david_resume.pdf', 'application/pdf', '{"skills": ["Product Strategy", "Agile", "Analytics"], "experience_years": 4, "education": "MBA in Business Administration", "matches": ["Product Strategy", "Agile", "Analytics"], "match_percentage": 100}'::jsonb),

(2, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["React", "JavaScript"], "experience_years": 3, "education": "BS in Computer Science", "matches": ["React", "JavaScript"], "match_percentage": 70}'::jsonb);

