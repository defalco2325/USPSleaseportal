# Sell My Post Office - Marketing Website

A modern marketing website for USPS-leased property owners looking to sell their post office buildings. Built with React, TypeScript, and Netlify Functions.

## Features

- **Multi-page Marketing Site**: Home, Guide, About, Contact, Blog
- **Property Valuation Calculator**: Multi-stage form with automated email reports
- **Email Automation**: SendGrid integration with Google Street View property images
- **Admin Dashboard**: Secure JWT-based admin panel for managing leads and valuations
- **Netlify Deployment**: Serverless architecture with Netlify Functions and Blobs storage

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Set up environment variables (see below)
# Add secrets in Replit Secrets tool or create .env file

# Start development server
npm run dev

# Visit http://localhost:5000
```

### Build

```bash
# Build for production
npm run build

# Output: dist/public (frontend) + dist (backend)
```

## Environment Variables

### Required for Production

```bash
# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=reports@yourdomain.com

# Google Maps (for Street View images)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Site Configuration
SITE_BASE_URL=https://your-site.netlify.app

# Admin Dashboard (REQUIRED - no defaults)
ADMIN_USER=admin
ADMIN_PASS=your_secure_password_here
JWT_SECRET=your_long_random_secret_key_here

# Optional
SESSION_SECRET=your_random_session_secret
```

### Setting Environment Variables

**For Replit:**
1. Click the 🔒 "Secrets" icon in the left sidebar
2. Add each variable with its value
3. Restart the application

**For Netlify:**
1. Go to **Site settings → Environment variables**
2. Add all required variables
3. Deploy/redeploy the site

## Admin Dashboard

Access the admin dashboard at `/admin/login` to manage valuations and leads.

### Default Setup

When first deploying, you **must** set these environment variables:
- `ADMIN_USER` - Your admin username (e.g., "admin")
- `ADMIN_PASS` - A secure password
- `JWT_SECRET` - A long random string (generate with `openssl rand -base64 32`)

### Changing Admin Password

**On Netlify:**
1. Site settings → Environment variables
2. Edit `ADMIN_PASS` or `ADMIN_USER`
3. Save and redeploy

**On Replit:**
1. Open Secrets tool (🔒)
2. Update `ADMIN_PASS` or `ADMIN_USER`
3. Restart the app

**Security Best Practices:**
- Use a strong password (12+ characters, mixed case, numbers, symbols)
- Never commit credentials to git
- Change default passwords immediately
- Use `openssl rand -base64 32` to generate `JWT_SECRET`

### Admin Features

- View dashboard statistics (totals, conversion rates)
- Manage property valuations (search, filter, delete, resend emails)
- Manage contact leads (search, delete)
- Export data as CSV

## Deployment

### Deploy to Netlify (Recommended)

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for complete setup guide.

**Quick Steps:**
1. Push code to GitHub
2. Connect repository to Netlify
3. Set environment variables (see above)
4. Enable Netlify Blobs
5. Deploy

Configuration is in `netlify.toml` - build and publish settings are pre-configured.

### Deploy to Replit

1. Click "Publish" button in Replit
2. Set environment variables in Secrets
3. Configure custom domain (optional)

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components (Home, Guide, About, etc.)
│   │   ├── components/    # Reusable components
│   │   └── lib/          # Utilities and helpers
├── netlify/functions/     # Serverless functions
│   ├── api-valuations.ts # Valuation CRUD
│   ├── api-submit.ts     # Email automation
│   ├── api-admin-*.ts    # Admin endpoints
│   ├── _auth.ts          # JWT authentication helper
│   └── _blobs.ts         # Netlify Blobs helper
├── server/                # Express server (for Replit)
├── shared/                # Shared types and schemas
└── public/                # Static assets
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Netlify Functions (serverless) or Express (Replit)
- **Database**: Netlify Blobs (key-value store)
- **Email**: SendGrid
- **Maps**: Google Maps Geocoding + Street View Static API
- **Auth**: JWT with HttpOnly cookies

## Key APIs

### Public Endpoints

- `POST /api/valuations` - Save contact info (Stage 1)
- `PATCH /api/valuations/:id` - Save property details (Stage 2)
- `POST /api/submit` - Calculate valuation and send email (Stage 3)

### Admin Endpoints (Protected)

- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Check auth status
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/valuations` - List/search/filter valuations
- `DELETE /api/admin/valuations/:id` - Delete valuation
- `POST /api/admin/valuations/:id/resend` - Resend email
- `GET /api/admin/leads` - List/search leads
- `DELETE /api/admin/leads/:id` - Delete lead
- `GET /api/admin/export` - Export CSV (valuations or leads)

## Development Notes

- **Routing**: Uses `wouter` for client-side routing
- **Forms**: `react-hook-form` + `zod` validation
- **State**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS with custom design tokens
- **Build**: Vite for frontend, esbuild for backend

## Support

For deployment help, see:
- [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) - Complete Netlify setup guide
- [design_guidelines.md](./design_guidelines.md) - Frontend design system
- [replit.md](./replit.md) - Project architecture and technical details

## License

MIT
