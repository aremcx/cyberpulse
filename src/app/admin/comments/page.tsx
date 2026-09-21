// src/app/admin/comments/page.tsx
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { MessageSquare, Trash2, ExternalLink } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export const metadata = {
  title: 'Comments Moderation | CyberPulse Admin',
}

export default async function AdminCommentsPage() {
  const comments = await db.comment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      author: true,
      article: { select: { id: true, title: true, slug: true } },
    },
  })

  async function deleteComment(formData: FormData) {
    'use server'
    const commentId = formData.get('commentId') as string
    if (!commentId) return

    await db.comment.delete({
      where: { id: commentId },
    })

    revalidatePath('/admin/comments')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Comments Moderation</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review user discussions, flag inappropriate content, and maintain community standards
          </p>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          Total Comments: <span className="font-bold text-foreground">{comments.length}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {comments.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground text-sm">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-bold text-foreground">No comments posted yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {comments.map((c) => (
              <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-muted/20 transition-colors">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{c.author.name ?? 'Anonymous'}</span>
                    <span className="text-xs text-muted-foreground">on</span>
                    <Link
                      href={`/articles/${c.article.slug}`}
                      className="text-xs font-semibold text-primary hover:underline truncate max-w-xs"
                    >
                      {c.article.title}
                    </Link>
                    <span className="text-xs text-muted-foreground ml-auto sm:ml-0" suppressHydrationWarning>
                      · {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {c.content}
                  </p>
                </div>

                <form action={deleteComment} className="shrink-0">
                  <input type="hidden" name="commentId" value={c.id} />
                  <button
                    type="submit"
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
