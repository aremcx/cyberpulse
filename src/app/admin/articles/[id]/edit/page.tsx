// src/app/admin/articles/[id]/edit/page.tsx
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ArticleStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, CheckCircle } from 'lucide-react'

interface AdminArticleEditProps {
  params: Promise<{ id: string }>
}

export default async function AdminArticleEditPage({ params }: AdminArticleEditProps) {
  const { id } = await params

  const article = await db.article.findUnique({
    where: { id },
    include: { category: true, author: true },
  })

  if (!article) {
    notFound()
  }

  const categories = await db.category.findMany({
    orderBy: { name: 'asc' },
  })

  async function updateArticle(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const categoryId = formData.get('categoryId') as string
    const status = formData.get('status') as ArticleStatus
    const featured = formData.get('featured') === 'on'

    await db.article.update({
      where: { id },
      data: {
        title,
        excerpt: excerpt || null,
        content,
        categoryId: categoryId || null,
        status,
        featured,
        ...(status === ArticleStatus.PUBLISHED && !article?.publishedAt ? { publishedAt: new Date() } : {}),
      },
    })

    revalidatePath('/admin/articles')
    if (article?.slug) {
      revalidatePath(`/articles/${article.slug}`)
    }
    redirect('/admin/articles')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Articles
        </Link>
        {article.status === ArticleStatus.PUBLISHED && (
          <Link
            href={`/articles/${article.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <Eye className="w-3.5 h-3.5" />
            View Live
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h1 className="text-xl font-black text-foreground mb-6">Edit Article: {article.title}</h1>

        <form action={updateArticle} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Article Title</label>
            <input
              name="title"
              defaultValue={article.title}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
              <select
                name="categoryId"
                defaultValue={article.categoryId ?? ''}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Publication Status</label>
              <select
                name="status"
                defaultValue={article.status}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary font-medium"
              >
                {Object.values(ArticleStatus).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Excerpt</label>
            <textarea
              name="excerpt"
              rows={2}
              defaultValue={article.excerpt ?? ''}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Content (Markdown)</label>
            <textarea
              name="content"
              rows={12}
              defaultValue={article.content}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={article.featured}
              className="w-4 h-4 accent-primary rounded cursor-pointer"
            />
            <label htmlFor="featured" className="text-sm font-medium text-foreground cursor-pointer">
              Feature this article on homepage and featured lists
            </label>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <Link
              href="/admin/articles"
              className="px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all cyber-glow"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
