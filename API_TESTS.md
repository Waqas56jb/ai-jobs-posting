# API Testing Guide - JobSpeedy AI Backend

## 🌐 Base URL
- **Local**: `http://localhost:5000`
- **Production**: `https://your-app.vercel.app`

**Replace `http://localhost:5000` with your actual base URL when testing**

---

## 🔐 1. ADMIN AUTHENTICATION

### 1.1 Admin Register

**Method:** `POST`

**URL:** `http://localhost:5000/api/admin/register`

**Headers:**
```
Content-Type: application/json
```

**JSON Body:**
```json
{
  "email": "admin@jobspeedy.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "message": "Admin registered successfully",
  "admin": {
    "id": 1,
    "email": "admin@jobspeedy.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 1.2 Admin Login

**Method:** `POST`

**URL:** `http://localhost:5000/api/admin/login`

**Headers:**
```
Content-Type: application/json
```

**JSON Body:**
```json
{
  "email": "admin@jobspeedy.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "message": "Admin logged in successfully",
  "admin": {
    "id": 1,
    "email": "admin@jobspeedy.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**💡 Save the token for admin requests!**

---

## 👤 2. USER AUTHENTICATION

### 2.1 User Register

**Method:** `POST`

**URL:** `http://localhost:5000/api/users/register`

**Headers:**
```
Content-Type: application/json
```

**JSON Body:**
```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "password": "User@123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2.2 User Login

**Method:** `POST`

**URL:** `http://localhost:5000/api/users/login`

**Headers:**
```
Content-Type: application/json
```

**JSON Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "User@123"
}
```

**Response:**
```json
{
  "message": "User logged in successfully",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**💡 Save the token for user requests!**

---

### 2.3 Get Current User Profile

**Method:** `GET`

**URL:** `http://localhost:5000/api/users/me`

**Headers:**
```
Authorization: Bearer YOUR_USER_TOKEN
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 💼 3. JOBS

### 3.1 Get All Jobs (Public)

**Method:** `GET`

**URL:** `http://localhost:5000/api/jobs`

**Query Parameters (Optional):**
- `location=Remote`
- `job_type=Full-time`
- `category=Engineering`
- `language=English`
- `search=developer`

**Example with filters:**
```
http://localhost:5000/api/jobs?location=Remote&job_type=Full-time&search=developer
```

**Response:**
```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Senior Full Stack Developer",
      "company": "Tech Corp",
      "description": "We are looking for an experienced developer...",
      "required_skills": ["JavaScript", "Node.js", "React"],
      "location": "Remote",
      "job_type": "Full-time",
      "category": "Engineering",
      "language": "English",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 3.2 Get Single Job (Public)

**Method:** `GET`

**URL:** `http://localhost:5000/api/jobs/1`

**Response:**
```json
{
  "job": {
    "id": 1,
    "title": "Senior Full Stack Developer",
    "company": "Tech Corp",
    "description": "Job description...",
    "required_skills": ["JavaScript", "Node.js", "React"],
    "location": "Remote",
    "job_type": "Full-time",
    "category": "Engineering",
    "language": "English",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3.3 Create Job (Admin Only)

**Method:** `POST`

**URL:** `http://localhost:5000/api/jobs`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**JSON Body:**
```json
{
  "title": "Senior Full Stack Developer",
  "company": "Tech Corp",
  "description": "We are looking for an experienced full stack developer to join our team. You will be working on cutting-edge projects using modern technologies.",
  "required_skills": ["JavaScript", "Node.js", "React", "PostgreSQL", "AWS"],
  "location": "Remote",
  "job_type": "Full-time",
  "category": "Engineering",
  "language": "English"
}
```

**Response:**
```json
{
  "message": "Job created successfully",
  "job": {
    "id": 1,
    "title": "Senior Full Stack Developer",
    "company": "Tech Corp",
    "description": "...",
    "required_skills": ["JavaScript", "Node.js", "React"],
    "location": "Remote",
    "job_type": "Full-time",
    "category": "Engineering",
    "language": "English",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3.4 Create Job - Example 2

**Method:** `POST`

**URL:** `http://localhost:5000/api/jobs`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**JSON Body:**
```json
{
  "title": "Frontend Developer",
  "company": "Web Solutions Inc",
  "description": "Join our frontend team to build beautiful user interfaces using React and TypeScript.",
  "required_skills": ["React", "TypeScript", "CSS", "HTML", "JavaScript"],
  "location": "New York",
  "job_type": "Full-time",
  "category": "Engineering",
  "language": "English"
}
```

---

### 3.5 Create Job - Example 3

**Method:** `POST`

**URL:** `http://localhost:5000/api/jobs`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**JSON Body:**
```json
{
  "title": "Backend Engineer",
  "company": "Cloud Systems",
  "description": "Design and implement scalable backend systems using Python and Django.",
  "required_skills": ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
  "location": "San Francisco",
  "job_type": "Part-time",
  "category": "Engineering",
  "language": "English"
}
```

---

### 3.6 Create Job - Example 4

**Method:** `POST`

**URL:** `http://localhost:5000/api/jobs`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**JSON Body:**
```json
{
  "title": "Data Scientist",
  "company": "AI Innovations",
  "description": "Work on machine learning models and data analysis to solve complex business problems.",
  "required_skills": ["Python", "TensorFlow", "SQL", "Statistics", "Machine Learning"],
  "location": "Remote",
  "job_type": "Full-time",
  "category": "Data Science",
  "language": "English"
}
```

---

### 3.7 Create Job - Example 5

**Method:** `POST`

**URL:** `http://localhost:5000/api/jobs`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**JSON Body:**
```json
{
  "title": "Product Manager",
  "company": "StartupXYZ",
  "description": "Lead product development and strategy for our innovative platform.",
  "required_skills": ["Product Strategy", "Agile", "Analytics", "User Research"],
  "location": "Boston",
  "job_type": "Full-time",
  "category": "Product",
  "language": "English"
}
```

---

### 3.8 Update Job (Admin Only)

**Method:** `PUT`

**URL:** `http://localhost:5000/api/jobs/1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**JSON Body:**
```json
{
  "title": "Senior Full Stack Developer (Updated)",
  "location": "Hybrid",
  "job_type": "Full-time"
}
```

**Response:**
```json
{
  "message": "Job updated successfully",
  "job": {
    "id": 1,
    "title": "Senior Full Stack Developer (Updated)",
    "location": "Hybrid",
    ...
  }
}
```

---

### 3.9 Delete Job (Admin Only)

**Method:** `DELETE`

**URL:** `http://localhost:5000/api/jobs/1`

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "message": "Job deleted successfully"
}
```

---

## 👥 4. APPLICANTS

### 4.1 Get All Applicants (Admin Only)

**Method:** `GET`

**URL:** `http://localhost:5000/api/applicants`

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "applicants": [
    {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "+1234567890",
      "skills": ["JavaScript", "React", "Node.js"],
      "experience": {
        "years": 5,
        "companies": ["Tech Corp"]
      },
      "education": "BS in Computer Science",
      "resume_filename": "resume.pdf",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 4.2 Get Single Applicant (Admin Only)

**Method:** `GET`

**URL:** `http://localhost:5000/api/applicants/1`

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "applicant": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+1234567890",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": {...},
    "education": "BS in Computer Science",
    "resume_filename": "resume.pdf",
    "resume_mime": "application/pdf",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4.3 Create Applicant (Public - Resume Parsing)

**Method:** `POST`

**URL:** `http://localhost:5000/api/applicants`

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data (multipart/form-data):**
- `name`: `Jane Smith`
- `email`: `jane.smith@example.com`
- `phone`: `+1234567890` (optional)
- `skills`: `["JavaScript", "React", "Node.js", "PostgreSQL"]` (JSON string)
- `experience`: `{"years": 5, "companies": ["Tech Corp", "Web Solutions"]}` (JSON string)
- `education`: `BS in Computer Science` (optional)
- `resume`: [Select File] (PDF, DOC, DOCX - optional)

**Or use JSON format (without file):**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+1234567890",
  "skills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
  "experience": {
    "years": 5,
    "companies": ["Tech Corp", "Web Solutions"],
    "positions": ["Junior Developer", "Senior Developer"]
  },
  "education": "BS in Computer Science from State University"
}
```

**Response:**
```json
{
  "message": "Applicant created successfully",
  "applicant": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+1234567890",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": {...},
    "education": "BS in Computer Science",
    "resume_filename": "resume.pdf",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4.4 Create Applicant - Example 2

**Method:** `POST`

**URL:** `http://localhost:5000/api/applicants`

**Headers:**
```
Content-Type: application/json
```

**JSON Body:**
```json
{
  "name": "Mike Johnson",
  "email": "mike.j@example.com",
  "phone": "+1987654321",
  "skills": ["Python", "Django", "AWS", "Docker"],
  "experience": {
    "years": 3,
    "companies": ["Cloud Systems"],
    "positions": ["Backend Developer"]
  },
  "education": "MS in Software Engineering"
}
```

---

## 📝 5. APPLICATIONS (Job Applications)

### 5.1 Get All Applications

**Method:** `GET`

**URL:** `http://localhost:5000/api/applications`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Note:** Admin sees all applications, User sees only their own

**Response (Admin):**
```json
{
  "applications": [
    {
      "id": 1,
      "job_id": 1,
      "user_id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "resume_filename": "resume.pdf",
      "ai_parsed_data": {
        "skills": ["JavaScript", "React"],
        "experience_years": 5
      },
      "created_at": "2024-01-01T00:00:00.000Z",
      "job_title": "Senior Full Stack Developer",
      "job_company": "Tech Corp",
      "user_name": "John Doe"
    }
  ],
  "count": 1
}
```

---

### 5.2 Get Applications for a Specific Job (Admin Only)

**Method:** `GET`

**URL:** `http://localhost:5000/api/jobs/1/applications`

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "applications": [
    {
      "id": 1,
      "job_id": 1,
      "user_id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "resume_filename": "resume.pdf",
      "ai_parsed_data": {...},
      "created_at": "2024-01-01T00:00:00.000Z",
      "job_title": "Senior Full Stack Developer",
      "job_company": "Tech Corp",
      "user_name": "John Doe"
    }
  ],
  "count": 1
}
```

---

### 5.3 Get Single Application

**Method:** `GET`

**URL:** `http://localhost:5000/api/applications/1`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "application": {
    "id": 1,
    "job_id": 1,
    "user_id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "resume_filename": "resume.pdf",
    "ai_parsed_data": {
      "skills": ["JavaScript", "React", "Node.js"],
      "experience_years": 5,
      "education": "BS in Computer Science",
      "matches": ["JavaScript", "React", "Node.js"]
    },
    "created_at": "2024-01-01T00:00:00.000Z",
    "job_title": "Senior Full Stack Developer",
    "job_company": "Tech Corp"
  }
}
```

---

### 5.4 Create Application (User Only)

**Method:** `POST`

**URL:** `http://localhost:5000/api/applications`

**Headers:**
```
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: multipart/form-data
```

**Form Data (multipart/form-data):**
- `job_id`: `1`
- `phone`: `+1234567890` (optional)
- `resume`: [Select File] (optional)
- `ai_parsed_data`: `{"skills": ["JavaScript", "React"], "experience_years": 5}` (JSON string, optional)

**Or use JSON format (without file):**
```json
{
  "job_id": 1,
  "phone": "+1234567890",
  "ai_parsed_data": {
    "skills": ["JavaScript", "React", "Node.js"],
    "experience_years": 5,
    "education": "BS in Computer Science",
    "matches": ["JavaScript", "React", "Node.js"]
  }
}
```

**Response:**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "id": 1,
    "job_id": 1,
    "user_id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "resume_filename": "resume.pdf",
    "ai_parsed_data": {...},
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5.5 Create Application - Example 2

**Method:** `POST`

**URL:** `http://localhost:5000/api/applications`

**Headers:**
```
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: application/json
```

**JSON Body:**
```json
{
  "job_id": 2,
  "phone": "+1987654321",
  "ai_parsed_data": {
    "skills": ["Python", "Django"],
    "experience_years": 3,
    "matches": ["Python", "Django"]
  }
}
```

---

### 5.6 Update Application

**Method:** `PUT`

**URL:** `http://localhost:5000/api/applications/1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

**JSON Body:**
```json
{
  "phone": "+1111111111",
  "ai_parsed_data": {
    "skills": ["JavaScript", "React", "TypeScript"],
    "experience_years": 6
  }
}
```

**Response:**
```json
{
  "message": "Application updated successfully",
  "application": {
    "id": 1,
    "phone": "+1111111111",
    "ai_parsed_data": {...},
    ...
  }
}
```

---

### 5.7 Delete Application

**Method:** `DELETE`

**URL:** `http://localhost:5000/api/applications/1`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "message": "Application deleted successfully"
}
```

---

## 🏥 6. HEALTH CHECK

### Health Check

**Method:** `GET`

**URL:** `http://localhost:5000/api/health`

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Root Endpoint

**Method:** `GET`

**URL:** `http://localhost:5000/`

**Response:**
```json
{
  "message": "JobSpeedy AI Backend API",
  "version": "1.0.0",
  "endpoints": {
    "auth": {
      "admin": ["/api/admin/register", "/api/admin/login"],
      "user": ["/api/users/register", "/api/users/login", "/api/users/me"]
    },
    "jobs": ["/api/jobs", "/api/jobs/:id"],
    "applicants": ["/api/applicants", "/api/applicants/:id"],
    "applications": ["/api/applications", "/api/applications/:id", "/api/jobs/:jobId/applications"]
  }
}
```

---

## 📋 Quick Testing Sequence

1. **Check Health**
   - `GET http://localhost:5000/api/health`

2. **Register Admin**
   - `POST http://localhost:5000/api/admin/register`
   - Save the token

3. **Login Admin**
   - `POST http://localhost:5000/api/admin/login`
   - Save the token

4. **Create Jobs (as Admin)**
   - `POST http://localhost:5000/api/jobs` (use admin token)
   - Create 3-5 jobs

5. **Register User**
   - `POST http://localhost:5000/api/users/register`
   - Save the token

6. **Login User**
   - `POST http://localhost:5000/api/users/login`
   - Save the token

7. **Get Jobs (Public)**
   - `GET http://localhost:5000/api/jobs`

8. **Create Application (as User)**
   - `POST http://localhost:5000/api/applications` (use user token)

9. **View Applications**
   - `GET http://localhost:5000/api/applications` (as user - see own)
   - `GET http://localhost:5000/api/applications` (as admin - see all)

---

## 🔑 Token Usage

After logging in, save the token and add it to the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example:**
If your token is `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`, add this header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚠️ Important Notes

- Replace `http://localhost:5000` with your actual base URL
- For production, use: `https://your-app.vercel.app`
- Tokens expire after 7 days
- File uploads have a 10MB limit
- Skills should be arrays: `["skill1", "skill2"]`
- Experience and ai_parsed_data should be JSON objects
- Use `multipart/form-data` for file uploads
- Use `application/json` for JSON-only requests

---

## 🚀 Ready to Test!

Start your server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

Then copy any URL and JSON body from above into your API client (Postman, Insomnia, etc.) and test!
