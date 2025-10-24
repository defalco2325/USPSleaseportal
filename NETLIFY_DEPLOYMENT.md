# Netlify Deployment Guide

This guide explains how to deploy your React + Vite app with Netlify Functions.

## Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **API Keys** (see Environment Variables below)

## Deployment Steps

### 1. Connect to Netlify

1. Log in to Netlify
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account
4. Select this repository

### 2. Configure Build Settings

Netlify should auto-detect these settings from `netlify.toml`:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

### 3. Set Environment Variables

Go to **Site settings → Environment variables** and add:

```
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=reports@yourdomain.com
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
SITE_BASE_URL=https://your-netlify-site.netlify.app
SESSION_SECRET=your_random_secret_here

# Admin Dashboard Credentials (REQUIRED)
ADMIN_USER=admin
ADMIN_PASS=your_secure_password_here
JWT_SECRET=your_long_random_secret_key_here
```

**Security Note**: Choose a strong password for `ADMIN_PASS` and generate a long random string for `JWT_SECRET` (e.g., use a password generator or run `openssl rand -base64 32` in terminal).

### 4. Enable Netlify Blobs

1. Go to **Site settings → Data → Blobs**
2. Click "Enable Blobs"
3. Use the default store name ("production")

### 5. Deploy

Click "Deploy site" - Netlify will:
1. Run `npm install`
2. Build your React app (`npm run build`)
3. Deploy functions from `netlify/functions`
4. Serve your site with HTTPS

## API Keys Setup

### SendGrid (Email Service)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Go to Settings → API Keys
3. Create an API key with "Mail Send" permissions
4. Verify your sender email address
5. Set `FROM_EMAIL` to your verified address

### Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable these APIs:
   - Geocoding API
   - Street View Static API
4. Create credentials → API Key
5. Restrict the API key:
   - Set Application restrictions to "HTTP referrers"
   - Add your Netlify domain
   - Set API restrictions to only Geocoding + Street View Static

## Local Development with Netlify

To test Functions locally:

```bash
# Install Netlify CLI (already in package.json)
npm install

# Run with Netlify Dev (starts Vite + Functions)
netlify dev

# This will:
# - Start Vite dev server on port 5173
# - Serve Functions at /.netlify/functions/*
# - Proxy API calls from /api/* to Functions
```

## Troubleshooting

### Functions Not Working

1. Check Netlify Function logs: Site → Functions → Select function → Logs
2. Verify environment variables are set correctly
3. Ensure Blobs is enabled

### Email Not Sending

1. Verify SendGrid API key is valid
2. Check `FROM_EMAIL` is verified in SendGrid
3. Review Function logs for errors

### Google Maps Errors

1. Ensure Geocoding API and Street View Static API are enabled
2. Check API key restrictions allow your Netlify domain
3. Verify billing is enabled in Google Cloud Console

## Architecture

```
/netlify/functions/
├── api-valuations.ts    # CRUD for valuations (uses Netlify Blobs)
└── api-submit.ts        # Calculate + Email with Street View

Frontend calls:
- POST /api/valuations (Stage 1: save contact)
- PATCH /api/valuations/:id (Stage 2: save property details)
- POST /api/submit (Trigger email with calculations)
```

## Custom Domain

1. Go to **Site settings → Domain management**
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Update `SITE_BASE_URL` environment variable to your custom domain

## Monitoring

- **Analytics**: Site → Analytics
- **Function logs**: Site → Functions → [function name] → Logs
- **Blobs usage**: Site → Data → Blobs

## Cost Estimates

- **Netlify Free Tier**:
  - 100GB bandwidth/month
  - 300 build minutes/month
  - 125K Function invocations/month
  - Unlimited sites

- **SendGrid Free Tier**: 100 emails/day
- **Google Maps**: First $200/month free (includes ~40K geocodes + Street Views)
- **Netlify Blobs**: Free for small datasets (first 1GB)

## Admin Dashboard

The site includes a secure admin dashboard at `/admin` for managing valuations and leads.

### Accessing the Admin Dashboard

1. Navigate to `https://your-site.netlify.app/admin/login`
2. Log in with the credentials you set in environment variables:
   - **Username**: Value of `ADMIN_USER`
   - **Password**: Value of `ADMIN_PASS`

### Changing Admin Credentials

To change your admin username or password:

**For Netlify:**
1. Go to **Site settings → Environment variables**
2. Find `ADMIN_USER` and/or `ADMIN_PASS`
3. Click "Edit" to change the values
4. Save changes
5. Trigger a new deployment (or wait for next auto-deploy)

**For Replit:**
1. Open the "Secrets" tool (🔒 icon in the left sidebar)
2. Find `ADMIN_USER` and/or `ADMIN_PASS`
3. Update the values
4. Restart the application

**Security Best Practices:**
- Use a strong, unique password (12+ characters with mix of letters, numbers, symbols)
- Don't reuse passwords from other services
- Change the default password immediately after first deployment
- Generate `JWT_SECRET` using: `openssl rand -base64 32` or similar

### Admin Features

- **Dashboard**: View stats (total valuations, completed reports, leads, conversion rate)
- **Valuations Management**: Browse, search, filter by stage, delete, resend email reports
- **Leads Management**: View contact form submissions, search, delete
- **CSV Export**: Download valuation or lead data for analysis

## Production Checklist

- [ ] All environment variables set
- [ ] Admin credentials changed from defaults to secure values
- [ ] SendGrid sender email verified
- [ ] Google Maps APIs enabled and restricted
- [ ] Netlify Blobs enabled
- [ ] Custom domain configured (optional)
- [ ] Test full valuation flow
- [ ] Verify emails are being sent
- [ ] Check Street View images appear in emails
- [ ] Test admin login at `/admin/login`
