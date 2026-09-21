// src/app/api/articles/route.ts
import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getPublishedArticles } from '@/lib/services/articles'
import { createArticleSchema } from '@/lib/validations/article'
import { createAuditLog } from '@/lib/services/audit'
import { hasPermission } from '@/lib/rbac'
import { slugify, calculateReadingTime, generateExcerpt } from '@/lib/utils'
import { ArticleStatus, ContentType, Role } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '12'))
  const category = searchParams.get('category') ?? undefined
  const contentType = searchParams.get('type') as ContentType | undefined
  const tag = searchParams.get('tag') ?? undefined
  const difficulty = searchParams.get('difficulty') ?? undefined
  const search = searchParams.get('q') ?? undefined
  const sortBy = (searchParams.get('sort') as 'publishedAt' | 'viewCount' | 'likeCount') ?? 'publishedAt'
  const featured = searchParams.get('featured') === 'true' ? true : undefined

  const result = await getPublishedArticles({
    category,
    contentType,
    tag,
    difficulty,
    search,
    page,
    limit,
    sortBy,
    featured,
  })

  return Response.json(result)
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = session.user.role as Role
    if (!hasPermission(role, 'articles:create')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = createArticleSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Auto-generate slug if not unique
    let slug = data.slug ?? slugify(data.title)
    const slugExists = await db.article.findUnique({ where: { slug } })
    if (slugExists) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    // Auto-generate excerpt
    const excerpt = data.excerpt ?? generateExcerpt(data.content)

    // Auto-calculate reading time
    const readingTime = data.readingTime ?? calculateReadingTime(data.content)

    const { tagIds, ...articleData } = data

    const article = await db.article.create({
      data: {
        ...articleData,
        slug,
        excerpt,
        readingTime,
        authorId: session.user.id,
        status: ArticleStatus.DRAFT,
        tags: tagIds?.length
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
    })

    await createAuditLog({
      userId: session.user.id,
      action: 'ARTICLE_CREATED',
      resource: 'article',
      resourceId: article.id,
      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
    })

    return Response.json({ article }, { status: 201 })
  } catch (error) {
    console.error('[Articles POST]', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
