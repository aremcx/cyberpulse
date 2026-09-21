// src/app/admin/vulnerabilities/page.tsx
import { db } from '@/lib/db'
import { VulnerabilitySeverity } from '@prisma/client'
import { SeverityBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Bug, Search, ExternalLink, ShieldAlert } from 'lucide-react'

interface AdminVulnsProps {
  searchParams: Promise<{ q?: string; severity?: string; kev?: string }>
}

export const metadata = {
  title: 'Vulnerability Management | CyberPulse Admin',
}

export default async function AdminVulnerabilitiesPage({ searchParams }: AdminVulnsProps) {
  const { q, severity, kev } = await searchParams

  const where: {
    severity?: VulnerabilitySeverity
    isKev?: boolean
    OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; cveId?: { contains: string; mode: 'insensitive' }; affectedProduct?: { contains: string; mode: 'insensitive' } }>
  } = {}

  if (severity && Object.values(VulnerabilitySeverity).includes(severity as VulnerabilitySeverity)) {
    where.severity = severity as VulnerabilitySeverity
  }

  if (kev === 'true') {
    where.isKev = true
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { cveId: { contains: q, mode: 'insensitive' } },
      { affectedProduct: { contains: q, mode: 'insensitive' } },
    ]
  }

  const [vulns, totalCount] = await Promise.all([
    db.vulnerability.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }],
      take: 50,
    }),
    db.vulnerability.count({ where }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Vulnerability Database</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor and administer CVE tracking, CVSS metrics, and CISA KEV disclosures
          </p>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          Total Tracked: <span className="font-bold text-foreground">{totalCount}</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form method="GET" className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <input
              name="q"
              defaultValue={q ?? ''}
              placeholder="Search CVE ID, title, product..."
              className="w-full px-4 py-2 pl-10 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-primary"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <select
            name="severity"
            defaultValue={severity ?? ''}
            className="px-4 py-2 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-primary"
          >
            <option value="">All Severities</option>
            {Object.values(VulnerabilitySeverity).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
          <span>Vulnerability</span>
          <span className="w-24 text-center">Severity</span>
          <span className="w-16 text-center">CVSS</span>
          <span className="w-24 text-center">Status</span>
          <span className="w-28 text-right">Published</span>
        </div>

        {vulns.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No vulnerabilities match the criteria.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {vulns.map((vuln) => (
              <div key={vuln.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {vuln.cveId && (
                      <span className="font-mono text-xs font-bold text-primary">{vuln.cveId}</span>
                    )}
                    <Link
                      href={`/vulnerabilities/${vuln.slug}`}
                      className="text-sm font-bold text-foreground hover:text-primary transition-colors truncate"
                    >
                      {vuln.title}
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {[vuln.affectedVendor, vuln.affectedProduct].filter(Boolean).join(' · ')}
                  </p>
                </div>

                <div className="w-24 flex justify-center">
                  <SeverityBadge severity={vuln.severity} />
                </div>

                <div className="w-16 text-center font-bold text-sm">
                  {vuln.cvssScore ? vuln.cvssScore.toFixed(1) : '—'}
                </div>

                <div className="w-24 flex justify-center gap-1">
                  {vuln.isKev && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      KEV
                    </span>
                  )}
                  {vuln.isPoc && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      PoC
                    </span>
                  )}
                  {!vuln.isKev && !vuln.isPoc && (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>

                <span className="w-28 text-right text-xs text-muted-foreground" suppressHydrationWarning>
                  {vuln.publishedAt ? formatDate(vuln.publishedAt) : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
