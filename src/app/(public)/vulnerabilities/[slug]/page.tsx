// src/app/(public)/vulnerabilities/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import { SeverityBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import {
  Bug, ExternalLink, ArrowLeft, ShieldAlert, CheckCircle2
} from 'lucide-react'

interface VulnDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: VulnDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const vuln = await db.vulnerability.findUnique({
    where: { slug },
  })

  if (!vuln) {
    return { title: 'Vulnerability Not Found | CyberPulse' }
  }

  return {
    title: `${vuln.cveId ?? vuln.title} — Vulnerability Intelligence | CyberPulse`,
    description: vuln.description.slice(0, 160),
  }
}

export default async function VulnerabilityDetailPage({ params }: VulnDetailPageProps) {
  const { slug } = await params

  const vuln = await db.vulnerability.findUnique({
    where: { slug },
  })

  if (!vuln) {
    notFound()
  }

  // Related vulnerabilities by severity or vendor
  const related = await db.vulnerability.findMany({
    where: {
      id: { not: vuln.id },
      OR: [
        { affectedVendor: vuln.affectedVendor ?? undefined },
        { severity: vuln.severity },
      ],
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  })

  const cvssColor =
    !vuln.cvssScore ? 'text-muted-foreground' :
    vuln.cvssScore >= 9 ? 'text-red-500' :
    vuln.cvssScore >= 7 ? 'text-orange-500' :
    vuln.cvssScore >= 4 ? 'text-yellow-500' : 'text-green-500'

  const references = Array.isArray(vuln.references)
    ? (vuln.references as string[])
    : typeof vuln.references === 'string'
    ? [vuln.references]
    : []

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Breadcrumb / Back Link */}
      <div className="mb-6">
        <Link
          href="/vulnerabilities"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vulnerability Database
        </Link>
      </div>

      {/* Header card */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {vuln.cveId && (
            <span className="font-mono text-base md:text-lg font-black text-primary px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
              {vuln.cveId}
            </span>
          )}
          <SeverityBadge severity={vuln.severity} className="text-xs px-3 py-1" />
          {vuln.isKev && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-500/10 text-red-500 border border-red-500/30 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              CISA Known Exploited
            </span>
          )}
          {vuln.isPoc && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
              PoC Available
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-foreground mb-4 leading-tight">
          {vuln.title}
        </h1>

        {/* Quick meta bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/60 text-sm">
          <div>
            <span className="text-xs text-muted-foreground block mb-0.5">Published</span>
            <span className="font-medium text-foreground" suppressHydrationWarning>
              {vuln.publishedAt ? formatDate(vuln.publishedAt) : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-0.5">Last Updated</span>
            <span className="font-medium text-foreground" suppressHydrationWarning>
              {formatDate(vuln.updatedAt)}
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-0.5">Affected Vendor</span>
            <span className="font-medium text-foreground">
              {vuln.affectedVendor ?? 'Unspecified'}
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-0.5">Affected Product</span>
            <span className="font-medium text-foreground">
              {vuln.affectedProduct ?? 'Unspecified'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Bug className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Description</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
              {vuln.description}
            </div>
          </section>

          {/* Remediation */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-foreground">Remediation & Mitigation</h2>
            </div>
            {vuln.remediation ? (
              <div className="p-4 rounded-xl bg-muted/40 border border-border text-foreground text-sm leading-relaxed whitespace-pre-line">
                {vuln.remediation}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No vendor patch or official workaround specified yet. Review affected systems and isolate network access if exposed.
              </p>
            )}
          </section>

          {/* References */}
          {references.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <ExternalLink className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">References & Advisories</h2>
              </div>
              <ul className="space-y-2">
                {references.map((refUrl, idx) => (
                  <li key={idx}>
                    <a
                      href={refUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1.5 break-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      {refUrl}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* CVSS Score box */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              CVSS Severity Metrics
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-4xl font-black ${cvssColor}`}>
                {vuln.cvssScore ? vuln.cvssScore.toFixed(1) : 'N/A'}
              </span>
              <span className="text-xs text-muted-foreground">
                {vuln.cvssVersion ? `Version ${vuln.cvssVersion}` : 'CVSS Score'}
              </span>
            </div>

            {vuln.cvssScore && (
              <div className="w-full bg-muted rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${
                    vuln.cvssScore >= 9 ? 'bg-red-500' :
                    vuln.cvssScore >= 7 ? 'bg-orange-500' :
                    vuln.cvssScore >= 4 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(vuln.cvssScore / 10) * 100}%` }}
                />
              </div>
            )}

            {vuln.cvssVector && (
              <div className="mt-3">
                <span className="text-xs text-muted-foreground block mb-1">Vector String:</span>
                <code className="text-xs font-mono bg-muted/60 p-2 rounded-lg block break-all text-foreground">
                  {vuln.cvssVector}
                </code>
              </div>
            )}
          </div>

          {/* Software specifics */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Affected Software
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Vendor</dt>
                <dd className="font-medium text-foreground">{vuln.affectedVendor ?? 'Unknown'}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Product</dt>
                <dd className="font-medium text-foreground">{vuln.affectedProduct ?? 'Unknown'}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Affected Versions</dt>
                <dd className="font-mono text-xs text-foreground bg-muted/50 p-2 rounded-lg mt-0.5">
                  {vuln.affectedVersions ?? 'Not specified'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Related vulnerabilities */}
          {related.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Related CVEs
              </h3>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/vulnerabilities/${r.slug}`}
                    className="block p-3 rounded-xl border border-border/70 hover:border-primary/40 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-primary">{r.cveId ?? r.slug}</span>
                      <SeverityBadge severity={r.severity} />
                    </div>
                    <p className="text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {r.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
