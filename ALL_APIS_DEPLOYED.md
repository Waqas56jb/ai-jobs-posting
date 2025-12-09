# Complete API List - Deployed Backend

## 🌐 Base URL
**https://ai-jobs-posting-w5yb.vercel.app**

---

## 🔐 1. ADMIN AUTHENTICATION

### 1.1 Admin Register
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/admin/register
```
**Headers:**
```
Content-Type: application/json
```
**Body:**
```json
{
  "email": "admin@jobspeedy.com",
  "password": "Admin@123"
}
```

---

### 1.2 Admin Login
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/admin/login
```
**Headers:**
```
Content-Type: application/json
```
**Body:**
```json
{
  "email": "admin@jobspeedy.com",
  "password": "Admin@123"
}
```

---

## 👤 2. USER AUTHENTICATION

### 2.1 User Register
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/users/register
```
**Headers:**
```
Content-Type: application/json
```
**Body:**
```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "password": "User@123"
}
```

---

### 2.2 User Login
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/users/login
```
**Headers:**
```
Content-Type: application/json
```
**Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "User@123"
}
```

---

### 2.3 Get Current User Profile
```
GET https://ai-jobs-posting-w5yb.vercel.app/api/users/me
```
**Headers:**
```
Authorization: Bearer YOUR_USER_TOKEN
```

---

## 💼 3. JOBS

### 3.1 Get All Jobs (Public)
```
GET https://ai-jobs-posting-w5yb.vercel.app/api/jobs
```

**With Filters:**
```
GET https://ai-jobs-posting-w5yb.vercel.app/api/jobs?location=Remote&job_type=Full-time&search=developer
```

**Query Parameters:**
- `location` - Filter by location
- `job_type` - Filter by job type
- `category` - Filter by category
- `language` - Filter by language
- `search` - Search in title, company, description

---

### 3.2 Get Single Job (Public)
```
GET https://ai-jobs-posting-w5yb.vercel.app/api/jobs/1
```
Replace `1` with actual job ID

---

### 3.3 Create Job (Admin Only)
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/jobs
```
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```
**Body:**
```json
{
  "title": "Senior Full Stack Developer",
  "company": "Tech Corp",
  "description": "We are looking for an experienced full stack developer...",
  "required_skills": ["JavaScript", "Node.js", "React", "PostgreSQL", "AWS"],
  "location": "Remote",
  "job_type": "Full-time",
  "category": "Engineering",
  "language": "English"
}
```

---

### 3.4 Update Job (Admin Only)
```
PUT https://ai-jobs-posting-w5yb.vercel.app/api/jobs/1
```
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```
**Body:**
```json
{
  "title": "Updated Job Title",
  "location": "Hybrid",
  "job_type": "Full-time"
}
```

---

### 3.5 Delete Job (Admin Only)
```
DELETE https://ai-jobs-posting-w5yb.vercel.app/api/jobs/1
```
**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## 👥 4. APPLICANTS

### 4.1 Get All Applicants (Admin Only)
```
GET https://ai-jobs-posting-w5yb.vercel.app/api/applicants
```
**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

### 4.2 Get Single Applicant (Admin Only)
```
GET https://ai-jobs-posting-w5yb.vercel.app/api/applicants/1
```
**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

### 4.3 Create Applicant (Public - Resume Parsing)
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/applicants
```
**Headers:**
```
Content-Type: multipart/form-data
```
**Form Data:**
- `name`: `Jane Smith` (required)
- `email`: `jane.smith@example.com` (required)
- `phone`: `+1234567890` (optional)
- `skills`: `["JavaScript", "React", "Node.js"]` (JSON string, optional)
- `experience`: `{"years": 5, "companies": ["Tech Corp"]}` (JSON string, optional)
- `education`: `BS in Computer Science` (optional)
- `resume`: [File Upload] (optional)

**Or JSON format (without file):**
**Headers:**
```
Content-Type: application/json
```
**Body:**
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

## 📝 5. APPLICATIONS

### 5.1 Get All Applications
```
GET https://ai-jobs-posting-w5yb.vercel.app/api/applications
```
**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```
**Note:** Admin sees all, User sees only their own

---

### 5.2 Get Applications for a Specific Job (Admin Only)
```
GET https://ai-jobs-posting-w5yb.vercel.app/api/jobs/1/applications
```
**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```
Replace `1` with actual job ID

---

### 5.3 Get Single Application
```
GET https://ai-jobs-posting-w5yb.vercel.app/api/applications/1
```
**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

### 5.4 Create Application (User Only)
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/applications
```
**Headers:**
```
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: multipart/form-data
```
**Form Data:**
- `job_id`: `1` (required)
- `phone`: `+1234567890` (optional)
- `resume`: [File Upload] (optional)
- `ai_parsed_data`: `{"skills": ["JavaScript"], "experience_years": 5}` (JSON string, optional)

**Or JSON format (without file):**
**Headers:**
```
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: application/json
```
**Body:**
```json
{
  "job_id": 1,
  "phone": "+1234567890",
  "ai_parsed_data": {
    "skills": ["JavaScript", "React", "Node.js"],
    "experience_years": 5,
    "education": "BS in Computer Science",
    "matches": ["JavaScript", "React", "Node.js"],
    "match_percentage": 85
  }
}
```

---

### 5.5 Update Application
```
PUT https://ai-jobs-posting-w5yb.vercel.app/api/applications/1
```
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```
**Body:**
```json
{
  "phone": "+1111111111",
  "ai_parsed_data": {
    "skills": ["JavaScript", "React", "TypeScript"],
    "experience_years": 6
  }
}
```

---

### 5.6 Delete Application
```
DELETE https://ai-jobs-posting-w5yb.vercel.app/api/applications/1
```
**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

## 🏥 6. HEALTH & ROOT

### 6.1 Health Check
```
GET https://ai-jobs-posting-w5yb.vercel.app/api/health
```

---

### 6.2 Root Endpoint (API Info)
```
GET https://ai-jobs-posting-w5yb.vercel.app/
```

---

## 📋 Quick Reference Table

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/admin/register` | No | Register admin |
| POST | `/api/admin/login` | No | Login admin |
| POST | `/api/users/register` | No | Register user |
| POST | `/api/users/login` | No | Login user |
| GET | `/api/users/me` | User Token | Get user profile |
| GET | `/api/jobs` | No | Get all jobs |
| GET | `/api/jobs/:id` | No | Get single job |
| POST | `/api/jobs` | Admin Token | Create job |
| PUT | `/api/jobs/:id` | Admin Token | Update job |
| DELETE | `/api/jobs/:id` | Admin Token | Delete job |
| GET | `/api/applicants` | Admin Token | Get all applicants |
| GET | `/api/applicants/:id` | Admin Token | Get single applicant |
| POST | `/api/applicants` | No | Create applicant |
| GET | `/api/applications` | Token | Get applications |
| GET | `/api/jobs/:jobId/applications` | Admin Token | Get job applications |
| GET | `/api/applications/:id` | Token | Get single application |
| POST | `/api/applications` | User Token | Create application |
| PUT | `/api/applications/:id` | Token | Update application |
| DELETE | `/api/applications/:id` | Token | Delete application |
| GET | `/api/health` | No | Health check |
| GET | `/` | No | API info |

---

## 🔑 Authentication

For protected endpoints, add this header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**How to get token:**
1. Register/Login via `/api/admin/login` or `/api/users/login`
2. Copy the `token` from the response
3. Use it in `Authorization: Bearer TOKEN` header

---

## 📝 Example: Complete Flow

### 1. Register Admin
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/admin/register
Body: {"email": "admin@test.com", "password": "Admin@123"}
Response: { "token": "eyJhbGci..." }
```

### 2. Create Job (using admin token)
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/jobs
Headers: Authorization: Bearer eyJhbGci...
Body: {"title": "Developer", "company": "Tech Corp", "description": "..."}
```

### 3. Register User
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/users/register
Body: {"full_name": "John Doe", "email": "john@test.com", "password": "User@123"}
Response: { "token": "eyJhbGci..." }
```

### 4. Create Application (using user token)
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/applications
Headers: Authorization: Bearer eyJhbGci...
Body: {"job_id": 1, "phone": "+1234567890"}
```

### 5. Get All Applications (as admin)
```
GET https://ai-jobs-posting-w5yb.vercel.app/api/applications
Headers: Authorization: Bearer ADMIN_TOKEN
```

---

## 🧪 Testing in Browser

You can test GET endpoints directly in browser:
- https://ai-jobs-posting-w5yb.vercel.app/
- https://ai-jobs-posting-w5yb.vercel.app/api/health
- https://ai-jobs-posting-w5yb.vercel.app/api/jobs

---

## 📱 For Frontend Integration

**Base URL constant:**
```javascript
const API_BASE_URL = 'https://ai-jobs-posting-w5yb.vercel.app';
```

**Example fetch:**
```javascript
// Get all jobs
fetch(`${API_BASE_URL}/api/jobs`)
  .then(res => res.json())
  .then(data => console.log(data));

// Create job (with auth)
fetch(`${API_BASE_URL}/api/jobs`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    title: "Developer",
    company: "Tech Corp",
    description: "..."
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## ✅ All Endpoints Summary

1. `POST /api/admin/register` - Admin register
2. `POST /api/admin/login` - Admin login
3. `POST /api/users/register` - User register
4. `POST /api/users/login` - User login
5. `GET /api/users/me` - Get user profile
6. `GET /api/jobs` - Get all jobs
7. `GET /api/jobs/:id` - Get single job
8. `POST /api/jobs` - Create job (Admin)
9. `PUT /api/jobs/:id` - Update job (Admin)
10. `DELETE /api/jobs/:id` - Delete job (Admin)
11. `GET /api/applicants` - Get all applicants (Admin)
12. `GET /api/applicants/:id` - Get single applicant (Admin)
13. `POST /api/applicants` - Create applicant
14. `GET /api/applications` - Get applications
15. `GET /api/jobs/:jobId/applications` - Get job applications (Admin)
16. `GET /api/applications/:id` - Get single application
17. `POST /api/applications` - Create application (User)
18. `PUT /api/applications/:id` - Update application
19. `DELETE /api/applications/:id` - Delete application
20. `GET /api/health` - Health check
21. `GET /` - Root/API info

**Total: 21 API Endpoints**

