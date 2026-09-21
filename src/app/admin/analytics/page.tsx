// src/app/admin/analytics/page.tsx
import { db } from '@/lib/db'
import { formatNumber } from '@/lib/utils'
import { BarChart2, Eye, Heart, FileText, TrendingUp, Users } from 'lucide-react'

export const metadata = {
  title: 'Analytics & Metrics | CyberPulse Admin',
}

export default async function AdminAnalyticsPage() {
  const [totalViews, totalLikes, topArticles, categories] = await Promise.all([
    db.article.aggregate({ _sum: { viewCount: true } }),
    db.article.aggregate({ _sum: { likeCount: true } }),
    db.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { viewCount: 'desc' },
      take: 8,
      include: { author: true, category: true },
    }),
    db.category.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { articles: { _count: 'desc' } },
    }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-foreground">Content Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Platform readership, engagement trends, and top cybersecurity articles
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{formatNumber(totalViews._sum.viewCount ?? 0)}</p>
              <p className="text-xs text-muted-foreground">Total Article Reads</p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{formatNumber(totalLikes._sum.likeCount ?? 0)}</p>
              <p className="text-xs text-muted-foreground">Total Reader Likes</p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">
                {totalViews._sum.viewCount && totalLikes._sum.likeCount
                  ? `${((totalLikes._sum.likeCount / totalViews._sum.viewCount) * 100).toFixed(1)}%`
                  : '—'}
              </p>
              <p className="text-xs text-muted-foreground">Engagement Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Most Read Articles */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Top Performing Content</h2>
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {topArticles.map((article, i) => (
            <div key={article.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-sm font-black text-muted-foreground w-6 text-center">
                  #{i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{article.title}</p>
                  <p className="text-xs text-muted-foreground">
                    by {article.author.name} {article.category && `· ${article.category.name}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-muted-foreground shrink-0">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  {formatNumber(article.viewCount)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-red-400" />
                  {formatNumber(article.likeCount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Distribution */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Content by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((c) => (
            <div key={c.id} className="p-4 rounded-xl border border-border bg-card">
              <p className="font-bold text-foreground text-sm truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c._count.articles} articles</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
