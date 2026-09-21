// src/app/admin/articles/[id]/review/page.tsx
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ArticleStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, XCircle, Clock, User, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface AdminArticleReviewProps {
  params: Promise<{ id: string }>
}

export default async function AdminArticleReviewPage({ params }: AdminArticleReviewProps) {
  const { id } = await params

  const article = await db.article.findUnique({
    where: { id },
    include: { category: true, author: true, tags: { include: { tag: true } } },
  })

  if (!article) {
    notFound()
  }

  async function approveArticle() {
    'use server'
    await db.article.update({
      where: { id },
      data: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    })

    revalidatePath('/admin/articles')
    revalidatePath('/admin')
    revalidatePath('/articles')
    redirect('/admin/articles')
  }

  async function rejectArticle() {
    'use server'
    await db.article.update({
      where: { id },
      data: {
        status: ArticleStatus.REJECTED,
      },
    })

    revalidatePath('/admin/articles')
    revalidatePath('/admin')
    redirect('/admin/articles')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Admin Overview
        </Link>
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Pending Review
        </span>
      </div>

      {/* Review Actions Card */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-foreground text-base">Editorial Decision</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Approve this submission to publish it immediately, or reject it back to the author.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <form action={rejectArticle}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 text-sm font-semibold transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </form>

          <form action={approveArticle}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-sm font-semibold transition-colors shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve & Publish
            </button>
          </form>
        </div>
      </div>

      {/* Submission Content */}
      <article className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {article.category && (
              <span className="px-2.5 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
                {article.category.name}
              </span>
            )}
            <span className="text-xs text-muted-foreground" suppressHydrationWarning>
              Submitted {formatDate(article.createdAt)}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 pt-4 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>By {article.author.name ?? article.author.email}</span>
            </div>
            {article.readingTime && (
              <span>· {article.readingTime} min read</span>
            )}
          </div>
        </div>

        {article.excerpt && (
          <div className="p-4 rounded-xl bg-muted/40 border-l-4 border-primary text-sm text-foreground italic">
            {article.excerpt}
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-line text-sm md:text-base border-t border-border pt-6">
          {article.content}
        </div>
      </article>
    </div>
  )
}
