# Design Guidelines: Sell My Post Office Marketing Website

## Design Approach
**Reference-Based**: Draw inspiration from professional real estate and financial services websites (Zillow, Redfin, Fundrise) with emphasis on trust, clarity, and premium polish. The site should feel authoritative yet approachable for property owners.

## Color System

### Primary Palette
- **Primary Navy**: `#0D1B2A` (12 10% 11%) - Headers, text, authority elements
- **Background**: `#F8FAFC` (210 20% 98%) - Main page background
- **Border/Lines**: `#E5E7EB` (220 13% 91%) - Dividers, card borders
- **Accent Teal**: `#14B8A6` (172 66% 50%) - CTAs, interactive elements, highlights

### Usage
- Navy dominates headers and navigation for credibility
- Teal reserved exclusively for primary CTAs and key interactive elements
- Off-white background creates breathing room and reduces eye strain
- Subtle gray borders define content blocks without harsh lines

## Typography

### Font Family
**Inter** (Google Fonts) - Modern, professional, highly legible

### Hierarchy
- **H1**: 700 weight, tight letter-spacing (-0.02em), 48-56px desktop / 32-40px mobile
- **H2/H3**: 600 weight, standard spacing, 32-40px / 24-28px
- **Body**: 400 weight, relaxed line-height (1.7), 16-18px
- **CTAs**: 600 weight, 16-18px

## Layout System

### Container & Spacing
- **Max Width**: 1200px for main content container
- **Section Padding**: `py-20` (80px) desktop, `py-12` (48px) mobile
- **Baseline Grid**: 12/16pt for consistent vertical rhythm
- **Card Padding**: `p-8` to `p-12`

### Component Styling
- **Cards**: `rounded-2xl` corners, subtle shadow (`shadow-lg`)
- **Buttons**: 44px minimum tap target height
- **Focus States**: High-contrast `focus-visible` rings in teal

## Navigation Header

### Sticky Behavior
- Blur backdrop effect (`backdrop-blur-lg`)
- Semi-transparent navy background with subtle border
- Smooth transition on scroll

### Structure
- **Left**: "Sell My Post Office" wordmark
- **Right**: Home • Guide 2025 • FREE Valuation • About • Contact
- **Mobile**: Hamburger menu → slide-in drawer (right-to-left)

## Page Sections

### 1. Hero Section
- **Layout**: Two-column (60/40 split on desktop), stacked mobile
- **Left**: H1 headline + 2-line subhead + primary CTA button
- **Right**: Postal-themed illustration (abstract mail/building shapes in navy/teal)
- **CTA**: Prominent teal button "Get a Free Property Valuation Report"
- **Spacing**: Generous `py-24` to `py-32`

### 2. How It Works (3 Steps)
- **Desktop**: Horizontal stepper with connecting lines
- **Mobile**: Vertical stack with numbered badges
- **Icons**: Simple line icons in teal for each step
- **Cards**: Light background, rounded corners, icon-title-description format

### 3. CTA Band
- **Style**: Full-width teal background with white text
- **Layout**: Centered title + button, `py-16` padding
- **Button**: White background, navy text, hover state

### 4. About + Why Sell With Us
- **Grid**: 2-column card layout (4-5 benefit cards)
- **Cards**: Navy border, white background, icon + title + short description
- **Icons**: Checkmark/shield/clock symbols in teal
- **Inline CTA**: Below grid, secondary button style

### 5. Testimonials Carousel
- **Layout**: 3 quotes visible on desktop, 1 on mobile
- **Auto-advance**: 5-second interval, pause on hover
- **Quote Cards**: White background, subtle shadow, quotation marks in teal
- **Attribution**: Initials + state in smaller gray text

### 6. Contact Teaser/Form
- **Mini Form**: Name, Email, Message fields
- **Netlify Integration**: Hidden honeypot, success state
- **Validation**: Inline error messages, ARIA live regions
- **Button**: Teal submit button, loading state

## Additional Pages

### Guide Page
- **TOC**: Sticky sidebar on desktop, collapsible on mobile
- **Content**: H2/H3 structured sections with generous spacing
- **Inline CTAs**: Every 3 sections, card-style with teal button

### About & Contact Pages
- **Layout**: Single column, max-width 800px for readability
- **Contact Form**: Full-featured with all fields, enhanced validation

## Footer
- **Background**: Dark navy (`#0D1B2A`)
- **Text**: Off-white/gray
- **Structure**: Brand line + contact email + minimal navigation links
- **Spacing**: `py-12`

## Interactions & Polish

### Micro-Animations
- Smooth scroll to anchors (scroll-behavior: smooth)
- Subtle hover states on cards (slight lift, shadow increase)
- Button hover: slight scale (1.02) and darker teal
- Focus rings: 2px teal outline with offset

### Accessibility
- 44px minimum touch targets
- Keyboard-navigable menu and accordions
- High contrast (WCAG AA minimum)
- Focus-visible states for all interactive elements
- ARIA labels for carousel, form validation, mobile menu

## Images
**Hero Section**: Use a professional photo of a traditional USPS post office building (brick exterior, American flag, clear signage). Image should be high-quality, well-lit, and convey stability/trust. Position on the right side of hero (40% width on desktop), full-width background on mobile with text overlay and darkened gradient for legibility.

## Performance Targets
- Lighthouse scores ≥95 across all metrics
- Optimize images (WebP format preferred)
- Lazy-load below-the-fold content
- Minimal JavaScript footprint