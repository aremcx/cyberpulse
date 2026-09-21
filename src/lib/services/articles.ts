// src/lib/services/articles.ts
import 'server-only'
import { db } from '@/lib/db'
import { ArticleStatus, ContentType, DifficultyLevel, Prisma, Role } from '@prisma/client'
import { calculateReadingTime } from '@/lib/utils'

export interface ArticleFilters {
  category?: string
  contentType?: ContentType
  tag?: string
  difficulty?: string
  authorId?: string
  status?: ArticleStatus
  featured?: boolean
  search?: string
  page?: number
  limit?: number
  sortBy?: 'publishedAt' | 'viewCount' | 'likeCount' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

const publicArticleSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  coverImageAlt: true,
  contentType: true,
  difficulty: true,
  readingTime: true,
  featured: true,
  trending: true,
  publishedAt: true,
  viewCount: true,
  likeCount: true,
  commentCount: true,
  bookmarkCount: true,
  author: {
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
  },
  category: {
    select: { id: true, name: true, slug: true, color: true },
  },
  tags: {
    include: { tag: { select: { id: true, name: true, slug: true } } },
  },
} as const

export async function getPublishedArticles(filters: ArticleFilters = {}) {
  const {
    category,
    contentType,
    tag,
    difficulty,
    authorId,
    search,
    page = 1,
    limit = 12,
    sortBy = 'publishedAt',
    sortOrder = 'desc',
  } = filters

  const skip = (page - 1) * limit

  const where = {
    status: ArticleStatus.PUBLISHED,
    ...(category ? { category: { slug: category } } : {}),
    ...(contentType ? { contentType } : {}),
    ...(difficulty ? { difficulty: difficulty as never } : {}),
    ...(authorId ? { authorId } : {}),
    ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { excerpt: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [articles, total] = await Promise.all([
    db.article.findMany({
      where,
      select: publicArticleSelect,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    db.article.count({ where }),
  ])

  return {
    articles,
    total,
    pages: Math.ceil(total / limit),
    page,
    limit,
  }
}

export async function getArticleBySlug(slug: string, incrementView = true) {
  const article = await db.article.findUnique({
    where: { slug, status: ArticleStatus.PUBLISHED },
    include: {
      author: {
        select: {
          id: true, name: true, username: true, image: true, bio: true,
          certifications: true, skills: true,
        },
      },
      editor: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true, color: true } },
      tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
      _count: { select: { comments: true } },
    },
  })

  if (!article) return null

  if (incrementView) {
    await db.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {})
  }

  return article
}

export async function getFeaturedArticles(limit = 5) {
  return db.article.findMany({
    where: { status: ArticleStatus.PUBLISHED, featured: true },
    select: publicArticleSelect,
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })
}

export async function getTrendingArticles(limit = 8) {
  return db.article.findMany({
    where: { status: ArticleStatus.PUBLISHED },
    select: publicArticleSelect,
    orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }],
    take: limit,
  })
}

export async function getLatestArticles(
  contentType?: ContentType,
  limit = 10
) {
  return db.article.findMany({
    where: {
      status: ArticleStatus.PUBLISHED,
      ...(contentType ? { contentType } : {}),
    },
    select: publicArticleSelect,
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })
}

export async function getRelatedArticles(articleId: string, categoryId?: string, limit = 4) {
  return db.article.findMany({
    where: {
      id: { not: articleId },
      status: ArticleStatus.PUBLISHED,
      ...(categoryId ? { categoryId } : {}),
    },
    select: publicArticleSelect,
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })
}

export async function getArticlesByAuthor(authorId: string, limit = 10) {
  return db.article.findMany({
    where: { authorId, status: ArticleStatus.PUBLISHED },
    select: publicArticleSelect,
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })
}

// Admin / dashboard functions
export async function getAllArticles(filters: ArticleFilters = {}) {
  const { status, page = 1, limit = 20, search } = filters
  const skip = (page - 1) * limit

  const where = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { author: { name: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {}),
  }

  const [articles, total] = await Promise.all([
    db.article.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
    db.article.count({ where }),
  ])

  return { articles, total, pages: Math.ceil(total / limit), page }
}

export async function createArticle(data: {
  title: string
  slug: string
  excerpt?: string
  content: string
  contentJson?: Prisma.InputJsonValue
  coverImage?: string
  categoryId?: string
  tagIds?: string[]
  contentType: ContentType
  difficulty?: DifficultyLevel
  authorId: string
  seoTitle?: string
  seoDescription?: string
  keywords?: string[]
  references?: Array<{ title: string; url: string }>
}) {
  const readingTime = calculateReadingTime(data.content)
  const { tagIds, difficulty, contentJson, references, ...rest } = data

  return db.article.create({
    data: {
      ...rest,
      difficulty: difficulty ?? null,
      contentJson: contentJson as Prisma.InputJsonValue | undefined,
      references: references as Prisma.InputJsonValue | undefined,
      readingTime,
      tags: tagIds
        ? {
            create: tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          }
        : undefined,
    },
  })
}

export async function updateArticleStatus(
  articleId: string,
  status: ArticleStatus,
  editorId?: string,
  revisionNote?: string
) {
  const data: Record<string, unknown> = {
    status,
    ...(editorId ? { editorId } : {}),
    ...(revisionNote ? { revisionNote } : {}),
  }

  if (status === ArticleStatus.PUBLISHED) {
    data.publishedAt = new Date()
  }

  return db.article.update({
    where: { id: articleId },
    data,
  })
}

export async function getDashboardStats() {
  const [
    totalUsers,
    activeUsers,
    publishedArticles,
    draftArticles,
    pendingReviews,
    totalComments,
    newsletterSubscribers,
    totalVulnerabilities,
    totalTools,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { isSuspended: false } }),
    db.article.count({ where: { status: ArticleStatus.PUBLISHED } }),
    db.article.count({ where: { status: ArticleStatus.DRAFT } }),
    db.article.count({ where: { status: ArticleStatus.PENDING_REVIEW } }),
    db.comment.count({ where: { isDeleted: false } }),
    db.newsletterSubscriber.count({ where: { confirmedAt: { not: null }, unsubscribedAt: null } }),
    db.vulnerability.count(),
    db.tool.count(),
  ])

  return {
    totalUsers,
    activeUsers,
    publishedArticles,
    draftArticles,
    pendingReviews,
    totalComments,
    newsletterSubscribers,
    totalVulnerabilities,
    totalTools,
  }
}
