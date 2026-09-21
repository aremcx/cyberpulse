// src/app/dashboard/articles/page.tsx
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArticleStatus } from '@prisma/client'
import { formatNumber, formatDate } from '@/lib/utils'
import {
  FileText, PenSquare, Eye, Heart, Plus,
  CheckCircle, Clock, AlertCircle, ArrowRight
} from 'lucide-react'

interface DashboardArticlesProps {
  searchParams: Promise<{ status?: string; page?: string }>
}

const statusTabs = [
  { label: 'All Articles', value: '' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Drafts', value: 'DRAFT' },
  { label: 'Pending Review', value: 'PENDING_REVIEW' },
]

export const metadata = {
  title: 'My Articles | CyberPulse Dashboard',
}

export default async function DashboardArticlesPage({ searchParams }: DashboardArticlesProps) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/dashboard/articles')
  }

  const { status } = await searchParams

  const where: { authorId: string; status?: ArticleStatus } = {
    authorId: session.user.id,
  }

  if (status && Object.values(ArticleStatus).includes(status as ArticleStatus)) {
    where.status = status as ArticleStatus
  }

  const articles = await db.article.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: {
      category: true,
    },
  })

  const statusStyles: Record<string, string> = {
    PUBLISHED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    DRAFT: 'bg-muted text-muted-foreground border-border',
    PENDING_REVIEW: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    APPROVED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
    ARCHIVED: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">My Articles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your submissions, drafts, and published cybersecurity content
          </p>
        </div>
        <Link
          href="/dashboard/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-md cyber-glow shrink-0"
        >
          <Plus className="w-4 h-4" />
          Write Article
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto">
        {statusTabs.map((tab) => {
          const isActive = (status ?? '') === tab.value
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/dashboard/articles?status=${tab.value}` : '/dashboard/articles'}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Articles List */}
      {articles.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-border bg-card">
          <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <h3 className="font-bold text-foreground text-base mb-1">No articles found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            {status
              ? `You don't have any articles with status "${status.toLowerCase()}".`
              : 'You haven\'t created any articles yet. Start sharing your cybersecurity expertise.'}
          </p>
          <Link
            href="/dashboard/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Your First Article
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {articles.map((article) => (
            <div key={article.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${statusStyles[article.status] ?? statusStyles.DRAFT}`}>
                    {article.status.replace('_', ' ')}
                  </span>
                  {article.category && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {article.category.name}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                    Updated {formatDate(article.updatedAt)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground line-clamp-1">
                  {article.title}
                </h3>

                {article.excerpt && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {article.excerpt}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/50">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {formatNumber(article.viewCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    {formatNumber(article.likeCount)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {article.status === ArticleStatus.PUBLISHED && (
                    <Link
                      href={`/articles/${article.slug}`}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      View Live
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/articles/new?edit=${article.id}`}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
