// src/app/dashboard/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { ArticleStatus } from '@prisma/client'
import { formatNumber, formatRelativeDate } from '@/lib/utils'
import {
  FileText, Eye, Heart, BookmarkIcon, PenSquare, Bell,
  TrendingUp, CheckCircle, Clock, XCircle, ArrowRight
} from 'lucide-react'
import { ArticleCard } from '@/components/articles/ArticleCard'

export const metadata = { title: 'Dashboard' }

async function DashboardStats({ userId }: { userId: string }) {
  const [published, drafts, pending, totalViews, totalLikes, bookmarks] = await Promise.all([
    db.article.count({ where: { authorId: userId, status: ArticleStatus.PUBLISHED } }),
    db.article.count({ where: { authorId: userId, status: ArticleStatus.DRAFT } }),
    db.article.count({ where: { authorId: userId, status: ArticleStatus.PENDING_REVIEW } }),
    db.article.aggregate({ where: { authorId: userId }, _sum: { viewCount: true } }),
    db.article.aggregate({ where: { authorId: userId }, _sum: { likeCount: true } }),
    db.bookmark.count({ where: { userId } }),
  ])

  const cards = [
    { label: 'Published', value: published, icon: CheckCircle, color: 'text-green-400', href: '/dashboard/articles?status=PUBLISHED' },
    { label: 'Drafts', value: drafts, icon: Clock, color: 'text-yellow-400', href: '/dashboard/articles?status=DRAFT' },
    { label: 'Pending Review', value: pending, icon: FileText, color: 'text-blue-400', href: '/dashboard/articles?status=PENDING_REVIEW' },
    { label: 'Total Views', value: formatNumber(totalViews._sum.viewCount ?? 0), icon: Eye, color: 'text-primary' },
    { label: 'Total Likes', value: formatNumber(totalLikes._sum.likeCount ?? 0), icon: Heart, color: 'text-red-400' },
    { label: 'Bookmarks', value: formatNumber(bookmarks), icon: BookmarkIcon, color: 'text-purple-400', href: '/dashboard/bookmarks' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        const Wrapper = card.href ? Link : 'div'
        return (
          <Wrapper
            key={card.label}
            href={card.href ?? '#'}
            className="p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all text-center"
          >
            <Icon className={`w-5 h-5 mx-auto mb-2 ${card.color}`} />
            <p className="text-xl font-black text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </Wrapper>
        )
      })}
    </div>
  )
}

async function MyArticles({ userId }: { userId: string }) {
  const articles = await db.article.findMany({
    where: { authorId: userId },
    include: {
      category: { select: { id: true, name: true, slug: true, color: true } },
      tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
      author: { select: { id: true, name: true, username: true, image: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 5,
  })

  if (!articles.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <PenSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
        <h3 className="font-semibold text-foreground mb-1">No articles yet</h3>
        <p className="text-sm text-muted-foreground mb-4">Share your cybersecurity knowledge with the community.</p>
        <Link href="/dashboard/articles/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all">
          <PenSquare className="w-4 h-4" />
          Write your first article
        </Link>
      </div>
    )
  }

  const statusStyles: Record<string, string> = {
    PUBLISHED: 'text-green-500 bg-green-500/10 border-green-500/20',
    DRAFT: 'text-muted-foreground bg-muted border-border',
    PENDING_REVIEW: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    APPROVED: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    REJECTED: 'text-red-500 bg-red-500/10 border-red-500/20',
    ARCHIVED: 'text-muted-foreground bg-muted border-border',
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="font-bold text-foreground">Recent Articles</h2>
        <Link href="/dashboard/articles" className="text-xs text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {articles.map((article) => (
          <div key={article.id} className="px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
            <div className="flex-1 min-w-0">
              <Link
                href={
                  article.status === ArticleStatus.PUBLISHED
                    ? `/articles/${article.slug}`
                    : `/dashboard/articles/${article.id}/edit`
                }
                className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
              >
                {article.title}
              </Link>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                <span>Updated {formatRelativeDate(article.updatedAt)}</span>
                {article.status === ArticleStatus.PUBLISHED && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(article.viewCount)}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(article.likeCount)}</span>
                  </>
                )}
              </div>
            </div>
            <span className={`shrink-0 px-2 py-0.5 text-xs rounded-full border font-medium ${statusStyles[article.status] ?? statusStyles.DRAFT}`}>
              {article.status === 'PENDING_REVIEW' ? 'In Review' : article.status.toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

async function RecentNotifications({ userId }: { userId: string }) {
  const notifications = await db.notification.findMany({
    where: { recipientId: userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="font-bold text-foreground">Notifications</h2>
        <Link href="/dashboard/notifications" className="text-xs text-primary hover:underline">View all</Link>
      </div>
      {notifications.length ? (
        <div className="divide-y divide-border">
          {notifications.map((n) => (
            <div key={n.id} className={`px-5 py-3.5 flex items-start gap-3 ${!n.isRead ? 'bg-primary/5' : ''}`}>
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-primary' : 'bg-transparent'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                {n.message && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.message}</p>}
                <p className="text-xs text-muted-foreground mt-1">{formatRelativeDate(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          <Bell className="w-6 h-6 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No notifications yet</p>
        </div>
      )}
    </div>
  )
}

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user.id

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">
            Welcome back, {session!.user.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here&apos;s what&apos;s happening with your account.</p>
        </div>
        <Link
          href="/dashboard/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all cyber-glow"
        >
          <PenSquare className="w-4 h-4" />
          Write Article
        </Link>
      </div>

      <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">{[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>}>
        <DashboardStats userId={userId} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="skeleton h-64 rounded-2xl" />}>
            <MyArticles userId={userId} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<div className="skeleton h-64 rounded-2xl" />}>
            <RecentNotifications userId={userId} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
