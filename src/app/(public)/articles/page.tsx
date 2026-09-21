// src/app/(public)/articles/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getPublishedArticles } from '@/lib/services/articles'
import { db } from '@/lib/db'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { ContentType, DifficultyLevel } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Cybersecurity Articles',
  description: 'Browse expert articles, tutorials, news, and research on cybersecurity, threat intelligence, and more.',
}

const contentTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'ARTICLE', label: 'Articles' },
  { value: 'TUTORIAL', label: 'Tutorials' },
  { value: 'NEWS', label: 'News' },
  { value: 'RESEARCH', label: 'Research' },
  { value: 'THREAT_REPORT', label: 'Threat Reports' },
  { value: 'CASE_STUDY', label: 'Case Studies' },
  { value: 'TOOL_REVIEW', label: 'Tool Reviews' },
  { value: 'CAREER', label: 'Career' },
  { value: 'SECURITY_AWARENESS', label: 'Security Awareness' },
]

const difficultyOptions = [
  { value: '', label: 'All Levels' },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
]

const sortOptions = [
  { value: 'publishedAt', label: 'Latest' },
  { value: 'viewCount', label: 'Most Read' },
  { value: 'likeCount', label: 'Most Liked' },
]

interface ArticlesPageProps {
  searchParams: Promise<{
    page?: string
    type?: string
    category?: string
    tag?: string
    difficulty?: string
    sort?: string
    q?: string
    featured?: string
  }>
}

async function ArticleGrid({ filters }: { filters: Awaited<ArticlesPageProps['searchParams']> }) {
  const page = Math.max(1, parseInt(filters.page ?? '1'))

  const result = await getPublishedArticles({
    page,
    limit: 12,
    contentType: filters.type as ContentType | undefined,
    category: filters.category,
    tag: filters.tag,
    difficulty: filters.difficulty,
    sortBy: (filters.sort as 'publishedAt' | 'viewCount' | 'likeCount') ?? 'publishedAt',
    search: filters.q,
    featured: filters.featured === 'true' ? true : undefined,
  })

  if (!result.articles.length) {
    return (
      <div className="col-span-full text-center py-20">
        <p className="text-4xl mb-4">🔍</p>
        <h3 className="text-lg font-semibold text-foreground mb-2">No articles found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.articles.map((article) => (
          <ArticleCard key={article.id} article={article as never} />
        ))}
      </div>

      {/* Pagination */}
      {result.pages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(result.pages, 10) }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?${new URLSearchParams({ ...filters, page: String(p) }).toString()}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground'
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

function ArticlesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-2xl border border-border p-5 space-y-3">
          <div className="skeleton h-44 w-full rounded-lg" />
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2 mt-4" />
        </div>
      ))}
    </div>
  )
}

async function CategoriesBar() {
  const categories = await db.category.findMany({
    orderBy: { order: 'asc' },
    take: 15,
  })

  return (
    <div className="flex gap-2 flex-wrap">
      <a
        href="/articles"
        className="px-3 py-1.5 text-sm rounded-full border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
      >
        All
      </a>
      {categories.map((cat) => (
        <a
          key={cat.id}
          href={`/articles?category=${cat.slug}`}
          className="px-3 py-1.5 text-sm rounded-full border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          style={{ borderColor: cat.color ? `${cat.color}40` : undefined }}
        >
          {cat.name}
        </a>
      ))}
    </div>
  )
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const filters = await searchParams

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground mb-2">
          {filters.q ? `Search: "${filters.q}"` : 'Cybersecurity Articles'}
        </h1>
        <p className="text-muted-foreground">
          Expert articles, tutorials, news, and research on cybersecurity
        </p>
      </div>

      {/* Categories */}
      <div className="mb-6 overflow-x-auto">
        <Suspense fallback={null}>
          <CategoriesBar />
        </Suspense>
      </div>

      {/* Filters */}
      <form method="get" className="mb-8 flex flex-wrap gap-3 items-center">
        {filters.q && <input type="hidden" name="q" value={filters.q} />}
        {filters.category && <input type="hidden" name="category" value={filters.category} />}

        <select
          name="type"
          defaultValue={filters.type ?? ''}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary"
          id="filter-type"
        >
          {contentTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          name="difficulty"
          defaultValue={filters.difficulty ?? ''}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary"
          id="filter-difficulty"
        >
          {difficultyOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          name="sort"
          defaultValue={filters.sort ?? 'publishedAt'}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary"
          id="filter-sort"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          id="filter-apply"
        >
          Apply
        </button>

        {(filters.type || filters.difficulty || filters.category || filters.tag) && (
          <a
            href="/articles"
            className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear filters
          </a>
        )}
      </form>

      {/* Articles Grid */}
      <Suspense fallback={<ArticlesSkeleton />}>
        <ArticleGrid filters={filters} />
      </Suspense>
    </div>
  )
}
