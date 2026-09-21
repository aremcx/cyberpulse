// src/app/(public)/authors/[username]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import { ArticleStatus } from '@prisma/client'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { formatNumber, formatDate } from '@/lib/utils'
import {
  User as UserIcon, Globe, GitBranch, Share2,
  Calendar, Eye, Heart, BookOpen, Award, ArrowLeft
} from 'lucide-react'

interface AuthorPageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { username } = await params
  const user = await db.user.findFirst({
    where: {
      OR: [{ username }, { id: username }],
    },
  })

  if (!user) {
    return { title: 'Author Not Found | CyberPulse' }
  }

  return {
    title: `${user.name ?? user.username} — Author Profile | CyberPulse`,
    description: user.bio ?? `Articles, research and contributions by ${user.name ?? user.username} on CyberPulse.`,
  }
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const { username } = await params

  const author = await db.user.findFirst({
    where: {
      OR: [{ username }, { id: username }],
    },
    include: {
      articles: {
        where: { status: ArticleStatus.PUBLISHED },
        orderBy: { publishedAt: 'desc' },
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
      },
    },
  })

  if (!author) {
    notFound()
  }

  const totalViews = author.articles.reduce((acc, a) => acc + a.viewCount, 0)
  const totalLikes = author.articles.reduce((acc, a) => acc + a.likeCount, 0)

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>
      </div>

      {/* Profile Header */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-3xl font-black text-primary overflow-hidden shrink-0">
            {author.image ? (
              <img src={author.image} alt={author.name ?? ''} className="w-full h-full object-cover" />
            ) : (
              (author.name ?? author.username ?? 'A')[0].toUpperCase()
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-foreground">
                {author.name ?? author.username}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
                {author.role.toLowerCase().replace('_', ' ')}
              </span>
            </div>

            {author.username && (
              <p className="text-sm font-mono text-muted-foreground mb-3">
                @{author.username}
              </p>
            )}

            {author.bio && (
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 max-w-2xl">
                {author.bio}
              </p>
            )}

            {/* Meta tags & social */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5" suppressHydrationWarning>
                <Calendar className="w-3.5 h-3.5" />
                Joined {formatDate(author.createdAt, 'MMMM yyyy')}
              </span>
              {author.location && (
                <span>📍 {author.location}</span>
              )}
              {author.website && (
                <a
                  href={author.website.startsWith('http') ? author.website : `https://${author.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Website
                </a>
              )}
              {author.twitter && (
                <a
                  href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  X / Twitter
                </a>
              )}
              {author.github && (
                <a
                  href={`https://github.com/${author.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
              {author.linkedin && (
                <a
                  href={author.linkedin.startsWith('http') ? author.linkedin : `https://linkedin.com/in/${author.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{author.articles.length}</p>
              <p className="text-xs text-muted-foreground">Articles Published</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{formatNumber(totalViews)}</p>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{formatNumber(totalLikes)}</p>
              <p className="text-xs text-muted-foreground">Total Likes</p>
            </div>
          </div>
        </div>

        {/* Skills & Certs */}
        {(author.skills.length > 0 || author.certifications.length > 0) && (
          <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-6">
            {author.skills.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Skills & Expertise
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {author.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-0.5 text-xs rounded-full bg-muted text-foreground border border-border">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {author.certifications.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Certifications
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {author.certifications.map((cert) => (
                    <span key={cert} className="px-2.5 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Author Articles */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6">
          Articles by {author.name ?? author.username} ({author.articles.length})
        </h2>

        {author.articles.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-border bg-card">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-foreground">No published articles yet</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later for contributions from this author.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {author.articles.map((article) => (
              <ArticleCard key={article.id} article={article as never} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
