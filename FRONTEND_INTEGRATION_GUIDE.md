# Frontend Integration Guide - Application Submission

## 📝 Your Application Form Data

Based on your form:
- **Job**: Data Scientist — AI Innovations
- **Full Name**: rana waqas naveed
- **Email**: waqas@gmail.com
- **Phone**: +49 123 456 789
- **Resume**: PDF file uploaded

---

## 🚀 API Endpoint for Application Submission

### Option 1: With Resume File (multipart/form-data)

**Endpoint:**
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/applications
```

**Headers:**
```
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: multipart/form-data
```

**Form Data:**
```
job_id: [ID of "Data Scientist — AI Innovations" job]
name: rana waqas naveed
email: waqas@gmail.com
phone: +49 123 456 789
resume: [PDF file]
ai_parsed_data: {"skills": [], "experience_years": 0, "role": "Unknown Role", "match_percentage": 0}
```

---

### Option 2: JSON Format (without file, or file uploaded separately)

**Endpoint:**
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/applications
```

**Headers:**
```
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "job_id": 4,
  "name": "rana waqas naveed",
  "email": "waqas@gmail.com",
  "phone": "+49 123 456 789",
  "ai_parsed_data": {
    "skills": [],
    "experience_years": 0,
    "role": "Unknown Role",
    "match_percentage": 0,
    "education": "",
    "matches": []
  }
}
```

---

## 📋 Step-by-Step Integration

### Step 1: User Must Be Logged In

First, the user needs to login to get a token:

```javascript
// Login first
const loginResponse = await fetch('https://ai-jobs-posting-w5yb.vercel.app/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'waqas@gmail.com',
    password: 'user_password'
  })
});

const loginData = await loginResponse.json();
const userToken = loginData.token; // Save this token
```

---

### Step 2: Get Job ID

You need to find the job ID for "Data Scientist — AI Innovations":

```javascript
// Get all jobs
const jobsResponse = await fetch('https://ai-jobs-posting-w5yb.vercel.app/api/jobs');
const jobsData = await jobsResponse.json();

// Find the job
const dataScientistJob = jobsData.jobs.find(job => 
  job.title === 'Data Scientist' && job.company === 'AI Innovations'
);

const jobId = dataScientistJob.id; // Use this job_id
```

---

### Step 3: Submit Application with Resume

**JavaScript/React Example:**

```javascript
const submitApplication = async (formData, userToken, jobId) => {
  // Create FormData object
  const applicationFormData = new FormData();
  
  // Add form fields
  applicationFormData.append('job_id', jobId);
  applicationFormData.append('name', 'rana waqas naveed');
  applicationFormData.append('email', 'waqas@gmail.com');
  applicationFormData.append('phone', '+49 123 456 789');
  
  // Add resume file if available
  if (formData.resumeFile) {
    applicationFormData.append('resume', formData.resumeFile);
  }
  
  // Add AI parsed data
  const aiParsedData = {
    skills: formData.skills || [],
    experience_years: formData.experience_years || 0,
    role: formData.role || 'Unknown Role',
    match_percentage: formData.match_percentage || 0,
    education: formData.education || '',
    matches: formData.matches || []
  };
  
  applicationFormData.append('ai_parsed_data', JSON.stringify(aiParsedData));
  
  // Submit to API
  try {
    const response = await fetch('https://ai-jobs-posting-w5yb.vercel.app/api/applications', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`
        // Don't set Content-Type - browser will set it with boundary for FormData
      },
      body: applicationFormData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Application submitted successfully:', result);
      return result;
    } else {
      console.error('Error submitting application:', result);
      throw new Error(result.error || 'Failed to submit application');
    }
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
};
```

---

### Step 4: Complete React Component Example

```javascript
import React, { useState } from 'react';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    jobId: null,
    name: 'rana waqas naveed',
    email: 'waqas@gmail.com',
    phone: '+49 123 456 789',
    resume: null,
    aiParsedData: {
      skills: [],
      experience_years: 0,
      role: 'Unknown Role',
      match_percentage: 0
    }
  });
  
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken'));
  const [loading, setLoading] = useState(false);
  
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0]
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('job_id', formData.jobId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      }
      
      formDataToSend.append('ai_parsed_data', JSON.stringify(formData.aiParsedData));
      
      const response = await fetch('https://ai-jobs-posting-w5yb.vercel.app/api/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        body: formDataToSend
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Application submitted successfully!');
        console.log('Application ID:', result.application.id);
      } else {
        alert('Error: ' + (result.error || 'Failed to submit'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Confirm & Submit'}
      </button>
    </form>
  );
};
```

---

## 🔍 Handling Resume Parsing

### If Resume Parsing Fails (0% Unknown Role)

The backend accepts applications even if parsing fails. You can:

1. **Submit with empty/minimal parsed data:**
```json
{
  "ai_parsed_data": {
    "skills": [],
    "experience_years": 0,
    "role": "Unknown Role",
    "match_percentage": 0
  }
}
```

2. **Or submit without ai_parsed_data:**
```json
{
  "job_id": 4,
  "name": "rana waqas naveed",
  "email": "waqas@gmail.com",
  "phone": "+49 123 456 789"
}
```

---

## ✅ Complete API Call Example

### Using cURL (for testing):

```bash
curl -X POST https://ai-jobs-posting-w5yb.vercel.app/api/applications \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -F "job_id=4" \
  -F "name=rana waqas naveed" \
  -F "email=waqas@gmail.com" \
  -F "phone=+49 123 456 789" \
  -F "resume=@/path/to/resume.pdf" \
  -F 'ai_parsed_data={"skills":[],"experience_years":0,"role":"Unknown Role","match_percentage":0}'
```

### Using JavaScript Fetch:

```javascript
const formData = new FormData();
formData.append('job_id', '4');
formData.append('name', 'rana waqas naveed');
formData.append('email', 'waqas@gmail.com');
formData.append('phone', '+49 123 456 789');
formData.append('resume', resumeFile); // File object
formData.append('ai_parsed_data', JSON.stringify({
  skills: [],
  experience_years: 0,
  role: 'Unknown Role',
  match_percentage: 0
}));

fetch('https://ai-jobs-posting-w5yb.vercel.app/api/applications', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`
  },
  body: formData
})
  .then(res => res.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

---

## 📝 Response Format

**Success Response (201):**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "id": 1,
    "job_id": 4,
    "user_id": 1,
    "name": "rana waqas naveed",
    "email": "waqas@gmail.com",
    "phone": "+49 123 456 789",
    "resume_filename": "resume.pdf",
    "ai_parsed_data": {
      "skills": [],
      "experience_years": 0,
      "role": "Unknown Role",
      "match_percentage": 0
    },
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400/401/500):**
```json
{
  "error": "Error message here"
}
```

---

## ⚠️ Important Notes

1. **User must be logged in** - Token is required
2. **Job ID must exist** - Make sure the job exists in database
3. **File size limit** - 10MB maximum for resume
4. **File types** - PDF, DOC, DOCX are supported
5. **ai_parsed_data is optional** - Can be omitted or empty
6. **name and email** - If not provided, will use logged-in user's data

---

## 🔄 Alternative: Use Applicant Endpoint First

If you want to parse resume separately before submitting application:

1. **Upload to applicants endpoint** (public, no auth needed):
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/applicants
```

2. **Then create application** with the parsed data:
```
POST https://ai-jobs-posting-w5yb.vercel.app/api/applications
```

---

## 🎯 Quick Test

Test your integration with this minimal example:

```javascript
// 1. Login
const login = await fetch('https://ai-jobs-posting-w5yb.vercel.app/api/users/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: 'waqas@gmail.com', password: 'your_password'})
});
const {token} = await login.json();

// 2. Submit application
const formData = new FormData();
formData.append('job_id', '4');
formData.append('name', 'rana waqas naveed');
formData.append('email', 'waqas@gmail.com');
formData.append('phone', '+49 123 456 789');

const submit = await fetch('https://ai-jobs-posting-w5yb.vercel.app/api/applications', {
  method: 'POST',
  headers: {'Authorization': `Bearer ${token}`},
  body: formData
});
const result = await submit.json();
console.log(result);
```


