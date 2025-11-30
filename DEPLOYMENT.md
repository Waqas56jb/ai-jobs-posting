# Quick Deployment Guide for Vercel

## Prerequisites Checklist

- [ ] Vercel account created
- [ ] Neon Postgres database created and schema executed
- [ ] Database credentials ready

## Step-by-Step Deployment

### 1. Install Vercel CLI (if not already installed)

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Initialize Vercel Project

From the project root directory:

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Choose your account
- Link to existing project? **No** (for first time)
- Project name? Enter your desired name
- Directory? **./** (current directory)
- Override settings? **No**

### 4. Set Environment Variables

You can set environment variables in two ways:

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

   ```
   DATABASE_URL = postgresql://neondb_owner:npg_BlJYpceRI8i5@ep-lively-firefly-ah76r87n-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   
   POSTGRES_URL = postgresql://neondb_owner:npg_BlJYpceRI8i5@ep-lively-firefly-ah76r87n-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   
   JWT_SECRET = [Generate a strong random string - use an online generator]
   ```

5. Select **Production**, **Preview**, and **Development** for each variable
6. Click **Save**

#### Option B: Via CLI

```bash
vercel env add DATABASE_URL
# Paste your DATABASE_URL when prompted
# Select: Production, Preview, Development

vercel env add POSTGRES_URL
# Paste your POSTGRES_URL when prompted
# Select: Production, Preview, Development

vercel env add JWT_SECRET
# Enter a strong random string
# Select: Production, Preview, Development
```

### 5. Deploy to Production

```bash
vercel --prod
```

Or simply push to your main branch if you've connected a Git repository.

### 6. Verify Deployment

1. Visit your deployment URL (shown after deployment)
2. Test the health endpoint: `https://your-project.vercel.app/api/health`
3. Should return: `{"status":"ok","database":"connected",...}`

## Testing Your API

### Test Health Endpoint

```bash
curl https://your-project.vercel.app/api/health
```

### Test Admin Registration

```bash
curl -X POST https://your-project.vercel.app/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword123"
  }'
```

### Test Job Listing (Public)

```bash
curl https://your-project.vercel.app/api/jobs
```

## Common Issues

### Issue: Database Connection Error

**Solution:**
- Verify DATABASE_URL is correct in Vercel environment variables
- Check if SSL mode is required (should be `?sslmode=require`)
- Ensure database allows connections from Vercel's IP addresses

### Issue: 502 Bad Gateway

**Solution:**
- Check Vercel function logs in dashboard
- Verify all environment variables are set
- Check if server.js is in the root directory

### Issue: File Upload Not Working

**Solution:**
- Vercel has a 4.5MB limit for request body in serverless functions
- Current limit is set to 10MB in code - consider reducing
- For larger files, consider using cloud storage (S3, Cloudinary)

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string from Neon |
| `POSTGRES_URL` | Yes | Same as DATABASE_URL (alternative name) |
| `JWT_SECRET` | Yes | Secret key for JWT token signing |

## API Base URL

After deployment, your API will be available at:

```
https://your-project-name.vercel.app
```

All endpoints are prefixed with `/api/`

Example:
- Health: `https://your-project-name.vercel.app/api/health`
- Jobs: `https://your-project-name.vercel.app/api/jobs`
- Admin Login: `https://your-project-name.vercel.app/api/admin/login`

## Next Steps

1. Test all endpoints using Postman or curl
2. Integrate with your frontend application
3. Set up monitoring and logging (optional)
4. Configure custom domain (optional)

## Support

If you encounter issues:
1. Check Vercel function logs in the dashboard
2. Verify database connection
3. Ensure all environment variables are set correctly
4. Check the README.md for detailed API documentation

