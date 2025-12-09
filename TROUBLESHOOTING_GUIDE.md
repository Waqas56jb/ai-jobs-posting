# Troubleshooting: Foreign Key Constraint Error

## 🔍 The Real Problem

The error occurs because:
1. **job_id doesn't exist** - The `job_id` values (1, 2, 3, 4, 5) must exist in the `jobs` table
2. **UNIQUE constraint** - The `UNIQUE(user_id, job_id)` constraint might be violated

---

## ✅ Step-by-Step Fix

### Step 1: Check if Jobs Exist

Run this query first:
```sql
SELECT id, title, company FROM jobs ORDER BY id;
```

**If this returns NO ROWS**, you need to create jobs first!

### Step 2: Create Jobs First (if they don't exist)

**Option A: Via API (Recommended)**
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/jobs
Headers: Authorization: Bearer ADMIN_TOKEN
Body: {
  "title": "Senior Developer",
  "company": "Tech Corp",
  "description": "Job description...",
  "required_skills": ["JavaScript", "React"],
  "location": "Remote",
  "job_type": "Full-time",
  "category": "Engineering",
  "language": "English"
}
```

**Option B: Via SQL**
```sql
INSERT INTO jobs (title, company, description, required_skills, location, job_type, category, language) 
VALUES 
('Senior Full Stack Developer', 'Tech Corp', 'Job description...', ARRAY['JavaScript', 'React'], 'Remote', 'Full-time', 'Engineering', 'English'),
('Frontend Developer', 'Web Solutions', 'Job description...', ARRAY['React', 'TypeScript'], 'New York', 'Full-time', 'Engineering', 'English'),
('Backend Engineer', 'Cloud Systems', 'Job description...', ARRAY['Python', 'Django'], 'San Francisco', 'Part-time', 'Engineering', 'English'),
('Data Scientist', 'AI Innovations', 'Job description...', ARRAY['Python', 'TensorFlow'], 'Remote', 'Full-time', 'Data Science', 'English'),
('Product Manager', 'StartupXYZ', 'Job description...', ARRAY['Product Strategy', 'Agile'], 'Boston', 'Full-time', 'Product', 'English');
```

### Step 3: Verify Job IDs

After creating jobs, check their IDs:
```sql
SELECT id, title FROM jobs ORDER BY id;
```

**Note the actual job IDs** - they might not be 1, 2, 3, 4, 5!

### Step 4: Insert Applications with Correct Job IDs

Use the **actual job IDs** from Step 3:

```sql
-- Replace 1, 2, 3, 4, 5 with your actual job IDs
INSERT INTO applications (job_id, user_id, name, email, phone, resume_filename, resume_mime, ai_parsed_data) VALUES
(YOUR_JOB_ID_1, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["JavaScript", "React"], "experience_years": 5, "match_percentage": 85}'::jsonb),
(YOUR_JOB_ID_2, NULL, 'Jane Smith', 'jane.smith@example.com', '+1987654321', 'jane_resume.pdf', 'application/pdf', '{"skills": ["React", "TypeScript"], "experience_years": 4, "match_percentage": 90}'::jsonb);
```

---

## 🎯 Complete Working Example

### 1. First, create 5 jobs:
```sql
INSERT INTO jobs (title, company, description, required_skills, location, job_type, category, language) 
VALUES 
('Job 1', 'Company 1', 'Description 1', ARRAY['Skill1'], 'Remote', 'Full-time', 'Engineering', 'English'),
('Job 2', 'Company 2', 'Description 2', ARRAY['Skill2'], 'Remote', 'Full-time', 'Engineering', 'English'),
('Job 3', 'Company 3', 'Description 3', ARRAY['Skill3'], 'Remote', 'Full-time', 'Engineering', 'English'),
('Job 4', 'Company 4', 'Description 4', ARRAY['Skill4'], 'Remote', 'Full-time', 'Engineering', 'English'),
('Job 5', 'Company 5', 'Description 5', ARRAY['Skill5'], 'Remote', 'Full-time', 'Engineering', 'English');
```

### 2. Check the job IDs:
```sql
SELECT id, title FROM jobs;
```

### 3. Insert applications using those job IDs:
```sql
-- Use the actual IDs from step 2
INSERT INTO applications (job_id, user_id, name, email, phone, resume_filename, resume_mime, ai_parsed_data) VALUES
(1, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["JavaScript"], "experience_years": 5}'::jsonb),
(2, NULL, 'Jane Smith', 'jane.smith@example.com', '+1987654321', 'jane_resume.pdf', 'application/pdf', '{"skills": ["React"], "experience_years": 4}'::jsonb),
(3, NULL, 'Mike Johnson', 'mike.j@example.com', '+1555555555', 'mike_resume.pdf', 'application/pdf', '{"skills": ["Python"], "experience_years": 3}'::jsonb),
(4, NULL, 'Sarah Williams', 'sarah.w@example.com', '+1444444444', 'sarah_resume.pdf', 'application/pdf', '{"skills": ["TensorFlow"], "experience_years": 6}'::jsonb),
(5, NULL, 'David Brown', 'david.brown@example.com', '+1333333333', 'david_resume.pdf', 'application/pdf', '{"skills": ["Product Strategy"], "experience_years": 4}'::jsonb);
```

---

## 🔧 Alternative: Insert One at a Time

If bulk insert fails, try one at a time to find the problem:

```sql
-- Test 1
INSERT INTO applications (job_id, user_id, name, email, phone, resume_filename, resume_mime, ai_parsed_data) 
VALUES (1, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"test": "data"}'::jsonb);

-- If this works, continue with the next one
-- If this fails, check if job_id=1 exists
```

---

## ❓ Common Questions

**Q: Why can't I use NULL for user_id?**  
A: You CAN use NULL. The error is likely because `job_id` doesn't exist.

**Q: How do I know which job_id to use?**  
A: Run `SELECT id, title FROM jobs;` to see all available job IDs.

**Q: Can I insert without checking?**  
A: No, you must ensure `job_id` exists in the `jobs` table first.

---

## ✅ Quick Checklist

- [ ] Jobs table has at least 5 jobs
- [ ] I know the actual job IDs (not assuming 1,2,3,4,5)
- [ ] I'm using NULL for user_id (or valid user IDs)
- [ ] Each (job_id, user_id) combination is unique
- [ ] I've verified jobs exist: `SELECT * FROM jobs;`

---

## 🚀 Recommended Workflow

1. **Create jobs via API** (easiest way)
2. **Check job IDs**: `SELECT id, title FROM jobs;`
3. **Insert applications** using those job IDs
4. **Verify**: `SELECT * FROM applications;`


