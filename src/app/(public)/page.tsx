// src/app/(public)/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import {
  Shield, ArrowRight, ChevronRight, Zap, Globe, BookOpen,
  Radio, Bug, Briefcase, TrendingUp, Clock, AlertTriangle
} from 'lucide-react'
import {
  getFeaturedArticles,
  getTrendingArticles,
  getLatestArticles,
  getDashboardStats,
} from '@/lib/services/articles'
import { db } from '@/lib/db'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { SeverityBadge } from '@/components/ui/Badge'
import { formatRelativeDate, formatNumber } from '@/lib/utils'
import { VulnerabilitySeverity } from '@prisma/client'
import { NewsletterForm } from '@/components/shared/NewsletterForm'

export const metadata = {
  title: 'CyberPulse — Cybersecurity Knowledge & Intelligence Platform',
  description:
    'Stay ahead of cyber threats with real-time intelligence, in-depth tutorials, CVE tracking, and a vibrant security community.',
}

// Skeleton components
function SectionSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-border p-5 space-y-3">
          <div className="skeleton h-40 w-full rounded-lg" />
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background cyber-grid min-h-[85vh] flex items-center">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-600/5" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-4xl">
          {/* Tag line */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Africa&apos;s Premier Cybersecurity Platform
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6 animate-fade-in">
            Stay Ahead of{' '}
            <span className="gradient-text">Cyber Threats</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed animate-fade-in">
            Intelligence-driven cybersecurity news, tutorials, CVE tracking, threat research,
            and career resources — built for defenders across Africa and the world.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12 animate-fade-in">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all cyber-glow hover:scale-105"
              id="hero-read-articles"
            >
              Explore Articles
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted/60 hover:border-primary/40 transition-all"
              id="hero-get-started"
            >
              Join the Community
            </Link>
          </div>

          {/* Stats */}
          <Suspense fallback={null}>
            <HeroStats />
          </Suspense>
        </div>
      </div>

      {/* Decorative terminal */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block w-[420px] mr-8">
        <div className="glass-dark rounded-2xl border border-border p-5 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs font-mono text-muted-foreground">threat-feed.sh</span>
          </div>
          <div className="font-mono text-xs space-y-2">
            <p className="text-primary">$ ./monitor --live</p>
            <p className="text-green-400">✓ Connected to threat intelligence feeds</p>
            <p className="text-muted-foreground">[INFO] Monitoring 847 indicators...</p>
            <p className="text-yellow-400">[ALERT] CVE-2026-1337 — CVSS 9.8 Critical</p>
            <p className="text-muted-foreground">[INFO] Affected: Apache Struts &lt;2.5.32</p>
            <p className="text-red-400">[THREAT] APT41 — New campaign detected</p>
            <p className="text-muted-foreground">[INFO] Target: Financial sector, West Africa</p>
            <p className="text-green-400">✓ Mitigation guidance available</p>
            <p className="text-primary terminal-cursor">$ _</p>
          </div>
        </div>
      </div>
    </section>
  )
}

async function HeroStats() {
  const stats = await getDashboardStats()

  const displayStats = [
    { label: 'Articles Published', value: formatNumber(stats.publishedArticles), icon: BookOpen },
    { label: 'Community Members', value: formatNumber(stats.totalUsers), icon: Globe },
    { label: 'Vulnerabilities Tracked', value: formatNumber(stats.totalVulnerabilities), icon: Bug },
    { label: 'Security Tools', value: formatNumber(stats.totalTools), icon: Shield },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {displayStats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-2xl font-black text-foreground">{stat.value}</span>
            </div>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// Featured articles
async function FeaturedArticlesSection() {
  const articles = await getFeaturedArticles(4)
  if (!articles.length) return null

  const [main, ...rest] = articles

  return (
    <section className="py-16 container mx-auto px-4">
      <SectionHeader
        icon={<Zap className="w-5 h-5 text-primary" />}
        title="Featured"
        description="Editor's picks and must-read security content"
        href="/articles?featured=true"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Main featured */}
        <div className="lg:col-span-2">
          <ArticleCard article={main as never} variant="featured" />
        </div>

        {/* Side featured */}
        <div className="flex flex-col gap-4">
          {rest.map((article) => (
            <ArticleCard key={article.id} article={article as never} variant="horizontal" />
          ))}
        </div>
      </div>
    </section>
  )
}

// Latest news
async function LatestNewsSection() {
  const articles = await getLatestArticles('NEWS' as never, 6)
  if (!articles.length) return null

  return (
    <section className="py-16 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <SectionHeader
          icon={<Radio className="w-5 h-5 text-blue-400" />}
          title="Latest News"
          description="Stay current with the cybersecurity landscape"
          href="/news"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article as never} showExcerpt={false} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Trending articles
async function TrendingSection() {
  const articles = await getTrendingArticles(5)
  if (!articles.length) return null

  return (
    <section className="py-16 container mx-auto px-4">
      <SectionHeader
        icon={<TrendingUp className="w-5 h-5 text-orange-400" />}
        title="Trending"
        description="Most read articles this week"
        href="/articles?sort=popular"
      />
      <div className="mt-8 flex flex-col gap-3">
        {articles.map((article, i) => (
          <div key={article.id} className="flex items-start gap-4 group">
            <span className="text-4xl font-black text-muted/50 w-8 shrink-0 leading-none mt-1">
              {String(i + 1).padStart(2, '0')}
            </span>
            <ArticleCard article={article as never} variant="horizontal" className="flex-1" />
          </div>
        ))}
      </div>
    </section>
  )
}

// Latest tutorials
async function TutorialsSection() {
  const articles = await getLatestArticles('TUTORIAL' as never, 3)
  if (!articles.length) return null

  return (
    <section className="py-16 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <SectionHeader
          icon={<BookOpen className="w-5 h-5 text-purple-400" />}
          title="Popular Tutorials"
          description="Level up your cybersecurity skills"
          href="/tutorials"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article as never} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Latest vulnerabilities
async function VulnerabilitiesSection() {
  const vulns = await db.vulnerability.findMany({
    orderBy: [{ publishedAt: 'desc' }],
    take: 5,
  })

  if (!vulns.length) return null

  return (
    <section className="py-16 container mx-auto px-4">
      <SectionHeader
        icon={<Bug className="w-5 h-5 text-red-400" />}
        title="Recent Vulnerabilities"
        description="Track critical CVEs and security advisories"
        href="/vulnerabilities"
      />
      <div className="mt-8 rounded-2xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <span>Vulnerability</span>
          <span className="w-24 text-center">Severity</span>
          <span className="w-20 text-center">CVSS</span>
          <span className="w-24 text-center">Published</span>
        </div>
        {vulns.map((vuln) => (
          <Link
            key={vuln.id}
            href={`/vulnerabilities/${vuln.slug}`}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-4 border-t border-border hover:bg-muted/30 transition-colors items-center group"
          >
            <div>
              {vuln.cveId && (
                <span className="font-mono text-xs text-primary mr-2">{vuln.cveId}</span>
              )}
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {vuln.title}
              </span>
              {vuln.affectedProduct && (
                <span className="text-xs text-muted-foreground block mt-0.5">
                  {vuln.affectedVendor && `${vuln.affectedVendor} · `}{vuln.affectedProduct}
                </span>
              )}
            </div>
            <SeverityBadge severity={vuln.severity} className="w-24 justify-center" />
            <span className="text-sm font-mono text-center w-20">
              {vuln.cvssScore ? (
                <span className={cn(
                  'font-bold',
                  vuln.cvssScore >= 9 ? 'text-red-400' :
                  vuln.cvssScore >= 7 ? 'text-orange-400' :
                  vuln.cvssScore >= 4 ? 'text-yellow-400' : 'text-green-400'
                )}>
                  {vuln.cvssScore.toFixed(1)}
                </span>
              ) : '—'}
            </span>
            <span className="text-xs text-muted-foreground text-center w-24" suppressHydrationWarning>
              {vuln.publishedAt ? formatRelativeDate(vuln.publishedAt) : '—'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// Featured tools
async function ToolsSection() {
  const tools = await db.tool.findMany({
    where: { featured: true },
    take: 4,
    orderBy: { name: 'asc' },
  })

  if (!tools.length) return null

  return (
    <section className="py-16 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <SectionHeader
          icon={<Shield className="w-5 h-5 text-emerald-400" />}
          title="Featured Tools"
          description="Essential tools for every security professional"
          href="/tools"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 text-xl">
                {tool.logo ? (
                  <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain rounded-xl" />
                ) : '🔧'}
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                {tool.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{tool.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {tool.category}
                </span>
                {tool.isOpenSource && (
                  <span className="text-xs text-green-400 font-medium">Open Source</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Jobs section
async function JobsSection() {
  const jobs = await db.job.findMany({
    where: { isActive: true },
    take: 4,
    orderBy: { createdAt: 'desc' },
  })

  if (!jobs.length) return null

  return (
    <section className="py-16 container mx-auto px-4">
      <SectionHeader
        icon={<Briefcase className="w-5 h-5 text-teal-400" />}
        title="Cybersecurity Jobs"
        description="Career opportunities in cybersecurity"
        href="/jobs"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {job.company}
                  {job.location && ` · ${job.location}`}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                  {job.workMode.toLowerCase()}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                  {job.jobType.toLowerCase().replace('_', '-')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {job.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Newsletter CTA
function NewsletterSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-600/10" />
      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
            <AlertTriangle className="w-3.5 h-3.5" />
            Don&apos;t miss critical security updates
          </div>
          <h2 className="text-4xl font-black mb-4">
            Get <span className="gradient-text">Cyber Intelligence</span>
            <br />Delivered to Your Inbox
          </h2>
          <p className="text-muted-foreground mb-8">
            Weekly digest of cybersecurity news, critical vulnerabilities, threat intelligence,
            and career opportunities. Join {formatNumber(2847)}+ security professionals.
          </p>
          <NewsletterForm id="homepage-newsletter" />
          <p className="text-xs text-muted-foreground mt-4">
            No spam. Unsubscribe at any time. Read our{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </section>
  )
}

// Helper: Section Header
function SectionHeader({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <h2 className="text-2xl font-black text-foreground">{title}</h2>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Link
        href={href}
        className="shrink-0 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        View all
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Main Page
export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <Suspense fallback={<div className="py-16 container mx-auto px-4"><SectionSkeleton /></div>}>
        <FeaturedArticlesSection />
      </Suspense>

      <Suspense fallback={null}>
        <LatestNewsSection />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-0">
        <Suspense fallback={null}>
          <TrendingSection />
        </Suspense>

        <div className="border-l border-border py-16 px-8">
          <Suspense fallback={null}>
            <VulnerabilitiesSection />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={null}>
        <TutorialsSection />
      </Suspense>

      <Suspense fallback={null}>
        <ToolsSection />
      </Suspense>

      <Suspense fallback={null}>
        <JobsSection />
      </Suspense>

      <NewsletterSection />
    </div>
  )
}
