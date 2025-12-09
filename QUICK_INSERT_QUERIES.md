# Quick INSERT Queries for Database

## How to Use These Queries

1. **Go to your Vercel Neon Dashboard**
2. **Open SQL Editor**
3. **Copy and paste these queries one by one**

---

## ⚠️ Important Notes

- **For Users & Admins**: Don't insert directly! Use API endpoints instead:
  - `POST /api/admin/register` 
  - `POST /api/users/register`
  - (Passwords need bcrypt hashing which the API handles)

- **For Jobs, Applicants, Applications**: You can use these INSERT queries OR the API endpoints

---

## 1. INSERT JOBS (10 Sample Jobs)

```sql
INSERT INTO jobs (title, company, description, required_skills, location, job_type, category, language) VALUES
('Senior Full Stack Developer', 'Tech Corp', 'We are looking for an experienced full stack developer.', ARRAY['JavaScript', 'Node.js', 'React', 'PostgreSQL', 'AWS'], 'Remote', 'Full-time', 'Engineering', 'English'),

('Frontend Developer', 'Web Solutions Inc', 'Join our frontend team to build beautiful user interfaces.', ARRAY['React', 'TypeScript', 'CSS', 'HTML'], 'New York', 'Full-time', 'Engineering', 'English'),

('Backend Engineer', 'Cloud Systems', 'Design and implement scalable backend systems.', ARRAY['Python', 'Django', 'PostgreSQL', 'Docker'], 'San Francisco', 'Part-time', 'Engineering', 'English'),

('Data Scientist', 'AI Innovations', 'Work on machine learning models and data analysis.', ARRAY['Python', 'TensorFlow', 'SQL', 'Statistics'], 'Remote', 'Full-time', 'Data Science', 'English'),

('Product Manager', 'StartupXYZ', 'Lead product development and strategy.', ARRAY['Product Strategy', 'Agile', 'Analytics'], 'Boston', 'Full-time', 'Product', 'English');
```

---

## 2. INSERT APPLICANTS (5 Sample Applicants)

```sql
INSERT INTO applicants (name, email, phone, skills, experience, education, resume_filename, resume_mime) VALUES
('Jane Smith', 'jane.smith@example.com', '+1234567890', ARRAY['JavaScript', 'React', 'Node.js'], '{"years": 5, "companies": ["Tech Corp"]}'::jsonb, 'BS in Computer Science', 'jane_resume.pdf', 'application/pdf'),

('Mike Johnson', 'mike.j@example.com', '+1987654321', ARRAY['Python', 'Django', 'AWS'], '{"years": 3, "companies": ["Cloud Systems"]}'::jsonb, 'MS in Software Engineering', 'mike_resume.pdf', 'application/pdf'),

('Sarah Williams', 'sarah.w@example.com', '+1555555555', ARRAY['React', 'TypeScript', 'CSS'], '{"years": 4, "companies": ["Design Studio"]}'::jsonb, 'BS in Computer Science', 'sarah_resume.pdf', 'application/pdf');
```

---

## 3. INSERT APPLICATIONS (After creating users and jobs via API)

**First, create users via API:**
```
POST /api/users/register
```

**Then insert applications:**
```sql
-- Make sure user_id=1 and job_id=1 exist first!
INSERT INTO applications (job_id, user_id, name, email, phone, ai_parsed_data) VALUES
(1, 1, 'John Doe', 'john.doe@example.com', '+1234567890', '{"skills": ["JavaScript", "React"], "experience_years": 5, "match_percentage": 85}'::jsonb),

(2, 1, 'John Doe', 'john.doe@example.com', '+1234567890', '{"skills": ["React", "TypeScript"], "experience_years": 3, "match_percentage": 70}'::jsonb);
```

---

## 4. Verify Your Data

```sql
-- Count all records
SELECT 'jobs' as table_name, COUNT(*) as count FROM jobs
UNION ALL
SELECT 'applicants', COUNT(*) FROM applicants
UNION ALL
SELECT 'applications', COUNT(*) FROM applications;

-- View all jobs
SELECT id, title, company, location FROM jobs;

-- View all applications with job info
SELECT 
    a.id,
    a.name,
    a.email,
    j.title as job_title,
    j.company as job_company
FROM applications a
LEFT JOIN jobs j ON a.job_id = j.id;
```

---

## 📝 Single Record Examples

### Insert One Job
```sql
INSERT INTO jobs (title, company, description, required_skills, location, job_type, category, language) 
VALUES (
    'Software Engineer', 
    'Tech Company', 
    'We are hiring a software engineer.', 
    ARRAY['JavaScript', 'React', 'Node.js'], 
    'Remote', 
    'Full-time', 
    'Engineering', 
    'English'
);
```

### Insert One Applicant
```sql
INSERT INTO applicants (name, email, phone, skills, experience, education) 
VALUES (
    'John Doe', 
    'john@example.com', 
    '+1234567890', 
    ARRAY['JavaScript', 'React'], 
    '{"years": 3, "companies": ["Tech Corp"]}'::jsonb, 
    'BS in Computer Science'
);
```

### Insert One Application
```sql
INSERT INTO applications (job_id, user_id, name, email, phone, ai_parsed_data) 
VALUES (
    1,  -- job_id (must exist)
    1,  -- user_id (must exist)
    'John Doe', 
    'john@example.com', 
    '+1234567890', 
    '{"skills": ["JavaScript"], "experience_years": 3}'::jsonb
);
```

---

## 🔄 Recommended Workflow

1. **Create Admin via API**: `POST /api/admin/register`
2. **Create Users via API**: `POST /api/users/register`
3. **Insert Jobs via SQL** (or use API: `POST /api/jobs`)
4. **Insert Applicants via SQL** (or use API: `POST /api/applicants`)
5. **Create Applications via API**: `POST /api/applications` (requires user login)

---

## ⚠️ Common Errors

**Error: Foreign key constraint**
- Make sure `job_id` exists in `jobs` table before inserting applications
- Make sure `user_id` exists in `users` table before inserting applications

**Error: Duplicate email**
- Email must be unique in `users` and `admin_users` tables

**Error: Invalid JSON**
- For `experience` and `ai_parsed_data`, use `::jsonb` cast
- Example: `'{"key": "value"}'::jsonb`

