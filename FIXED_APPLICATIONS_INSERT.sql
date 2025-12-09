-- ============================================
-- FIXED: Insert Applications - Step by Step
-- ============================================

-- STEP 1: Check if jobs exist (job_id foreign key must exist)
SELECT id, title, company FROM jobs ORDER BY id;

-- If no jobs exist, create them first or use existing job IDs

-- STEP 2: Check if users exist (optional - can be NULL)
SELECT id, full_name, email FROM users ORDER BY id;

-- ============================================
-- SOLUTION 1: Insert with NULL user_id (if jobs exist)
-- ============================================
-- Make sure job_id values (1, 2, 3, 4, 5) exist in jobs table first!

-- First, verify jobs exist:
SELECT COUNT(*) as job_count FROM jobs WHERE id IN (1, 2, 3, 4, 5);

-- If job_count is less than 5, you need to create jobs first
-- Then use this INSERT:

INSERT INTO applications (job_id, user_id, name, email, phone, resume_filename, resume_mime, ai_parsed_data) VALUES
(1, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["JavaScript", "React", "Node.js"], "experience_years": 5, "education": "BS in Computer Science", "matches": ["JavaScript", "React", "Node.js"], "match_percentage": 85}'::jsonb),
(2, NULL, 'Jane Smith', 'jane.smith@example.com', '+1987654321', 'jane_resume.pdf', 'application/pdf', '{"skills": ["React", "TypeScript", "CSS"], "experience_years": 4, "education": "BS in Computer Science", "matches": ["React", "TypeScript", "CSS"], "match_percentage": 90}'::jsonb),
(1, NULL, 'Mike Johnson', 'mike.j@example.com', '+1555555555', 'mike_resume.pdf', 'application/pdf', '{"skills": ["Python", "Django", "PostgreSQL"], "experience_years": 3, "education": "MS in Software Engineering", "matches": ["PostgreSQL"], "match_percentage": 40}'::jsonb),
(3, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["Python", "Django"], "experience_years": 2, "education": "BS in Computer Science", "matches": ["Python", "Django"], "match_percentage": 80}'::jsonb),
(4, NULL, 'Sarah Williams', 'sarah.w@example.com', '+1444444444', 'sarah_resume.pdf', 'application/pdf', '{"skills": ["Python", "TensorFlow", "SQL"], "experience_years": 6, "education": "PhD in Data Science", "matches": ["Python", "TensorFlow", "SQL"], "match_percentage": 95}'::jsonb),
(5, NULL, 'David Brown', 'david.brown@example.com', '+1333333333', 'david_resume.pdf', 'application/pdf', '{"skills": ["Product Strategy", "Agile", "Analytics"], "experience_years": 4, "education": "MBA in Business Administration", "matches": ["Product Strategy", "Agle", "Analytics"], "match_percentage": 100}'::jsonb),
(2, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["React", "JavaScript"], "experience_years": 3, "education": "BS in Computer Science", "matches": ["React", "JavaScript"], "match_percentage": 70}'::jsonb);

-- ============================================
-- SOLUTION 2: Use existing job IDs from your database
-- ============================================
-- If your jobs have different IDs, replace 1,2,3,4,5 with actual job IDs

-- First, get your actual job IDs:
SELECT id, title FROM jobs LIMIT 5;

-- Then use those IDs in the INSERT below (replace JOB_ID_1, JOB_ID_2, etc.):

INSERT INTO applications (job_id, user_id, name, email, phone, resume_filename, resume_mime, ai_parsed_data) VALUES
-- Replace JOB_ID_1, JOB_ID_2, etc. with actual job IDs from above query
(1, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["JavaScript", "React", "Node.js"], "experience_years": 5, "education": "BS in Computer Science", "matches": ["JavaScript", "React", "Node.js"], "match_percentage": 85}'::jsonb);

-- ============================================
-- SOLUTION 3: Insert one at a time to find the problem
-- ============================================
-- Insert applications one by one to identify which one fails

-- Test 1: Check if job_id=1 exists
SELECT id FROM jobs WHERE id = 1;

-- If job_id=1 exists, try inserting:
INSERT INTO applications (job_id, user_id, name, email, phone, resume_filename, resume_mime, ai_parsed_data) 
VALUES (1, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["JavaScript", "React"], "experience_years": 5, "match_percentage": 85}'::jsonb);

-- If this works, continue with the rest one by one

-- ============================================
-- SOLUTION 4: Check UNIQUE constraint issue
-- ============================================
-- The UNIQUE(user_id, job_id) constraint might be causing issues
-- Check if you're trying to insert duplicate (user_id, job_id) combinations

-- Check existing applications:
SELECT job_id, user_id, name, email FROM applications;

-- If you see duplicates, that's the issue - you can't have same (user_id, job_id) twice
-- Even with NULL user_id, if job_id is the same, it might conflict

-- ============================================
-- SOLUTION 5: Insert with different job_ids to avoid UNIQUE constraint
-- ============================================
-- Make sure each (job_id, user_id) combination is unique
-- Since user_id is NULL, make sure job_ids are different for each row

INSERT INTO applications (job_id, user_id, name, email, phone, resume_filename, resume_mime, ai_parsed_data) VALUES
(1, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["JavaScript", "React", "Node.js"], "experience_years": 5, "education": "BS in Computer Science", "matches": ["JavaScript", "React", "Node.js"], "match_percentage": 85}'::jsonb),
(2, NULL, 'Jane Smith', 'jane.smith@example.com', '+1987654321', 'jane_resume.pdf', 'application/pdf', '{"skills": ["React", "TypeScript", "CSS"], "experience_years": 4, "education": "BS in Computer Science", "matches": ["React", "TypeScript", "CSS"], "match_percentage": 90}'::jsonb),
(3, NULL, 'Mike Johnson', 'mike.j@example.com', '+1555555555', 'mike_resume.pdf', 'application/pdf', '{"skills": ["Python", "Django", "PostgreSQL"], "experience_years": 3, "education": "MS in Software Engineering", "matches": ["PostgreSQL"], "match_percentage": 40}'::jsonb),
(4, NULL, 'Sarah Williams', 'sarah.w@example.com', '+1444444444', 'sarah_resume.pdf', 'application/pdf', '{"skills": ["Python", "TensorFlow", "SQL"], "experience_years": 6, "education": "PhD in Data Science", "matches": ["Python", "TensorFlow", "SQL"], "match_percentage": 95}'::jsonb),
(5, NULL, 'David Brown', 'david.brown@example.com', '+1333333333', 'david_resume.pdf', 'application/pdf', '{"skills": ["Product Strategy", "Agile", "Analytics"], "experience_years": 4, "education": "MBA in Business Administration", "matches": ["Product Strategy", "Agile", "Analytics"], "match_percentage": 100}'::jsonb);

-- Note: Removed duplicate job_id=1 and job_id=2 entries to avoid UNIQUE constraint issues

-- ============================================
-- DIAGNOSTIC QUERIES
-- ============================================

-- Check what's in applications table
SELECT * FROM applications;

-- Check foreign key constraints
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'applications';

