# Sell My Post Office - Marketing Website

## Overview

This is a modern marketing website for USPS-leased property owners looking to sell their post office buildings. The application is built as a single-page application with multiple routes, focusing on lead generation through free valuation report CTAs and contact forms. The site emphasizes trust, transparency, and premium polish, targeting property owners who want to sell without paying traditional broker fees.

**Primary Goal:** Convert visitors into leads by offering free property valuations and connecting them with nationwide buyers.

**Tech Stack:** React + TypeScript + Vite frontend, Express backend (for Replit) or Netlify Functions (for Netlify deployment), Tailwind CSS with shadcn/ui components. Supports dual deployment: Replit or Netlify with serverless functions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React 18 with TypeScript, bundled via Vite
- **Routing:** wouter for client-side routing (lightweight React Router alternative)
- **State Management:** TanStack Query (React Query) for server state, local component state via hooks
- **UI Components:** shadcn/ui (Radix UI primitives) with custom styling via Tailwind CSS
- **Form Handling:** react-hook-form with zod validation for type-safe forms

**Design System:**
- Custom Tailwind configuration with design tokens defined in CSS variables
- Color palette: Navy primary (#0D1B2A), off-white background (#F8FAFC), teal accent (#14B8A6)
- Typography: Inter font family from Google Fonts
- Component library follows "new-york" shadcn style with custom theming

**Key Pages:**
- `/` - Home with hero, value props, testimonials, case studies, FAQ
- `/guide` - Complete selling guide with detailed content sections
- `/about` - Company mission and values
- `/contact` - Contact form for inquiries
- `/blog` - Blog listing page with category filtering (6 categories, 9 articles)
- `/valuation` - Multi-stage property valuation calculator

**Design Principles:**
- Mobile-first responsive design
- Accessibility-focused (ARIA labels, focus states, semantic HTML)
- Performance-optimized (Lighthouse target ≥95)
- Smooth animations and transitions for premium feel
- Sticky header with blur backdrop effect

### Backend Architecture

**Dual Backend Support:**

1. **Express Server** (Replit deployment)
   - Development mode uses Vite dev server with HMR
   - In-memory storage for valuations
   - API routes in `server/routes.ts`

2. **Netlify Functions** (Netlify deployment)
   - Serverless functions in `/netlify/functions/`
   - `api-valuations.ts` - CRUD with Netlify Blobs storage
   - `api-submit.ts` - Email with SendGrid + Google Maps integration
   - Persistent storage via Netlify Blobs (replaces in-memory)

**Build Process:**
- Client: Vite builds to `dist/public`
- Server: esbuild bundles to `dist` with ESM format
- Separate development and production modes

**Database Schema (Prepared but Not Actively Used):**
- Drizzle ORM configured for PostgreSQL
- Schema includes basic `users` table (username, password, id)
- Migration support via drizzle-kit
- Database connection configured via `DATABASE_URL` environment variable

**Rationale:** The app is primarily static/frontend-focused. The backend exists mainly to serve the SPA and could handle future API needs (user authentication, lead capture to database). Currently, form submissions go through Netlify Forms (no backend processing needed).

### Contact Form Strategy

**Current Implementation:** 
- Forms use react-hook-form with zod schema validation
- Mock submission functionality (console.log + success message)
- Designed to integrate with Netlify Forms (serverless)

**Planned Netlify Forms Integration:**
- Forms will POST to Netlify with `data-netlify="true"` attribute
- No backend API required for form handling
- Spam protection via Netlify's built-in honeypot field (`bot-field`)

**Alternatives Considered:**
- Direct backend API endpoint (rejected: adds unnecessary complexity)
- Third-party form services like Formspree (rejected: Netlify Forms is simpler for this use case)

### Admin Dashboard

**Authentication:**
- JWT-based authentication with HttpOnly cookies (secure, httpOnly, sameSite: strict)
- Environment-based credentials (ADMIN_USER, ADMIN_PASS, JWT_SECRET)
- System fails fast at startup if credentials not configured (security-first approach)
- Protected routes redirect unauthenticated users to login

**Admin Endpoints (Netlify Functions):**
- `/api/admin/login` - POST login with JWT cookie issuance
- `/api/admin/me` - GET authentication check
- `/api/admin/stats` - GET dashboard statistics (totals, conversion rate)
- `/api/admin/valuations` - GET list with search/filter/pagination, DELETE by ID, POST resend email
- `/api/admin/leads` - GET list with search/pagination, DELETE by ID
- `/api/admin/export` - GET CSV export (valuations or leads)

**Admin Data Indexes:**
- Valuations stored as `val:${id}`, indexed via `vals:index` (JSON array)
- Leads stored as `lead:${id}`, indexed via `leads:index` (JSON array)
- Indexes maintained automatically by existing endpoints (api-valuations.ts, api-submit.ts)
- Stage tracking: 1 (contact only) → 2 (property details) → 3 (email sent)

**Admin UI Pages:**
- `/admin/login` - Login form with validation
- `/admin` - Dashboard with stat cards (totals, conversion rate)
- `/admin/valuations` - Table with search, stage filter, pagination, resend, delete
- `/admin/leads` - Table with search, pagination, delete

**Security Features:**
- No default credentials (fails at startup if missing)
- JWT tokens stored in HttpOnly cookies (not accessible via JavaScript)
- All admin endpoints verify JWT before processing
- CORS headers configured for security

### External Service Integration

**Valuation Calculator:**
- Built-in multi-stage form at `/valuation`
- Stage 1: Contact information (saves immediately)
- Stage 2: Property details with calculation
- Stage 3: Results display with email confirmation

**Email Service (Netlify Functions only):**
- SendGrid integration for automated valuation reports
- Professionally designed HTML email with:
  - Dual estimates (conservative & optimistic)
  - Google Street View image of property
  - Detailed cost breakdown
  - USPS branded styling

**Google Maps API (Netlify Functions only):**
- Geocoding API for address validation
- Street View Static API for property images in emails

**Google Fonts:**
- Inter font family loaded from Google Fonts CDN
- Preconnect hints for performance optimization

### Deployment Strategy

**Option 1: Replit**
- Uses Express backend with in-memory storage
- Simple one-click publish
- Automatic HTTPS and custom domain support
- Suitable for prototyping and development

**Option 2: Netlify** (Recommended for Production)
- Serverless functions with Netlify Blobs storage
- Automated email reports with SendGrid
- Google Maps integration for Street View images
- Admin dashboard with JWT authentication
- Files: `netlify.toml`, `/netlify/functions/`
- **Required Environment Variables:**
  - `SENDGRID_API_KEY` - SendGrid API key for email reports
  - `GOOGLE_MAPS_API_KEY` - Google Maps API key for geocoding and Street View
  - `FROM_EMAIL` - Email address for sending reports
  - `SITE_BASE_URL` - Base URL of the site (e.g., https://sellmypostoffice.com)
  - `ADMIN_USER` - Admin username for dashboard login (required, no default)
  - `ADMIN_PASS` - Admin password for dashboard login (required, no default)
  - `JWT_SECRET` - Secret key for JWT token signing (required, no default, use strong random value)
- See `NETLIFY_DEPLOYMENT.md` for complete setup guide

**SEO Optimization:**
- Custom SEOHead component manages meta tags per page
- robots.txt configured to allow all crawlers
- Sitemap referenced in robots.txt
- Canonical URLs set per page
- Open Graph and Twitter card meta tags

## External Dependencies

### Third-Party UI Libraries
- **Radix UI:** Headless component primitives (@radix-ui/react-*)
- **shadcn/ui:** Pre-styled components built on Radix UI
- **Lucide React:** Icon library for consistent iconography
- **Embla Carousel:** Touch-friendly carousel for testimonials
- **cmdk:** Command menu component (currently unused but available)

### Data & Forms
- **react-hook-form:** Form state management with performance optimization
- **zod:** Schema validation for forms and API contracts
- **@hookform/resolvers:** Integration between react-hook-form and zod

### Database & Storage
- **Drizzle ORM:** Type-safe SQL query builder (configured but not actively used)
- **@neondatabase/serverless:** PostgreSQL driver for Neon (optional)
- **connect-pg-simple:** PostgreSQL session store (prepared for future auth)
- **Netlify Blobs:** Serverless key-value storage (used in Netlify Functions)
- **MemStorage:** In-memory storage (used in Express backend)

### Email & Communication
- **@sendgrid/mail:** Email service for valuation reports (Netlify Functions only)
- **Google Maps APIs:** Geocoding + Street View for property visualization (Netlify Functions only)

### Styling & Utilities
- **Tailwind CSS:** Utility-first CSS framework
- **class-variance-authority:** Type-safe component variants
- **clsx + tailwind-merge:** Class name manipulation utilities
- **date-fns:** Date formatting and manipulation

### Development Tools
- **Vite:** Build tool and dev server
- **TypeScript:** Type safety across frontend and backend
- **ESBuild:** Fast backend bundling for production
- **@replit/vite-plugin-*:** Replit-specific dev tooling (error overlay, cartographer, dev banner)

### Key Configuration Notes
- All path aliases configured in both tsconfig.json and vite.config.ts
- Base URL for relative imports: `@/` = client/src, `@shared/` = shared, `@assets/` = attached_assets
- PostCSS configured for Tailwind processing
- Drizzle migrations output to `./migrations` directory