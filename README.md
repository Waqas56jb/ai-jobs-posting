<<<<<<< HEAD
# JobSpeedy AI Backend API

A comprehensive backend API for JobSpeedy AI - a job portal with AI-powered resume parsing. Built with Node.js, Express, and PostgreSQL, designed for serverless deployment on Vercel.

## 🚀 Features

- **Admin Authentication**: Register and login for admin users
- **User Authentication**: Register and login for regular users
- **Jobs Management**: CRUD operations for job listings
- **Applicants Management**: Store and manage applicant data with resume parsing
- **Applications Management**: Handle job applications with file uploads
- **JWT Authentication**: Secure token-based authentication
- **File Upload**: Resume upload support using multer
- **Database**: PostgreSQL with Neon Postgres integration

## 📋 Prerequisites

- Node.js 18.x or higher
- PostgreSQL database (Vercel Neon Postgres)
- Vercel account (for deployment)

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Connection (Use from Vercel Neon)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
POSTGRES_URL=postgresql://user:password@host:port/database?sslmode=require

# JWT Secret Key (Use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port (for local development)
PORT=5000
```

### 3. Database Setup

Run the provided SQL schema in your Neon Postgres database. The schema includes:
- `admin_users` - Admin accounts
- `users` - Regular user accounts
- `jobs` - Job listings
- `applicants` - Applicant data with resume storage
- `applications` - Job applications

### 4. Local Development

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Base URL
- Local: `http://localhost:5000`
- Production: `https://your-app.vercel.app`

### Health Check

#### GET `/api/health`
Check API and database connection status.

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Admin Authentication

#### POST `/api/admin/register`
Register a new admin user.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Admin registered successfully",
  "admin": {
    "id": 1,
    "email": "admin@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### POST `/api/admin/login`
Login as admin.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Admin logged in successfully",
  "admin": {
    "id": 1,
    "email": "admin@example.com"
  },
  "token": "jwt_token_here"
}
```

---

### User Authentication

#### POST `/api/users/register`
Register a new user.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### POST `/api/users/login`
Login as user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### GET `/api/users/me`
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

---

### Jobs

#### GET `/api/jobs`
Get all jobs (public endpoint).

**Query Parameters:**
- `location` - Filter by location
- `job_type` - Filter by job type
- `category` - Filter by category
- `language` - Filter by language
- `search` - Search in title, company, or description

**Example:**
```
GET /api/jobs?location=Remote&job_type=Full-time&search=developer
```

#### GET `/api/jobs/:id`
Get a single job by ID (public endpoint).

#### POST `/api/jobs`
Create a new job (Admin only).

**Headers:**
```
Authorization: Bearer admin_jwt_token
```

**Request Body:**
```json
{
  "title": "Senior Developer",
  "company": "Tech Corp",
  "description": "Job description here...",
  "required_skills": ["JavaScript", "Node.js", "React"],
  "location": "Remote",
  "job_type": "Full-time",
  "category": "Engineering",
  "language": "English"
}
```

#### PUT `/api/jobs/:id`
Update a job (Admin only).

#### DELETE `/api/jobs/:id`
Delete a job (Admin only).

---

### Applicants

#### GET `/api/applicants`
Get all applicants (Admin only).

#### GET `/api/applicants/:id`
Get a single applicant by ID (Admin only).

#### POST `/api/applicants`
Create a new applicant (Public - for resume parsing).

**Request:** `multipart/form-data`

**Form Data:**
- `name` - Applicant name
- `email` - Applicant email
- `phone` - Phone number (optional)
- `skills` - JSON array of skills
- `experience` - JSON object with experience data
- `education` - Education details
- `resume` - Resume file (PDF, DOC, DOCX)

---

### Applications

#### GET `/api/applications`
Get all applications (Admin sees all, User sees own).

**Headers:**
```
Authorization: Bearer jwt_token
```

#### GET `/api/applications/:id`
Get a single application by ID.

#### GET `/api/jobs/:jobId/applications`
Get all applications for a specific job (Admin only).

#### POST `/api/applications`
Create a new application (User only).

**Headers:**
```
Authorization: Bearer user_jwt_token
```

**Request:** `multipart/form-data`

**Form Data:**
- `job_id` - Job ID (required)
- `name` - Applicant name (optional, uses user profile if not provided)
- `email` - Applicant email (optional, uses user profile if not provided)
- `phone` - Phone number (optional)
- `resume` - Resume file (optional)
- `ai_parsed_data` - AI parsed data as JSON (optional)

#### PUT `/api/applications/:id`
Update an application (Admin can update any, User can update own).

#### DELETE `/api/applications/:id`
Delete an application (Admin can delete any, User can delete own).

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

Tokens expire after 7 days.

---

## 🚀 Deployment on Vercel

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Set Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

- `DATABASE_URL` - Your Neon Postgres connection string
- `POSTGRES_URL` - Same as DATABASE_URL
- `JWT_SECRET` - A strong random secret key

Or use Vercel CLI:

```bash
vercel env add DATABASE_URL
vercel env add POSTGRES_URL
vercel env add JWT_SECRET
```

### Step 4: Deploy

```bash
vercel
```

For production deployment:

```bash
vercel --prod
```

### Step 5: Your API is Live!

Your API will be available at: `https://your-project-name.vercel.app`

---

## 📝 Environment Variables for Vercel

Add these environment variables in your Vercel project settings:

```
DATABASE_URL=postgresql://neondb_owner:npg_BlJYpceRI8i5@ep-lively-firefly-ah76r87n-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_URL=postgresql://neondb_owner:npg_BlJYpceRI8i5@ep-lively-firefly-ah76r87n-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

JWT_SECRET=your-strong-random-secret-key-here
```

---

## 🗄️ Database Schema

The database includes the following tables:

- **admin_users** - Admin user accounts
- **users** - Regular user accounts
- **jobs** - Job listings
- **applicants** - Applicant data with resume storage
- **applications** - Job applications linked to jobs and users

See your SQL schema file for detailed table structures.

---

## 📦 Project Structure

```
.
├── server.js          # Main Express server file
├── vercel.json        # Vercel configuration
├── package.json       # Dependencies and scripts
├── .gitignore        # Git ignore file
└── README.md         # This file
```

---

## 🔧 Technologies Used

- **Express.js** - Web framework
- **PostgreSQL** - Database (via Neon Postgres)
- **pg** - PostgreSQL client for Node.js
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

---

## 🐛 Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message here"
}
```

---

## 📄 License

ISC

---

## 🤝 Support

For issues and questions, please contact the development team.
=======
# Jobs
>>>>>>> e7a92c8bfb0ce08d566c934f23753657d4e293f3
