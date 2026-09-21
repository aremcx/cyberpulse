// src/app/(public)/articles/[slug]/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Eye, Heart, MessageSquare, BookmarkPlus, Share2, ArrowLeft, Tag } from 'lucide-react'
import { getArticleBySlug, getRelatedArticles, getArticlesByAuthor } from '@/lib/services/articles'
import { formatDate, formatNumber, getInitials } from '@/lib/utils'
import { ContentTypeBadge, DifficultyBadge } from '@/components/ui/Badge'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { ArticleActions } from '@/components/articles/ArticleActions'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug, false)
  if (!article) return { title: 'Article Not Found' }

  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt ?? undefined,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.author.name ?? 'CyberPulse'],
      images: article.coverImage ? [{ url: article.coverImage, alt: article.coverImageAlt ?? article.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) notFound()

  const [related, authorArticles] = await Promise.all([
    getRelatedArticles(article.id, article.categoryId ?? undefined, 3),
    getArticlesByAuthor(article.authorId, 4),
  ])

  const otherAuthorArticles = authorArticles.filter((a) => a.id !== article.id).slice(0, 3)

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CyberPulse',
      logo: { '@type': 'ImageObject', url: '/logo.png' },
    },
    keywords: article.keywords?.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen">
        {/* Cover Image */}
        {article.coverImage && (
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.coverImageAlt ?? article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        )}

        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto">
            {/* Back link */}
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Link>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <ContentTypeBadge type={article.contentType} />
              {article.category && (
                <Link
                  href={`/articles?category=${article.category.slug}`}
                  className="px-2 py-0.5 text-xs rounded-full border font-medium hover:opacity-80 transition-opacity"
                  style={{
                    color: article.category.color ?? undefined,
                    borderColor: article.category.color ? `${article.category.color}40` : undefined,
                    backgroundColor: article.category.color ? `${article.category.color}15` : undefined,
                  }}
                >
                  {article.category.name}
                </Link>
              )}
              {article.difficulty && <DifficultyBadge difficulty={article.difficulty} />}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-4">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {article.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                {article.author.image ? (
                  <img
                    src={article.author.image}
                    alt={article.author.name ?? 'Author'}
                    className="w-8 h-8 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {getInitials(article.author.name ?? 'A')}
                  </div>
                )}
                <div>
                  <Link
                    href={`/authors/${article.author.username ?? article.author.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {article.author.name}
                  </Link>
                  {article.editor && (
                    <span className="text-xs text-muted-foreground ml-2">
                      · Edited by {article.editor.name}
                    </span>
                  )}
                </div>
              </div>

              {article.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(article.publishedAt)}
                </span>
              )}

              {article.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readingTime} min read
                </span>
              )}

              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {formatNumber(article.viewCount)} views
              </span>

              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {formatNumber(article.commentCount)} comments
              </span>
            </div>

            {/* Article Actions */}
            <div className="mb-8">
              <ArticleActions
                articleId={article.id}
                likeCount={article.likeCount}
                bookmarkCount={article.bookmarkCount}
                title={article.title}
              />
            </div>

            {/* Content */}
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(article.content) }}
            />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {article.tags.map(({ tag }) => (
                    <Link
                      key={tag.id}
                      href={`/articles?tag=${tag.slug}`}
                      className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            <div className="mt-10 p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-start gap-4">
                {article.author.image ? (
                  <img
                    src={article.author.image}
                    alt={article.author.name ?? 'Author'}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary border-2 border-primary/30">
                    {getInitials(article.author.name ?? 'A')}
                  </div>
                )}
                <div className="flex-1">
                  <Link
                    href={`/authors/${article.author.username ?? article.author.id}`}
                    className="font-bold text-foreground hover:text-primary transition-colors text-lg"
                  >
                    {article.author.name}
                  </Link>
                  {article.author.bio && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {article.author.bio}
                    </p>
                  )}
                  {(article.author.certifications?.length > 0 || article.author.skills?.length > 0) && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {[...(article.author.certifications ?? []), ...(article.author.skills ?? [])].slice(0, 6).map((item) => (
                        <span key={item} className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {otherAuthorArticles.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    More by {article.author.name?.split(' ')[0]}
                  </p>
                  <div className="flex flex-col gap-2">
                    {otherAuthorArticles.map((a) => (
                      <ArticleCard key={a.id} article={a as never} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comments placeholder */}
            <div className="mt-10" id="comments">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Comments ({formatNumber(article.commentCount)})
              </h2>
              <div className="p-6 rounded-2xl border border-border bg-card text-center text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Comments are loading...</p>
                <p className="text-xs mt-1">Sign in to join the conversation.</p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mt-16 max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((a) => (
                  <ArticleCard key={a.id} article={a as never} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  )
}

// Minimal markdown to HTML converter (replace with marked/remark in production)
function markdownToHtml(markdown: string): string {
  return markdown
    // Code blocks
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered list items
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr />')
    // Paragraphs (2+ newlines = paragraph break)
    .replace(/\n\n+/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    // Fix pre/code that got wrapped in p
    .replace(/<p><pre>/g, '<pre>')
    .replace(/<\/pre><\/p>/g, '</pre>')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
    .replace(/<p><li>/g, '<ul><li>')
    .replace(/<\/li><\/p>/g, '</li></ul>')
    .replace(/<p><hr \/><\/p>/g, '<hr />')
    .replace(/<p><blockquote>/g, '<blockquote>')
    .replace(/<\/blockquote><\/p>/g, '</blockquote>')
}
