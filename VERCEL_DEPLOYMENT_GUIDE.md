# Vercel Deployment Guide for ATS Platform

## Pre-Deployment Checklist

### 1. **Environment Variables Setup**

Create a `.env.production` file with all required variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Analytics
NEXT_PUBLIC_VERCEL_ENV=production

# Optional: Email notifications
RESEND_API_KEY=your_resend_api_key (optional)
```

### 2. **Database Configuration**

Before deploying, ensure your Supabase database has:

1. **Run schema migrations:**

   ```bash
   # Execute in Supabase SQL editor:
   # 1. scripts/01_setup_schema.sql
   # 2. scripts/02_seed_data.sql (optional - adds sample data)
   # 3. scripts/03_add_resumes_notifications.sql (for file uploads)
   # 4. scripts/04_expand_mock_data.sql (for realistic data)
   ```

2. **Create Storage Bucket:**
   - Go to **Supabase Dashboard** → **Storage**
   - Create bucket named: `resumes`
   - Set policies:
     - Allow authenticated users to upload
     - Allow public read access for recruiter-owned jobs

3. **Enable RLS (Row Level Security):**
   - All tables have RLS enabled automatically via SQL scripts
   - Verify in Supabase dashboard

### 3. **Vercel Environment Variables**

In Vercel dashboard, add these environment variables:

1. Go to **Settings** → **Environment Variables**
2. Add the same variables as in your `.env.production`
3. Make sure they're set for **Production** environment

### 4. **Deployment Steps**

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI if needed
npm install -g vercel

# Deploy from project root
vercel --prod

# Follow prompts to link project
```

#### Option B: Using GitHub Integration (Recommended)

1. Push code to GitHub repository
2. In Vercel dashboard, click **New Project**
3. Select your GitHub repository
4. Configure environment variables
5. Click **Deploy**

### 5. **Post-Deployment Verification**

After successful deployment:

1. **Test Critical Flows:**
   - [ ] User registration (candidate & recruiter)
   - [ ] User login
   - [ ] Browse jobs page
   - [ ] Job detail page
   - [ ] Apply for job with cover letter
   - [ ] View applications dashboard
   - [ ] Recruiter: Post new job
   - [ ] Recruiter: Drag-drop applications in kanban

2. **Test File Upload:**
   - [ ] Upload resume to application
   - [ ] Verify file appears in Supabase Storage
   - [ ] Check file retrieval

3. **Test Notifications:**
   - [ ] Create application action
   - [ ] Verify notification appears
   - [ ] Mark notification as read

4. **Check Performance:**
   - [ ] Lighthouse score > 80
   - [ ] First Contentful Paint < 3s
   - [ ] Core Web Vitals passing

### 6. **Performance Optimization**

Current optimizations already in place:

- ✅ Image optimization disabled (for static assets)
- ✅ Turbopack enabled for fast builds
- ✅ TypeScript configured
- ✅ Tailwind CSS purging enabled
- ✅ React 19 for latest features

### 7. **Security Checklist**

- ✅ RLS policies enabled on all tables
- ✅ Auth token stored (currently localStorage - consider httpOnly for production)
- ✅ CORS properly configured for Supabase
- ✅ API routes protected with auth token verification
- ✅ File upload restricted to authenticated users

**TODO for Enhanced Security:**

- [ ] Implement secure session cookies (httpOnly, signed)
- [ ] Add rate limiting to API routes
- [ ] Enable HTTPS only
- [ ] Set Content Security Policy headers
- [ ] Add CSRF protection

### 8. **Monitoring & Maintenance**

After deployment, monitor:

1. **Vercel Dashboard:**
   - Function executions
   - Build times
   - Error rates
   - API performance

2. **Supabase Dashboard:**
   - Database connections
   - Storage usage
   - Row Level Security policy violations

3. **Error Reporting:**
   - Set up error tracking (Sentry/LogRocket optional)
   - Monitor production errors

### 9. **Scaling Considerations**

For production scale-up:

1. **Database:**
   - Upgrade Supabase plan if needed
   - Add database replicas for read scaling
   - Set up connection pooling (pgBouncer)

2. **Storage:**
   - Monitor resume storage usage
   - Consider CDN for file delivery
   - Set up automated cleanup of old files

3. **Compute:**
   - Vercel handles auto-scaling
   - Monitor function execution times
   - Consider caching strategies

### 10. **Rollback Plan**

If deployment issues occur:

```bash
# Rollback to previous deployment
vercel rollback

# Or via Vercel dashboard:
# Settings → Deployments → Select previous → Promote to Production
```

## Troubleshooting

### Common Issues

**Issue:** Environment variables not loading

- Solution: Ensure variables are set in Vercel dashboard, not just `.env.production`
- Restart deployment after adding variables

**Issue:** Database connection errors

- Solution: Check `SUPABASE_SERVICE_ROLE_KEY` is correct and has full access
- Verify network access in Supabase settings

**Issue:** File upload not working

- Solution: Ensure `resumes` bucket exists and has correct RLS policies
- Check that Storage URL is correct in environment

**Issue:** Long build times\*\*

- Solution: Check build logs in Vercel
- Consider upgrading Vercel plan for faster builds
- Ensure dependencies are correctly specified in package.json

## Performance Targets

- **Build time:** < 3 minutes
- **First Contentful Paint:** < 2 seconds
- **Time to Interactive:** < 4 seconds
- **Lighthouse Score:** > 85
- **API response time:** < 200ms (average)

## Next Steps

After successful deployment:

1. Set up custom domain (in Vercel settings)
2. Configure email notifications (optional)
3. Set up SSL certificate (automatic with Vercel)
4. Monitor analytics and user behavior
5. Plan scaling strategy based on usage

---

**Last Updated:** 2024-04-19
**Version:** 1.0
