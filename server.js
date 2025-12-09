const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();
// Lazy import to keep CommonJS; avoids ESM import issues on Vercel
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

// Test database connection
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Configure multer for file uploads (in-memory storage for serverless)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-access-token'];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Middleware to verify admin token
const verifyAdmin = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      const result = await pool.query('SELECT id FROM admin_users WHERE id = $1', [req.user.id]);
      if (result.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      }
      req.adminId = req.user.id;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying admin access' });
  }
};

// ============================================
// ADMIN AUTHENTICATION APIs
// ============================================

// Parse Resume via OpenAI (Public - text only, keeps key server-side)
app.post('/api/parse-resume', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('parse-resume error: OPENAI_API_KEY missing');
      return res.status(500).json({ error: 'OPENAI_API_KEY missing on server' });
    }
    console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY, process.env.OPENAI_API_KEY?.slice(0, 8));

    const { text = '', filename = 'resume.txt' } = req.body || {};
    if (!text.trim()) {
      return res.status(400).json({ error: 'Missing resume text' });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a precise resume parser. Extract ONLY information that appears EXACTLY in the provided resume text.

STRICT RULES - VIOLATION RESULTS IN INVALID RESPONSE:
- ONLY extract skills that appear VERBATIM in the resume text
- DO NOT add, assume, or infer any skills not explicitly written in the text
- If no skills are explicitly mentioned, return an empty skills array []
- Extract work experience ONLY if job titles, companies, and descriptions are clearly stated
- Extract education ONLY if degrees/institutions are explicitly mentioned
- DO NOT hallucinate or add any information not present in the text

Return ONLY valid JSON:
{
  "skills": ["skill1", "skill2"],
  "experience": [
    { "role": "Job Title", "company": "Company Name", "years": 5, "description": "Details" }
  ],
  "education": "Degree and Institution details"
}`,
          },
          {
            role: 'user',
            content: `Parse this resume text and extract ONLY information explicitly mentioned:

Filename: ${filename}

${text.substring(0, 8000)}

Extract:
1. Skills explicitly mentioned
2. Work experience entries clearly described
3. Education details if mentioned

Return JSON with only the information found in the text above.`,
          },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err?.error?.message || `OpenAI API error: ${response.status}`;
      return res.status(502).json({ error: msg });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      const m = content.match(/\{[\s\S]*\}/);
      if (!m) {
        throw new Error('Could not parse OpenAI response');
      }
      parsed = JSON.parse(m[0]);
    }

    if (!Array.isArray(parsed.skills)) parsed.skills = [];
    if (!Array.isArray(parsed.experience)) parsed.experience = [];
    if (typeof parsed.education !== 'string') parsed.education = '';

    return res.json({
      skills: parsed.skills,
      experience: parsed.experience,
      education: parsed.education,
    });
  } catch (error) {
    console.error('parse-resume error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Admin Register
app.post('/api/admin/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if admin already exists
    const existingAdmin = await pool.query('SELECT id FROM admin_users WHERE email = $1', [email]);
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert admin
    const result = await pool.query(
      'INSERT INTO admin_users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, passwordHash]
    );

    const token = jwt.sign({ id: result.rows[0].id, email: result.rows[0].email, role: 'admin' }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        created_at: result.rows[0].created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Admin register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find admin
    const result = await pool.query('SELECT id, email, password_hash FROM admin_users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Admin logged in successfully',
      admin: {
        id: admin.id,
        email: admin.email,
      },
      token,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// USER AUTHENTICATION APIs
// ============================================

// User Register
app.post('/api/users/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email, created_at',
      [full_name, email, passwordHash]
    );

    const token = jwt.sign(
      { id: result.rows[0].id, email: result.rows[0].email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.rows[0].id,
        full_name: result.rows[0].full_name,
        email: result.rows[0].email,
        created_at: result.rows[0].created_at,
      },
      token,
    });
  } catch (error) {
    console.error('User register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query('SELECT id, full_name, email, password_hash FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, role: 'user' }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'User logged in successfully',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Current User Profile
app.get('/api/users/me', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query('SELECT id, full_name, email, created_at FROM users WHERE id = $1', [
      req.user.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// JOBS APIs
// ============================================

// Get All Jobs (Public)
app.get('/api/jobs', async (req, res) => {
  try {
    const { location, job_type, category, language, search } = req.query;
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (location) {
      query += ` AND location = $${paramCount}`;
      params.push(location);
      paramCount++;
    }

    if (job_type) {
      query += ` AND job_type = $${paramCount}`;
      params.push(job_type);
      paramCount++;
    }

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (language) {
      query += ` AND language = $${paramCount}`;
      params.push(language);
      paramCount++;
    }

    if (search) {
      query += ` AND (title ILIKE $${paramCount} OR company ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ jobs: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Single Job (Public)
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job: result.rows[0] });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Job (Admin only)
app.post('/api/jobs', verifyAdmin, async (req, res) => {
  try {
    const { title, company, description, required_skills, location, job_type, category, language } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({ error: 'Title, company, and description are required' });
    }

    const result = await pool.query(
      `INSERT INTO jobs (title, company, description, required_skills, location, job_type, category, language)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, company, description, required_skills || [], location, job_type, category, language]
    );

    res.status(201).json({
      message: 'Job created successfully',
      job: result.rows[0],
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Job (Admin only)
app.put('/api/jobs/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, description, required_skills, location, job_type, category, language } = req.body;

    // Check if job exists
    const existingJob = await pool.query('SELECT id FROM jobs WHERE id = $1', [id]);
    if (existingJob.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const result = await pool.query(
      `UPDATE jobs 
       SET title = COALESCE($1, title),
           company = COALESCE($2, company),
           description = COALESCE($3, description),
           required_skills = COALESCE($4, required_skills),
           location = COALESCE($5, location),
           job_type = COALESCE($6, job_type),
           category = COALESCE($7, category),
           language = COALESCE($8, language)
       WHERE id = $9
       RETURNING *`,
      [title, company, description, required_skills, location, job_type, category, language, id]
    );

    res.json({
      message: 'Job updated successfully',
      job: result.rows[0],
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Job (Admin only)
app.delete('/api/jobs/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if job exists
    const existingJob = await pool.query('SELECT id FROM jobs WHERE id = $1', [id]);
    if (existingJob.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await pool.query('DELETE FROM jobs WHERE id = $1', [id]);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// APPLICANTS APIs
// ============================================

// Get All Applicants (Admin only)
app.get('/api/applicants', verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, skills, experience, education, resume_filename, created_at FROM applicants ORDER BY created_at DESC'
    );
    res.json({ applicants: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Single Applicant (Admin only)
app.get('/api/applicants/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, email, phone, skills, experience, education, resume_filename, resume_mime, created_at FROM applicants WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    // Get resume data if needed
    const resumeResult = await pool.query('SELECT resume_data FROM applicants WHERE id = $1', [id]);
    const applicant = result.rows[0];
    
    if (resumeResult.rows[0]?.resume_data) {
      applicant.resume_data = resumeResult.rows[0].resume_data.toString('base64');
    }

    res.json({ applicant });
  } catch (error) {
    console.error('Get applicant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Applicant (Public - for resume parsing)
app.post('/api/applicants', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, skills, experience, education } = req.body;
    const file = req.file;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    let resumeData = null;
    let resumeFilename = null;
    let resumeMime = null;

    if (file) {
      resumeData = file.buffer;
      resumeFilename = file.originalname;
      resumeMime = file.mimetype;
    }

    const skillsArray = skills ? (Array.isArray(skills) ? skills : JSON.parse(skills)) : [];
    const experienceJson = experience ? (typeof experience === 'string' ? JSON.parse(experience) : experience) : null;

    const result = await pool.query(
      `INSERT INTO applicants (name, email, phone, skills, experience, education, resume_filename, resume_mime, resume_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, name, email, phone, skills, experience, education, resume_filename, created_at`,
      [name, email, phone, skillsArray, experienceJson, education, resumeFilename, resumeMime, resumeData]
    );

    res.status(201).json({
      message: 'Applicant created successfully',
      applicant: result.rows[0],
    });
  } catch (error) {
    console.error('Create applicant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// APPLICATIONS APIs (Job Applications)
// ============================================

// Get All Applications (Admin - all applications, User - own applications)
app.get('/api/applications', verifyToken, async (req, res) => {
  try {
    let result;

    if (req.user.role === 'admin') {
      // Admin can see all applications
      result = await pool.query(
        `SELECT a.id, a.job_id, a.user_id, a.name, a.email, a.phone, a.resume_filename, 
                a.ai_parsed_data, a.created_at, a.updated_at,
                j.title as job_title, j.company as job_company,
                u.full_name as user_name
         FROM applications a
         LEFT JOIN jobs j ON a.job_id = j.id
         LEFT JOIN users u ON a.user_id = u.id
         ORDER BY a.created_at DESC`
      );
    } else {
      // User can only see their own applications
      result = await pool.query(
        `SELECT a.id, a.job_id, a.user_id, a.name, a.email, a.phone, a.resume_filename,
                a.ai_parsed_data, a.created_at, a.updated_at,
                j.title as job_title, j.company as job_company
         FROM applications a
         LEFT JOIN jobs j ON a.job_id = j.id
         WHERE a.user_id = $1
         ORDER BY a.created_at DESC`,
        [req.user.id]
      );
    }

    res.json({ applications: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Applications for a Specific Job (Admin only)
app.get('/api/jobs/:jobId/applications', verifyAdmin, async (req, res) => {
  try {
    const { jobId } = req.params;

    const result = await pool.query(
      `SELECT a.id, a.job_id, a.user_id, a.name, a.email, a.phone, a.resume_filename,
              a.ai_parsed_data, a.created_at, a.updated_at,
              j.title as job_title, j.company as job_company,
              u.full_name as user_name
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       LEFT JOIN users u ON a.user_id = u.id
       WHERE a.job_id = $1
       ORDER BY a.created_at DESC`,
      [jobId]
    );

    res.json({ applications: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Single Application
app.get('/api/applications/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT a.*, j.title as job_title, j.company as job_company
       FROM applications a
       LEFT JOIN jobs j ON a.job_id = j.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = result.rows[0];

    // Check access permission
    if (req.user.role !== 'admin' && application.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get resume data if needed
    if (application.resume_data) {
      application.resume_data = application.resume_data.toString('base64');
    }

    res.json({ application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Application (User only)
app.post('/api/applications', verifyToken, upload.single('resume'), async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'Only regular users can create applications' });
    }

    const { job_id, name, email, phone, ai_parsed_data } = req.body;
    const file = req.file;

    if (!job_id) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    // Check if job exists
    const jobCheck = await pool.query('SELECT id FROM jobs WHERE id = $1', [job_id]);
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user already applied to this job
    const existingApplication = await pool.query(
      'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
      [req.user.id, job_id]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    let resumeData = null;
    let resumeFilename = null;
    let resumeMime = null;

    if (file) {
      resumeData = file.buffer;
      resumeFilename = file.originalname;
      resumeMime = file.mimetype;
    }

    // Get user details if name/email not provided
    let applicantName = name;
    let applicantEmail = email;

    if (!applicantName || !applicantEmail) {
      const userResult = await pool.query('SELECT full_name, email FROM users WHERE id = $1', [req.user.id]);
      if (userResult.rows.length > 0) {
        applicantName = applicantName || userResult.rows[0].full_name;
        applicantEmail = applicantEmail || userResult.rows[0].email;
      }
    }

    const aiParsedDataJson = ai_parsed_data
      ? typeof ai_parsed_data === 'string'
        ? JSON.parse(ai_parsed_data)
        : ai_parsed_data
      : null;

    const result = await pool.query(
      `INSERT INTO applications (job_id, user_id, name, email, phone, resume_filename, resume_mime, resume_data, ai_parsed_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, job_id, user_id, name, email, phone, resume_filename, ai_parsed_data, created_at`,
      [job_id, req.user.id, applicantName, applicantEmail, phone, resumeFilename, resumeMime, resumeData, aiParsedDataJson]
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      application: result.rows[0],
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Application (Admin can update any, User can update own)
app.put('/api/applications/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, ai_parsed_data } = req.body;

    // Check if application exists
    const existingApp = await pool.query('SELECT user_id FROM applications WHERE id = $1', [id]);
    if (existingApp.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check access permission
    if (req.user.role !== 'admin' && existingApp.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const aiParsedDataJson = ai_parsed_data
      ? typeof ai_parsed_data === 'string'
        ? JSON.parse(ai_parsed_data)
        : ai_parsed_data
      : null;

    const result = await pool.query(
      `UPDATE applications 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           ai_parsed_data = COALESCE($4, ai_parsed_data),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [name, email, phone, aiParsedDataJson, id]
    );

    res.json({
      message: 'Application updated successfully',
      application: result.rows[0],
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Application (Admin can delete any, User can delete own)
app.delete('/api/applications/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if application exists
    const existingApp = await pool.query('SELECT user_id FROM applications WHERE id = $1', [id]);
    if (existingApp.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check access permission
    if (req.user.role !== 'admin' && existingApp.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await pool.query('DELETE FROM applications WHERE id = $1', [id]);

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// HEALTH CHECK & ROOT
// ============================================

app.get('/', (req, res) => {
  res.json({
    message: 'JobSpeedy AI Backend API',
    version: '1.0.0',
    endpoints: {
      auth: {
        admin: ['/api/admin/register', '/api/admin/login'],
        user: ['/api/users/register', '/api/users/login', '/api/users/me'],
      },
      jobs: ['/api/jobs', '/api/jobs/:id'],
      applicants: ['/api/applicants', '/api/applicants/:id'],
      applications: ['/api/applications', '/api/applications/:id', '/api/jobs/:jobId/applications'],
    },
  });
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// For Vercel serverless
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

