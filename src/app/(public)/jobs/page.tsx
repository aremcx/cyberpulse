// src/app/(public)/jobs/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { formatRelativeDate } from '@/lib/utils'
import { Briefcase, MapPin, Clock, Globe, Search, Filter } from 'lucide-react'
import { WorkMode, JobType, ExperienceLevel } from '@prisma/client'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cybersecurity Jobs in Africa & Beyond',
  description: 'Find the best cybersecurity jobs in Nigeria, Africa, and globally. Roles in SOC, penetration testing, cloud security, GRC, and more.',
}

interface JobsPageProps {
  searchParams: Promise<{
    q?: string
    region?: string
    workMode?: string
    jobType?: string
    page?: string
  }>
}

const workModeLabels: Record<WorkMode, string> = {
  ONSITE: 'On-site',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
}

const jobTypeLabels: Record<JobType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
}

const workModeColors: Record<WorkMode, string> = {
  REMOTE: 'bg-green-500/10 text-green-400 border-green-500/20',
  HYBRID: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  ONSITE: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
}

async function JobList({ filters }: { filters: Awaited<JobsPageProps['searchParams']> }) {
  const page = Math.max(1, parseInt(filters.page ?? '1'))
  const limit = 15
  const skip = (page - 1) * limit

  const where = {
    isActive: true,
    ...(filters.workMode ? { workMode: filters.workMode as WorkMode } : {}),
    ...(filters.jobType ? { jobType: filters.jobType as JobType } : {}),
    ...(filters.region ? { region: { contains: filters.region, mode: 'insensitive' as const } } : {}),
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: 'insensitive' as const } },
            { company: { contains: filters.q, mode: 'insensitive' as const } },
            { description: { contains: filters.q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [jobs, total] = await Promise.all([
    db.job.findMany({ where, orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }], skip, take: limit }),
    db.job.count({ where }),
  ])

  const pages = Math.ceil(total / limit)

  if (!jobs.length) {
    return (
      <div className="text-center py-20 rounded-2xl border border-border">
        <Briefcase className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
        <p className="font-medium text-foreground">No jobs found</p>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search filters.</p>
      </div>
    )
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">{total} positions available</p>
      <div className="flex flex-col gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`p-5 rounded-2xl border transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 ${
              job.featured ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
            }`}
          >
            {job.featured && (
              <span className="inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-primary/20 text-primary mb-3">
                ⚡ Featured
              </span>
            )}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-foreground text-lg hover:text-primary transition-colors">
                  {job.applicationUrl ? (
                    <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                      {job.title}
                    </a>
                  ) : job.title}
                </h2>
                <p className="text-muted-foreground mt-0.5">{job.company}</p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <span className={`px-2 py-0.5 text-xs rounded-full border font-medium ${workModeColors[job.workMode]}`}>
                  {workModeLabels[job.workMode]}
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground border border-border">
                  {jobTypeLabels[job.jobType]}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
              )}
              {job.region && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  {job.region}
                </span>
              )}
              {job.closingDate && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Closes {formatRelativeDate(job.closingDate)}
                </span>
              )}
              {job.salaryMin && job.salaryMax && (
                <span className="text-green-400 font-medium">
                  {job.salaryCurrency} {job.salaryMin.toLocaleString()}–{job.salaryMax.toLocaleString()}
                </span>
              )}
            </div>

            {job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.skills.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Posted {formatRelativeDate(job.createdAt)}
              </span>
              {job.applicationUrl && (
                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  id={`apply-job-${job.id}`}
                >
                  Apply Now
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(pages, 10) }, (_, i) => i + 1).map((p) => (
            <a key={p} href={`?${new URLSearchParams({ ...filters, page: String(p) }).toString()}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-muted/60'
              }`}>{p}</a>
          ))}
        </div>
      )}
    </>
  )
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const filters = await searchParams

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Briefcase className="w-7 h-7 text-teal-400" />
          <h1 className="text-3xl font-black text-foreground">Cybersecurity Jobs</h1>
        </div>
        <p className="text-muted-foreground">
          Discover cybersecurity opportunities across Africa and beyond.
        </p>
      </div>

      {/* Filters */}
      <form method="get" className="mb-8 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={filters.q ?? ''}
            placeholder="Job title, company, skill..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            id="job-search"
          />
        </div>
        <select name="workMode" defaultValue={filters.workMode ?? ''}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary"
          id="work-mode-filter">
          <option value="">All Work Modes</option>
          {Object.entries(workModeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select name="jobType" defaultValue={filters.jobType ?? ''}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary"
          id="job-type-filter">
          <option value="">All Job Types</option>
          {Object.entries(jobTypeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select name="region" defaultValue={filters.region ?? ''}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary"
          id="region-filter">
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Global">Global</option>
        </select>
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors" id="job-search-submit">
          Search
        </button>
        <Link href="/jobs" className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
          Clear
        </Link>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Suspense fallback={<div className="space-y-4">{[1,2,3].map(i=><div key={i} className="skeleton h-40 rounded-2xl"/>)}</div>}>
            <JobList filters={filters} />
          </Suspense>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5">
            <h3 className="font-bold text-foreground mb-2">Post a Job</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Reach thousands of cybersecurity professionals across Africa.
            </p>
            <a href="/contact?subject=job-posting"
              className="block w-full text-center px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
              Post Your Job
            </a>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card">
            <h3 className="font-bold text-foreground mb-3">Career Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/articles?category=careers" className="hover:text-primary transition-colors">→ Career guides</Link></li>
              <li><Link href="/articles?q=certification" className="hover:text-primary transition-colors">→ Certification paths</Link></li>
              <li><Link href="/academy" className="hover:text-primary transition-colors">→ Free courses</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
