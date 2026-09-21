// src/app/admin/articles/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/lib/services/articles'
import { formatRelativeDate, formatNumber } from '@/lib/utils'
import { FileText, Plus, Eye, Heart, Search } from 'lucide-react'
import { ArticleStatus } from '@prisma/client'

export const metadata: Metadata = { title: 'Articles — Admin' }

interface AdminArticlesPageProps {
  searchParams: Promise<{ status?: string; page?: string; q?: string }>
}

const statusTabs = [
  { value: '', label: 'All' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'PENDING_REVIEW', label: 'Pending Review' },
  { value: 'DRAFT', label: 'Drafts' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
]

const statusStyles: Record<string, string> = {
  PUBLISHED: 'bg-green-500/10 text-green-500 border-green-500/20',
  DRAFT: 'bg-muted text-muted-foreground border-border',
  PENDING_REVIEW: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  APPROVED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
  ARCHIVED: 'bg-muted text-muted-foreground border-border',
}

async function ArticlesTable({ filters }: { filters: Awaited<AdminArticlesPageProps['searchParams']> }) {
  const page = Math.max(1, parseInt(filters.page ?? '1'))
  const result = await getAllArticles({
    status: filters.status as ArticleStatus | undefined,
    search: filters.q,
    page,
    limit: 20,
  })

  if (!result.articles.length) {
    return (
      <div className="text-center py-16 rounded-2xl border border-border">
        <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium text-foreground">No articles found</p>
      </div>
    )
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-3">{result.total} articles</p>
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Article</span>
          <span className="w-32">Status</span>
          <span className="w-20 text-center">Views</span>
          <span className="w-20 text-center">Likes</span>
          <span className="w-24 text-right">Updated</span>
        </div>
        {result.articles.map((article) => (
          <div key={article.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 border-t border-border hover:bg-muted/30 transition-colors items-center">
            <div className="min-w-0">
              <Link
                href={`/admin/articles/${article.id}/edit`}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
              >
                {article.title}
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">
                by {article.author.name}
                {article.category && ` · ${article.category.name}`}
              </p>
            </div>
            <div className="w-32">
              <span className={`px-2 py-0.5 text-xs rounded-full border font-medium ${statusStyles[article.status] ?? statusStyles.DRAFT}`}>
                {article.status === 'PENDING_REVIEW' ? 'In Review' : article.status.charAt(0) + article.status.slice(1).toLowerCase()}
              </span>
            </div>
            <span className="w-20 text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(article.viewCount)}
            </span>
            <span className="w-20 text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {formatNumber(article.likeCount)}
            </span>
            <span className="w-24 text-right text-xs text-muted-foreground">
              {formatRelativeDate(article.updatedAt)}
            </span>
          </div>
        ))}
      </div>

      {result.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(result.pages, 10) }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?${new URLSearchParams({ ...filters, page: String(p) }).toString()}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-muted/60'
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

export default async function AdminArticlesPage({ searchParams }: AdminArticlesPageProps) {
  const filters = await searchParams

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">Articles</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage all platform content</p>
        </div>
        <Link
          href="/dashboard/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-border">
        {statusTabs.map((tab) => (
          <a
            key={tab.value}
            href={`/admin/articles?status=${tab.value}`}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              (filters.status ?? '') === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Search */}
      <form method="get">
        {filters.status && <input type="hidden" name="status" value={filters.status} />}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={filters.q ?? ''}
            placeholder="Search articles..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            id="admin-article-search"
          />
        </div>
      </form>

      <Suspense fallback={<div className="skeleton h-64 rounded-2xl" />}>
        <ArticlesTable filters={filters} />
      </Suspense>
    </div>
  )
}
