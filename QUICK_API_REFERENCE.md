# Quick API Reference - Copy & Paste Ready

## Base URL
- Local: `http://localhost:5000`
- Production: `https://your-app.vercel.app`

---

## 🔐 ADMIN AUTHENTICATION

### Admin Register
```
POST http://localhost:5000/api/admin/register
```
```json
{
  "email": "admin@jobspeedy.com",
  "password": "Admin@123"
}
```

### Admin Login
```
POST http://localhost:5000/api/admin/login
```
```json
{
  "email": "admin@jobspeedy.com",
  "password": "Admin@123"
}
```

---

## 👤 USER AUTHENTICATION

### User Register
```
POST http://localhost:5000/api/users/register
```
```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "password": "User@123"
}
```

### User Login
```
POST http://localhost:5000/api/users/login
```
```json
{
  "email": "john.doe@example.com",
  "password": "User@123"
}
```

### Get User Profile
```
GET http://localhost:5000/api/users/me
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## 💼 JOBS

### Get All Jobs
```
GET http://localhost:5000/api/jobs
```

### Get Single Job
```
GET http://localhost:5000/api/jobs/1
```

### Create Job (Admin)
```
POST http://localhost:5000/api/jobs
Headers: Authorization: Bearer ADMIN_TOKEN
```
```json
{
  "title": "Senior Full Stack Developer",
  "company": "Tech Corp",
  "description": "We are looking for an experienced developer...",
  "required_skills": ["JavaScript", "Node.js", "React"],
  "location": "Remote",
  "job_type": "Full-time",
  "category": "Engineering",
  "language": "English"
}
```

### Update Job (Admin)
```
PUT http://localhost:5000/api/jobs/1
Headers: Authorization: Bearer ADMIN_TOKEN
```
```json
{
  "title": "Updated Title",
  "location": "Hybrid"
}
```

### Delete Job (Admin)
```
DELETE http://localhost:5000/api/jobs/1
Headers: Authorization: Bearer ADMIN_TOKEN
```

---

## 📝 APPLICATIONS

### Get All Applications
```
GET http://localhost:5000/api/applications
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get Job Applications (Admin)
```
GET http://localhost:5000/api/jobs/1/applications
Headers: Authorization: Bearer ADMIN_TOKEN
```

### Create Application (User)
```
POST http://localhost:5000/api/applications
Headers: Authorization: Bearer USER_TOKEN
```
```json
{
  "job_id": 1,
  "phone": "+1234567890",
  "ai_parsed_data": {
    "skills": ["JavaScript", "React"],
    "experience_years": 5
  }
}
```

### Update Application
```
PUT http://localhost:5000/api/applications/1
Headers: Authorization: Bearer YOUR_TOKEN
```
```json
{
  "phone": "+1111111111"
}
```

### Delete Application
```
DELETE http://localhost:5000/api/applications/1
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## 👥 APPLICANTS

### Get All Applicants (Admin)
```
GET http://localhost:5000/api/applicants
Headers: Authorization: Bearer ADMIN_TOKEN
```

### Get Single Applicant (Admin)
```
GET http://localhost:5000/api/applicants/1
Headers: Authorization: Bearer ADMIN_TOKEN
```

### Create Applicant
```
POST http://localhost:5000/api/applicants
Content-Type: multipart/form-data or application/json
```
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+1234567890",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": {
    "years": 5,
    "companies": ["Tech Corp"]
  },
  "education": "BS in Computer Science"
}
```

---

## 🏥 HEALTH

### Health Check
```
GET http://localhost:5000/api/health
```

### Root
```
GET http://localhost:5000/
```

