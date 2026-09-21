// src/components/articles/ArticleCard.tsx
import Link from 'next/link'
import { Clock, Eye, Heart, MessageSquare, BookmarkPlus } from 'lucide-react'
import { formatRelativeDate, formatNumber, cn } from '@/lib/utils'
import { ContentTypeBadge, DifficultyBadge } from '@/components/ui/Badge'
import type { ContentType, DifficultyLevel } from '@prisma/client'

interface ArticleCardProps {
  article: {
    id: string
    title: string
    slug: string
    excerpt?: string | null
    coverImage?: string | null
    coverImageAlt?: string | null
    contentType: ContentType
    difficulty?: DifficultyLevel | null
    readingTime?: number | null
    featured?: boolean
    publishedAt?: Date | null
    viewCount: number
    likeCount: number
    commentCount: number
    bookmarkCount: number
    author: {
      id: string
      name?: string | null
      username?: string | null
      image?: string | null
    }
    category?: {
      id: string
      name: string
      slug: string
      color?: string | null
    } | null
    tags: Array<{ tag: { id: string; name: string; slug: string } }>
  }
  variant?: 'default' | 'featured' | 'compact' | 'horizontal'
  className?: string
  showExcerpt?: boolean
}

export function ArticleCard({
  article,
  variant = 'default',
  className,
  showExcerpt = true,
}: ArticleCardProps) {
  if (variant === 'featured') {
    return (
      <article
        className={cn(
          'group relative overflow-hidden rounded-2xl border border-border bg-card flex flex-col',
          'hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10',
          'transition-all duration-300',
          className
        )}
      >
        {/* Cover Image */}
        <Link href={`/articles/${article.slug}`} className="block relative h-56 overflow-hidden">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.coverImageAlt ?? article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full cyber-grid bg-muted flex items-center justify-center">
              <div className="text-4xl opacity-20">🔒</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

          {/* Featured badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-bold rounded-full bg-primary text-primary-foreground">
              Featured
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <ContentTypeBadge type={article.contentType} />
            {article.category && (
              <span
                className="px-2 py-0.5 text-xs rounded-full font-medium"
                style={{
                  backgroundColor: article.category.color
                    ? `${article.category.color}20`
                    : undefined,
                  color: article.category.color ?? undefined,
                }}
              >
                {article.category.name}
              </span>
            )}
            {article.difficulty && (
              <DifficultyBadge difficulty={article.difficulty} />
            )}
          </div>

          <Link href={`/articles/${article.slug}`}>
            <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
              {article.title}
            </h2>
          </Link>

          {showExcerpt && article.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {article.excerpt}
            </p>
          )}

          <div className="mt-auto pt-2">
            <ArticleMeta article={article} />
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'horizontal') {
    return (
      <article
        className={cn(
          'group flex gap-4 p-4 rounded-xl border border-border bg-card',
          'hover:border-primary/40 hover:bg-primary/5 transition-all duration-200',
          className
        )}
      >
        {/* Thumbnail */}
        <Link href={`/articles/${article.slug}`} className="shrink-0">
          <div className="w-24 h-20 rounded-lg overflow-hidden bg-muted">
            {article.coverImage ? (
              <img
                src={article.coverImage}
                alt={article.coverImageAlt ?? article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full cyber-grid flex items-center justify-center text-2xl opacity-20">🔒</div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <ContentTypeBadge type={article.contentType} />
            {article.category && (
              <span className="text-xs text-muted-foreground">{article.category.name}</span>
            )}
          </div>
          <Link href={`/articles/${article.slug}`}>
            <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h3>
          </Link>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span suppressHydrationWarning>{article.publishedAt ? formatRelativeDate(article.publishedAt) : 'Draft'}</span>
            {article.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readingTime}m
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(article.viewCount)}
            </span>
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className={cn('group', className)}>
        <Link href={`/articles/${article.slug}`}>
          <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
            {article.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ContentTypeBadge type={article.contentType} />
          <span suppressHydrationWarning>{article.publishedAt ? formatRelativeDate(article.publishedAt) : ''}</span>
        </div>
      </article>
    )
  }

  // Default card
  return (
    <article
      className={cn(
        'group flex flex-col rounded-2xl border border-border bg-card overflow-hidden',
        'hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300',
        className
      )}
    >
      {/* Cover Image */}
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="relative h-44 overflow-hidden">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.coverImageAlt ?? article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full cyber-grid bg-muted flex items-center justify-center">
              <div className="text-4xl opacity-20">🔒</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card/70 to-transparent" />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <ContentTypeBadge type={article.contentType} />
          {article.category && (
            <span
              className="px-2 py-0.5 text-xs rounded-full font-medium border"
              style={{
                backgroundColor: article.category.color ? `${article.category.color}15` : undefined,
                color: article.category.color ?? undefined,
                borderColor: article.category.color ? `${article.category.color}40` : undefined,
              }}
            >
              {article.category.name}
            </span>
          )}
          {article.difficulty && (
            <DifficultyBadge difficulty={article.difficulty} />
          )}
        </div>

        {/* Title */}
        <Link href={`/articles/${article.slug}`} className="flex-1">
          <h2 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2">
            {article.title}
          </h2>
          {showExcerpt && article.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {article.excerpt}
            </p>
          )}
        </Link>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {article.tags.slice(0, 3).map(({ tag }) => (
              <Link
                key={tag.id}
                href={`/articles?tag=${tag.slug}`}
                className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-border">
          <ArticleMeta article={article} />
        </div>
      </div>
    </article>
  )
}

function ArticleMeta({ article }: Pick<ArticleCardProps, 'article'>) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {/* Author */}
        {article.author.image ? (
          <img
            src={article.author.image}
            alt={article.author.name ?? 'Author'}
            className="w-6 h-6 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/30">
            {(article.author.name ?? 'A')[0].toUpperCase()}
          </div>
        )}
        <div>
          <Link
            href={`/authors/${article.author.username ?? article.author.id}`}
            className="text-xs font-medium text-foreground hover:text-primary transition-colors"
          >
            {article.author.name}
          </Link>
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            {article.publishedAt ? formatRelativeDate(article.publishedAt) : 'Draft'}
            {article.readingTime && ` · ${article.readingTime}m read`}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {formatNumber(article.viewCount)}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          {formatNumber(article.likeCount)}
        </span>
      </div>
    </div>
  )
}
