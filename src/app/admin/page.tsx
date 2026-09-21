// src/app/admin/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import {
  FileText, Users, Bug, MessageSquare, Mail, TrendingUp,
  ArrowUpRight, Clock, CheckCircle, AlertTriangle, Eye, Heart, Shield
} from 'lucide-react'
import { getDashboardStats, getAllArticles } from '@/lib/services/articles'
import { db } from '@/lib/db'
import { formatNumber, formatRelativeDate } from '@/lib/utils'
import { ArticleStatus } from '@prisma/client'
import { SeverityBadge } from '@/components/ui/Badge'

export const metadata = {
  title: 'Admin Dashboard',
}

async function StatsGrid() {
  const stats = await getDashboardStats()

  const cards = [
    {
      label: 'Total Users',
      value: formatNumber(stats.totalUsers),
      subLabel: `${formatNumber(stats.activeUsers)} active`,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      href: '/admin/users',
    },
    {
      label: 'Published Articles',
      value: formatNumber(stats.publishedArticles),
      subLabel: `${formatNumber(stats.draftArticles)} drafts`,
      icon: FileText,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      href: '/admin/articles',
    },
    {
      label: 'Pending Review',
      value: formatNumber(stats.pendingReviews),
      subLabel: 'articles await approval',
      icon: Clock,
      color: stats.pendingReviews > 0 ? 'text-yellow-400' : 'text-muted-foreground',
      bg: stats.pendingReviews > 0 ? 'bg-yellow-500/10' : 'bg-muted',
      href: '/admin/articles?status=PENDING_REVIEW',
    },
    {
      label: 'Total Comments',
      value: formatNumber(stats.totalComments),
      subLabel: 'across all articles',
      icon: MessageSquare,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      href: '/admin/comments',
    },
    {
      label: 'Newsletter Subscribers',
      value: formatNumber(stats.newsletterSubscribers),
      subLabel: 'confirmed subscribers',
      icon: Mail,
      color: 'text-primary',
      bg: 'bg-primary/10',
      href: '/admin/newsletter',
    },
    {
      label: 'Vulnerabilities',
      value: formatNumber(stats.totalVulnerabilities),
      subLabel: 'tracked CVEs',
      icon: Bug,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      href: '/admin/vulnerabilities',
    },
    {
      label: 'Security Tools',
      value: formatNumber(stats.totalTools),
      subLabel: 'in tools directory',
      icon: Shield,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      href: '/admin/tools',
    },
    {
      label: 'Total Views (Top)',
      value: '—',
      subLabel: 'analytics coming soon',
      icon: Eye,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      href: '/admin/analytics',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Link
            key={card.label}
            href={card.href}
            className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-black text-foreground">{card.value}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{card.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.subLabel}</p>
          </Link>
        )
      })}
    </div>
  )
}

async function RecentArticles() {
  const { articles } = await getAllArticles({ limit: 8 })

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="font-bold text-foreground">Recent Articles</h2>
        <Link
          href="/admin/articles"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          View all
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {articles.map((article) => (
          <div key={article.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors">
            <div className="flex-1 min-w-0">
              <Link
                href={`/admin/articles/${article.id}/edit`}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
              >
                {article.title}
              </Link>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                <span>{article.author.name}</span>
                <span>·</span>
                <span>{formatRelativeDate(article.updatedAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="w-3 h-3" />
                {formatNumber(article.viewCount)}
              </span>
              <ArticleStatusBadge status={article.status as ArticleStatus} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

async function PendingReviews() {
  const { articles } = await getAllArticles({
    status: ArticleStatus.PENDING_REVIEW,
    limit: 5,
  })

  if (!articles.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">All caught up!</p>
        <p className="text-xs text-muted-foreground mt-1">No articles pending review.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 overflow-hidden">
      <div className="p-5 border-b border-yellow-500/20 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-500" />
        <h2 className="font-bold text-foreground">Pending Review</h2>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 font-bold">
          {articles.length}
        </span>
      </div>
      <div className="divide-y divide-yellow-500/10">
        {articles.map((article) => (
          <div key={article.id} className="px-5 py-3 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground line-clamp-1">{article.title}</p>
              <p className="text-xs text-muted-foreground">by {article.author.name}</p>
            </div>
            <Link
              href={`/admin/articles/${article.id}/review`}
              className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              Review
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

async function RecentVulnerabilities() {
  const vulns = await db.vulnerability.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 5,
  })

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="font-bold text-foreground">Recent CVEs</h2>
        <Link href="/admin/vulnerabilities" className="text-xs text-primary hover:underline">
          Manage
        </Link>
      </div>
      <div className="divide-y divide-border">
        {vulns.map((vuln) => (
          <div key={vuln.id} className="px-5 py-3 flex items-center gap-3">
            <SeverityBadge severity={vuln.severity} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-primary">{vuln.cveId}</p>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{vuln.title}</p>
            </div>
            {vuln.cvssScore && (
              <span className="text-xs font-bold text-foreground">{vuln.cvssScore.toFixed(1)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ArticleStatusBadge({ status }: { status: ArticleStatus }) {
  const statusConfig = {
    PUBLISHED: { label: 'Published', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
    DRAFT: { label: 'Draft', className: 'bg-muted text-muted-foreground border-border' },
    PENDING_REVIEW: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    APPROVED: { label: 'Approved', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    ARCHIVED: { label: 'Archived', className: 'bg-muted text-muted-foreground border-border' },
    REJECTED: { label: 'Rejected', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
  }

  const config = statusConfig[status] ?? statusConfig.DRAFT

  return (
    <span className={`px-2 py-0.5 text-xs rounded-full border font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="skeleton h-8 w-8 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform overview and recent activity</p>
      </div>

      <Suspense fallback={<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>}>
        <StatsGrid />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<SkeletonCard />}>
            <RecentArticles />
          </Suspense>
        </div>

        <div className="space-y-6">
          <Suspense fallback={<SkeletonCard />}>
            <PendingReviews />
          </Suspense>
          <Suspense fallback={<SkeletonCard />}>
            <RecentVulnerabilities />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
