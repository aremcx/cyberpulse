// src/app/(public)/vulnerabilities/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import { SeverityBadge } from '@/components/ui/Badge'
import { formatRelativeDate } from '@/lib/utils'
import { Bug, Shield, AlertTriangle, TrendingUp, Search } from 'lucide-react'
import { VulnerabilitySeverity } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Vulnerability Database',
  description: 'Track critical CVEs, security advisories, and vulnerability intelligence across software and systems.',
}

interface VulnsPageProps {
  searchParams: Promise<{
    severity?: string
    page?: string
    q?: string
    kev?: string
  }>
}

const severityOptions: { value: string; label: string; color: string }[] = [
  { value: '', label: 'All', color: '' },
  { value: 'CRITICAL', label: 'Critical', color: 'text-red-500' },
  { value: 'HIGH', label: 'High', color: 'text-orange-500' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-500' },
  { value: 'LOW', label: 'Low', color: 'text-green-500' },
  { value: 'INFORMATIONAL', label: 'Info', color: 'text-blue-500' },
]

async function VulnStats() {
  const [total, critical, high, kev] = await Promise.all([
    db.vulnerability.count(),
    db.vulnerability.count({ where: { severity: VulnerabilitySeverity.CRITICAL } }),
    db.vulnerability.count({ where: { severity: VulnerabilitySeverity.HIGH } }),
    db.vulnerability.count({ where: { isKev: true } }),
  ])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Total CVEs', value: total, icon: Bug, color: 'text-foreground' },
        { label: 'Critical', value: critical, icon: AlertTriangle, color: 'text-red-500' },
        { label: 'High', value: high, icon: TrendingUp, color: 'text-orange-500' },
        { label: 'CISA KEV', value: kev, icon: Shield, color: 'text-primary' },
      ].map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="p-4 rounded-2xl border border-border bg-card text-center">
            <Icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
            <p className="text-2xl font-black text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}

async function VulnTable({ filters }: { filters: Awaited<VulnsPageProps['searchParams']> }) {
  const page = Math.max(1, parseInt(filters.page ?? '1'))
  const limit = 20
  const skip = (page - 1) * limit

  const where = {
    ...(filters.severity ? { severity: filters.severity as VulnerabilitySeverity } : {}),
    ...(filters.kev === 'true' ? { isKev: true } : {}),
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: 'insensitive' as const } },
            { cveId: { contains: filters.q, mode: 'insensitive' as const } },
            { affectedProduct: { contains: filters.q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [vulns, total] = await Promise.all([
    db.vulnerability.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }],
      skip,
      take: limit,
    }),
    db.vulnerability.count({ where }),
  ])

  const pages = Math.ceil(total / limit)

  if (!vulns.length) {
    return (
      <div className="text-center py-20 rounded-2xl border border-border">
        <Bug className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
        <p className="font-medium text-foreground">No vulnerabilities found</p>
        <p className="text-sm text-muted-foreground mt-1">Try a different search or filter.</p>
      </div>
    )
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">{total} vulnerabilities found</p>
      <div className="rounded-2xl border border-border overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Vulnerability</span>
          <span className="w-24 text-center">Severity</span>
          <span className="w-14 text-center">CVSS</span>
          <span className="w-20 text-center">KEV</span>
          <span className="w-28 text-right">Published</span>
        </div>

        {vulns.map((vuln) => (
          <Link
            key={vuln.id}
            href={`/vulnerabilities/${vuln.slug}`}
            className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 border-t border-border hover:bg-muted/30 transition-colors items-center group"
          >
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                {vuln.cveId && (
                  <span className="font-mono text-xs font-bold text-primary">{vuln.cveId}</span>
                )}
                {vuln.isPoc && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-500/20 text-red-400 border border-red-500/30">PoC</span>
                )}
              </div>
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {vuln.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {[vuln.affectedVendor, vuln.affectedProduct, vuln.affectedVersions].filter(Boolean).join(' · ')}
              </p>
            </div>

            <div className="w-24 flex justify-center">
              <SeverityBadge severity={vuln.severity} />
            </div>

            <div className="w-14 text-center">
              {vuln.cvssScore ? (
                <span className={`text-sm font-bold ${
                  vuln.cvssScore >= 9 ? 'text-red-400' :
                  vuln.cvssScore >= 7 ? 'text-orange-400' :
                  vuln.cvssScore >= 4 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {vuln.cvssScore.toFixed(1)}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">N/A</span>
              )}
            </div>

            <div className="w-20 flex justify-center">
              {vuln.isKev ? (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                  KEV
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>

            <div className="w-28 text-right text-xs text-muted-foreground">
              {vuln.publishedAt ? formatRelativeDate(vuln.publishedAt) : '—'}
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(pages, 10) }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?${new URLSearchParams({ ...filters, page: String(p) }).toString()}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground hover:bg-muted/60'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </>
  )
}

export default async function VulnerabilitiesPage({ searchParams }: VulnsPageProps) {
  const filters = await searchParams

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Bug className="w-7 h-7 text-red-400" />
          <h1 className="text-3xl font-black text-foreground">Vulnerability Database</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Track critical CVEs, security advisories, and vulnerability intelligence. Updated continuously from public disclosure feeds.
        </p>
      </div>

      {/* Stats */}
      <Suspense fallback={<div className="grid grid-cols-4 gap-4 mb-8">{[1,2,3,4].map(i=><div key={i} className="skeleton h-24 rounded-2xl"/>)}</div>}>
        <VulnStats />
      </Suspense>

      {/* Filters */}
      <form method="get" className="mb-6 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={filters.q ?? ''}
            placeholder="Search CVE ID, product, keyword..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            id="vuln-search"
          />
        </div>

        {/* Severity */}
        <select
          name="severity"
          defaultValue={filters.severity ?? ''}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary"
          id="severity-filter"
        >
          {severityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* KEV */}
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            name="kev"
            value="true"
            defaultChecked={filters.kev === 'true'}
            className="rounded border-border"
            id="kev-filter"
          />
          CISA KEV only
        </label>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          id="vuln-filter-submit"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <Suspense fallback={<div className="skeleton h-96 rounded-2xl" />}>
        <VulnTable filters={filters} />
      </Suspense>
    </div>
  )
}
