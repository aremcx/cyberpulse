# 🛡️ CyberPulse

> **Next-Generation Cybersecurity Intelligence, Research & Media Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5_Beta-purple?style=for-the-badge&logo=auth0)](https://authjs.dev/)

CyberPulse is a modern, high-performance cybersecurity editorial and threat intelligence platform designed for security researchers, ethical hackers, enterprise defenders, and the broader tech community. Built on the modern Next.js 16 App Router, React 19, and Tailwind CSS v4, it features real-time vulnerability tracking, interactive threat advisories, user and author workflows, role-based administration, and an adaptive cyberpunk design system supporting both dark and light modes.

---

## ✨ Features

### 🌐 Public Portal & Content Hub
- **Articles & Deep Dives**: Curated articles across Blue Team, Red Team, SOC, DFIR, Malware Analysis, Cloud Security, Web Security, AI Security, and GRC.
- **Threat Intelligence & Advisories**: Real-time tracking of adversaries, threat actors, malware signatures, and Indicators of Compromise (IOCs).
- **Vulnerability Tracker (CVE Database)**: Detailed vulnerability dossiers with CVSS v3.1/v4.0 severity ratings, EPSS scores, CISA Known Exploited Vulnerabilities (KEV) status, affected components, and remediation guidance.
- **Cyber Academy & Tutorials**: Step-by-step hands-on guides and security awareness courses.
- **Regional & Global Coverage**: Dedicated Africa Cyber tracker (`/africa`) exploring regional threat landscapes and talent ecosystems.
- **Community & Careers**: Verified cybersecurity job board, global event/webinar/CTF listings, and community discussion boards.
- **Content Syndication**: Valid XML RSS Feed (`/feed.xml`) and newsletter subscription system.

### ✍️ User & Author Dashboard
- **Author Portal**: Rich article creation and submission workflow with editorial status tracking (`Draft`, `Pending Review`, `Published`, `Archived`).
- **Interactive Reader Actions**: Like articles, bookmark to personal collections, share via Web Share API, and contribute to moderated discussions.
- **Personalized Profile**: Public profile pages (`/authors/[username]`) with biographies, social handles, verified certifications, and published portfolios.
- **Notification Inbox**: Alerts for editorial review updates, comment activity, and security advisories.

### 🔐 Admin Control Center
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for Readers, Authors, Editors, Admins, and Superadmins.
- **Editorial Review Queue**: Accept, request revisions, or reject submitted articles with direct feedback.
- **Directory Managers**: Full CRUD for Users, Vulnerabilities, Threat Feeds, Security Tools, Jobs, Events, and Newsletter Subscribers.
- **Content Moderation**: One-click comment review and deletion.
- **System Audit & Analytics**: Platform traffic, reader engagement metrics, and vulnerability disclosure reports.

### 🎨 Design System & Accessibility
- **Cyberpunk Aesthetic**: High-contrast, clean futuristic styling with dynamic neon accents, subtle glow effects, and scanlines.
- **Light & Dark Mode**: True CSS-first theme switching synchronized through `next-themes` and Tailwind v4 CSS variables.
- **Adaptive Glassmorphism**: Frosted glass navigation bars and floating cards that automatically adapt to light and dark backgrounds.
- **Zero Layout Shifts**: SSR-safe theme toggle and hydration-safe relative timestamps.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16.3.5](https://nextjs.org/) (Turbopack, App Router, Server Components & Server Actions) |
| **UI Library** | [React 19.2.8](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with native `@theme` CSS tokens |
| **Database ORM** | [Prisma 7.10](https://www.prisma.io/) with `@prisma/adapter-pg` driver adapter |
| **Database** | [PostgreSQL 15+](https://www.postgresql.org/) |
| **Authentication** | [Auth.js / NextAuth v5](https://authjs.dev/) with bcrypt credential hashing |
| **Validation** | [Zod 4.x](https://zod.dev/) for robust server action & API schemas |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Date Utilities** | [date-fns](https://date-fns.org/) |

---

## 📁 Project Structure

```text
csblog/
├── prisma/
│   ├── schema.prisma          # PostgreSQL relational schema (Users, Articles, CVEs, Threats, etc.)
│   └── seed.ts                # Database seed script with sample intelligence & demo accounts
├── src/
│   ├── app/
│   │   ├── (auth)/            # Auth routes: /auth/login, /auth/register, /auth/forgot-password
│   │   ├── (public)/          # Public routes: /, /articles, /threat-intelligence, /vulnerabilities, etc.
│   │   ├── admin/             # RBAC-protected Admin Center (/admin/*)
│   │   ├── api/               # API routes: Auth, articles, newsletter subscription
│   │   ├── dashboard/         # Authenticated User Dashboard (/dashboard/*)
│   │   ├── globals.css        # Tailwind v4 theme tokens, light/dark variables, cyber effects
│   │   └── layout.tsx         # Root layout with ThemeProvider, SessionProvider, Toaster
│   ├── components/
│   │   ├── articles/          # ArticleCard, ArticleActions, ArticleMeta
│   │   ├── layout/            # Sticky Glass Navbar, Footer
│   │   ├── providers/         # NextThemes ThemeProvider, NextAuth SessionProvider
│   │   ├── shared/            # NewsletterForm, SearchModal
│   │   └── ui/                # Badge, Toaster
│   ├── lib/
│   │   ├── auth.ts            # Auth.js configuration & credentials provider
│   │   ├── db.ts              # PrismaClient singleton with connection pooling
│   │   ├── rbac.ts            # Role hierarchy and route protection helpers
│   │   ├── utils.ts           # Styling (cn) and formatting helpers
│   │   ├── services/          # Business logic: articles, audit logging, email
│   │   └── validations/       # Zod schemas for forms and API requests
│   └── types/                 # TypeScript interfaces and module augmentations
├── .env.example               # Environment variable blueprint
├── next.config.ts             # Next.js 16 configuration
└── package.json               # Dependencies and scripts
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v20.x or higher
- [PostgreSQL](https://www.postgresql.org/) v15+ running locally or in the cloud (e.g. Neon, Supabase)
- Git

### 2. Clone the Repository
```bash
git clone https://github.com/aremcx/cyberpulse.git
cd cyberpulse
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the example environment file and configure your credentials:
```bash
cp .env.example .env
```
Edit `.env` with your values:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cyberpulse?schema=public"

# NextAuth / Auth.js
AUTH_SECRET="your-32-character-random-secret"
AUTH_URL="http://localhost:3000"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="CyberPulse"
```
> Tip: Generate a secure `AUTH_SECRET` by running:
> ```bash
> openssl rand -base64 32
> ```

### 5. Setup Database & Seed Data
Push the Prisma schema to your database and seed initial threat intelligence, articles, and users:
```bash
# Push schema to database
npm run db:push

# Seed demo articles, CVEs, threats, and user accounts
npm run db:seed
```

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials (Local Seed)

All demo accounts share the password: `CyberPulse2026!`

| Role | Email | Access |
|---|---|---|
| **Super Admin** | `admin@cyberpulse.io` | Full Admin Center (`/admin/*`) & Dashboard |
| **Editor** | `editor@cyberpulse.io` | Article editorial review & publishing |
| **Author** | `author1@cyberpulse.io` | Article drafting & submission (`/dashboard/articles/new`) |
| **Reader** | `reader@cyberpulse.io` | Bookmarks, profile customization, comments |

---

## ☁️ Recommended Hosting & Deployment Guide

For a modern Next.js 16 application with Server Components, Server Actions, and a PostgreSQL database, here are the recommended hosting architectures:

### Option A: Vercel + Neon Postgres (Recommended for Serverless)
**Best for**: Instant Git deployments, preview environments on every branch/PR, and zero infrastructure maintenance.

1. **Database (Neon Serverless Postgres)**:
   - Create a free project at [neon.tech](https://neon.tech).
   - Copy the connection string with connection pooling enabled:
     ```env
     DATABASE_URL="postgresql://<user>:<pass>@<pooler-host>/<db>?sslmode=require&pgbouncer=true"
     ```
2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) → **Add New Project** → Import `https://github.com/aremcx/cyberpulse.git`.
   - Add your environment variables (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_APP_URL`).
   - In Build Settings, set Build Command to:
     ```bash
     prisma generate && next build
     ```
   - Click **Deploy**.

### Option B: Railway (Recommended for Full-Stack PaaS / Containers)
**Best for**: Co-located database and server, no serverless execution timeout limits, low database latency.

1. Create a project at [railway.app](https://railway.app).
2. Add a **PostgreSQL** service with 1 click.
3. Add a **GitHub Repo** service connected to `aremcx/cyberpulse`.
4. Railway will automatically link `DATABASE_URL`.
5. Set `AUTH_SECRET` and `AUTH_URL`.
6. Railway automatically builds and runs `npm run build && npm start`.

### Option C: Self-Hosted Docker / Coolify VPS
**Best for**: Total data sovereignty, compliance, and fixed monthly server costs (e.g. Hetzner, DigitalOcean).

You can containerize the application using Next.js standalone output:
1. Enable `output: "standalone"` in `next.config.ts`.
2. Run PostgreSQL and Next.js via `docker-compose.yml`.

---

## 🧪 Pre-Hosting Verification Checklist

Before launching to production, run through this validation sequence:

```bash
# 1. Validate Prisma schema integrity
npx prisma validate

# 2. Check TypeScript types across all 49 routes
npx tsc --noEmit

# 3. Verify production compilation and static optimization
npm run build

# 4. Test production runtime locally
npm run start
```

### Pre-Launch Checklist:
- [ ] **Database Migrations**: Run `npx prisma migrate deploy` in your production pipeline.
- [ ] **Auth Secret**: Ensure `AUTH_SECRET` is a fresh 32+ character random string (never use the development string).
- [ ] **SSL / TLS**: Ensure `DATABASE_URL` specifies `?sslmode=require` when connecting to managed cloud databases.
- [ ] **Domain Configuration**: Set `NEXT_PUBLIC_APP_URL` and `AUTH_URL` to your production domain (e.g. `https://cyberpulse.io`).
- [ ] **Role Permissions**: Change default seed passwords or disable demo accounts in production.

---

## 📜 Available NPM Scripts

- `npm run dev` — Launch development server with Turbopack on port 3000
- `npm run build` — Build optimized production bundle
- `npm run start` — Run production server
- `npm run db:push` — Push Prisma schema directly to database
- `npm run db:migrate` — Create and apply Prisma database migrations
- `npm run db:seed` — Populate database with threat intelligence, articles, and demo accounts
- `npm run db:studio` — Open interactive Prisma Studio GUI at [http://localhost:5555](http://localhost:5555)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
