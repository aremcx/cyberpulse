// src/app/dashboard/bookmarks/page.tsx
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArticleCard } from '@/components/articles/ArticleCard'
import { BookmarkIcon, BookOpen, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Bookmarks | CyberPulse Dashboard',
}

export default async function BookmarksPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/dashboard/bookmarks')
  }

  const bookmarks = await db.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      article: {
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
      },
    },
  })

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-foreground">Bookmarks</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Articles and tutorials you saved for reading and future reference
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-border bg-card">
          <BookmarkIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <h3 className="font-bold text-foreground text-base mb-1">No bookmarked articles</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            When you find an article, research paper, or guide you want to read later, save it to your bookmarks.
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Explore Articles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bm) => (
            <ArticleCard key={bm.articleId} article={bm.article as never} />
          ))}
        </div>
      )}
    </div>
  )
}
