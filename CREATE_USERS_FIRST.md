# How to Fix: Foreign Key Constraint Error

## ❌ Error You're Getting:
```
ERROR: insert or update on table "applications" violates foreign key constraint "applications_user_id_fkey"
```

## 🔍 Why This Happens:
The `applications` table has a foreign key that requires `user_id` to exist in the `users` table. You're trying to insert applications with `user_id` values (1, 2, 3, 4, 5) that don't exist yet.

---

## ✅ Solution: Create Users First

### Step 1: Check What Users Exist

Run this in your Neon SQL Editor:
```sql
SELECT id, full_name, email FROM users ORDER BY id;
```

### Step 2: Create Users via API (RECOMMENDED)

Use these API calls to create users with working passwords:

**User 1:**
```bash
POST https://ai-jobs-posting-w5yb.vercel.app/api/users/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "password": "User@123"
}
```

**User 2:**
```bash
POST https://ai-jobs-posting-w5yb.vercel.app/api/users/register
Content-Type: application/json

{
  "full_name": "Jane Smith",
  "email": "jane.smith@example.com",
  "password": "User@123"
}
```

**User 3:**
```bash
POST https://ai-jobs-posting-w5yb.vercel.app/api/users/register
Content-Type: application/json

{
  "full_name": "Mike Johnson",
  "email": "mike.j@example.com",
  "password": "User@123"
}
```

**User 4:**
```bash
POST https://ai-jobs-posting-w5yb.vercel.app/api/users/register
Content-Type: application/json

{
  "full_name": "Sarah Williams",
  "email": "sarah.w@example.com",
  "password": "User@123"
}
```

**User 5:**
```bash
POST https://ai-jobs-posting-w5yb.vercel.app/api/users/register
Content-Type: application/json

{
  "full_name": "David Brown",
  "email": "david.brown@example.com",
  "password": "User@123"
}
```

### Step 3: Check the User IDs

After creating users, check their IDs:
```sql
SELECT id, full_name, email FROM users ORDER BY id;
```

### Step 4: Insert Applications with Correct User IDs

Now use the actual user IDs from Step 3 in your INSERT query. For example, if the IDs are 1, 2, 3, 4, 5, use:

```sql
INSERT INTO applications (job_id, user_id, name, email, phone, resume_filename, resume_mime, ai_parsed_data) VALUES
(1, 1, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["JavaScript", "React", "Node.js"], "experience_years": 5, "education": "BS in Computer Science", "matches": ["JavaScript", "React", "Node.js"], "match_percentage": 85}'::jsonb),
(2, 2, 'Jane Smith', 'jane.smith@example.com', '+1987654321', 'jane_resume.pdf', 'application/pdf', '{"skills": ["React", "TypeScript", "CSS"], "experience_years": 4, "education": "BS in Computer Science", "matches": ["React", "TypeScript", "CSS"], "match_percentage": 90}'::jsonb),
(1, 3, 'Mike Johnson', 'mike.j@example.com', '+1555555555', 'mike_resume.pdf', 'application/pdf', '{"skills": ["Python", "Django", "PostgreSQL"], "experience_years": 3, "education": "MS in Software Engineering", "matches": ["PostgreSQL"], "match_percentage": 40}'::jsonb),
(3, 1, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["Python", "Django"], "experience_years": 2, "education": "BS in Computer Science", "matches": ["Python", "Django"], "match_percentage": 80}'::jsonb),
(4, 4, 'Sarah Williams', 'sarah.w@example.com', '+1444444444', 'sarah_resume.pdf', 'application/pdf', '{"skills": ["Python", "TensorFlow", "SQL"], "experience_years": 6, "education": "PhD in Data Science", "matches": ["Python", "TensorFlow", "SQL"], "match_percentage": 95}'::jsonb),
(5, 5, 'David Brown', 'david.brown@example.com', '+1333333333', 'david_resume.pdf', 'application/pdf', '{"skills": ["Product Strategy", "Agile", "Analytics"], "experience_years": 4, "education": "MBA in Business Administration", "matches": ["Product Strategy", "Agile", "Analytics"], "match_percentage": 100}'::jsonb),
(2, 1, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["React", "JavaScript"], "experience_years": 3, "education": "BS in Computer Science", "matches": ["React", "JavaScript"], "match_percentage": 70}'::jsonb);
```

---

## 🔄 Alternative: Insert Applications WITHOUT user_id

If you don't want to link applications to users, set `user_id` to `NULL`:

```sql
INSERT INTO applications (job_id, user_id, name, email, phone, resume_filename, resume_mime, ai_parsed_data) VALUES
(1, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["JavaScript", "React", "Node.js"], "experience_years": 5, "education": "BS in Computer Science", "matches": ["JavaScript", "React", "Node.js"], "match_percentage": 85}'::jsonb),
(2, NULL, 'Jane Smith', 'jane.smith@example.com', '+1987654321', 'jane_resume.pdf', 'application/pdf', '{"skills": ["React", "TypeScript", "CSS"], "experience_years": 4, "education": "BS in Computer Science", "matches": ["React", "TypeScript", "CSS"], "match_percentage": 90}'::jsonb),
(1, NULL, 'Mike Johnson', 'mike.j@example.com', '+1555555555', 'mike_resume.pdf', 'application/pdf', '{"skills": ["Python", "Django", "PostgreSQL"], "experience_years": 3, "education": "MS in Software Engineering", "matches": ["PostgreSQL"], "match_percentage": 40}'::jsonb),
(3, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["Python", "Django"], "experience_years": 2, "education": "BS in Computer Science", "matches": ["Python", "Django"], "match_percentage": 80}'::jsonb),
(4, NULL, 'Sarah Williams', 'sarah.w@example.com', '+1444444444', 'sarah_resume.pdf', 'application/pdf', '{"skills": ["Python", "TensorFlow", "SQL"], "experience_years": 6, "education": "PhD in Data Science", "matches": ["Python", "TensorFlow", "SQL"], "match_percentage": 95}'::jsonb),
(5, NULL, 'David Brown', 'david.brown@example.com', '+1333333333', 'david_resume.pdf', 'application/pdf', '{"skills": ["Product Strategy", "Agile", "Analytics"], "experience_years": 4, "education": "MBA in Business Administration", "matches": ["Product Strategy", "Agile", "Analytics"], "match_percentage": 100}'::jsonb),
(2, NULL, 'John Doe', 'john.doe@example.com', '+1234567890', 'john_resume.pdf', 'application/pdf', '{"skills": ["React", "JavaScript"], "experience_years": 3, "education": "BS in Computer Science", "matches": ["React", "JavaScript"], "match_percentage": 70}'::jsonb);
```

---

## ✅ Quick Fix Summary

1. **Create users via API** (5 users)
2. **Check user IDs**: `SELECT id, email FROM users;`
3. **Use those IDs** in your applications INSERT query
4. **OR** use `user_id = NULL` if you don't want to link to users

---

## 🧪 Verify Everything Works

After inserting, verify:
```sql
-- Check applications were inserted
SELECT COUNT(*) FROM applications;

-- Check applications with user info
SELECT 
    a.id,
    a.name,
    a.email,
    u.full_name as user_name,
    j.title as job_title
FROM applications a
LEFT JOIN users u ON a.user_id = u.id
LEFT JOIN jobs j ON a.job_id = j.id;
```


