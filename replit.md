# Sell My Post Office - Marketing Website

## Overview

This is a modern marketing website for USPS-leased property owners looking to sell their post office buildings. The application is built as a single-page application with multiple routes, focusing on lead generation through free valuation report CTAs and contact forms. The site emphasizes trust, transparency, and premium polish, targeting property owners who want to sell without paying traditional broker fees.

**Primary Goal:** Convert visitors into leads by offering free property valuations and connecting them with nationwide buyers.

**Tech Stack:** React + TypeScript + Vite frontend, Express backend (minimal API usage), Tailwind CSS with shadcn/ui components, deployed on Netlify with form handling.

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
- `/blog` - Blog listing page (content placeholders)

**Design Principles:**
- Mobile-first responsive design
- Accessibility-focused (ARIA labels, focus states, semantic HTML)
- Performance-optimized (Lighthouse target ≥95)
- Smooth animations and transitions for premium feel
- Sticky header with blur backdrop effect

### Backend Architecture

**Server:** Express.js with TypeScript (minimal implementation)
- Development mode uses Vite dev server with HMR
- Production serves static built files
- Currently uses in-memory storage (MemStorage class) for any data persistence needs
- API routes prefixed with `/api` (though currently no active API endpoints)

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

### External Service Integration

**Valuation Report CTA:**
- External URL configured via `VITE_VALUATION_URL` environment variable
- Opens in new tab when users click "Get Free Valuation" buttons
- This is likely a third-party landing page or funnel for lead capture

**Google Fonts:**
- Inter font family loaded from Google Fonts CDN
- Preconnect hints for performance optimization

### Deployment Strategy

**Platform:** Netlify (configured but deployment files not present in repository)
- Static site hosting with automatic builds
- Netlify Forms for contact form handling
- Required files: `netlify.toml` (config), `_redirects` (SPA routing)
- Environment variable: `VITE_VALUATION_URL` for external valuation link

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

### Database (Configured for Future Use)
- **Drizzle ORM:** Type-safe SQL query builder
- **@neondatabase/serverless:** PostgreSQL driver for Neon (serverless Postgres)
- **connect-pg-simple:** PostgreSQL session store (prepared for future authentication)

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