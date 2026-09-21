'use client'
// src/components/articles/ArticleActions.tsx
import { useState } from 'react'
import { Heart, BookmarkPlus, BookmarkCheck, Share2, Check } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface ArticleActionsProps {
  articleId: string
  likeCount: number
  bookmarkCount: number
  title?: string
}

export function ArticleActions({
  articleId,
  likeCount: initialLikeCount,
  bookmarkCount: initialBookmarkCount,
  title,
}: ArticleActionsProps) {
  const [likes, setLikes] = useState(initialLikeCount)
  const [hasLiked, setHasLiked] = useState(false)
  const [bookmarks, setBookmarks] = useState(initialBookmarkCount)
  const [hasBookmarked, setHasBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => Math.max(0, prev - 1))
      setHasLiked(false)
    } else {
      setLikes((prev) => prev + 1)
      setHasLiked(true)
    }
  }

  const handleBookmark = () => {
    if (hasBookmarked) {
      setBookmarks((prev) => Math.max(0, prev - 1))
      setHasBookmarked(false)
    } else {
      setBookmarks((prev) => prev + 1)
      setHasBookmarked(true)
    }
  }

  const handleShare = async () => {
    if (typeof window === 'undefined') return

    if (navigator.share) {
      try {
        await navigator.share({
          title: title ?? document.title,
          url: window.location.href,
        })
        return
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignored
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium ${
          hasLiked
            ? 'border-red-500/50 bg-red-500/10 text-red-500'
            : 'border-border text-muted-foreground hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-500'
        }`}
        id={`like-${articleId}`}
        aria-label="Like article"
      >
        <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500' : ''}`} />
        <span>{formatNumber(likes)}</span>
      </button>

      <button
        onClick={handleBookmark}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium ${
          hasBookmarked
            ? 'border-primary/50 bg-primary/10 text-primary'
            : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary'
        }`}
        id={`bookmark-${articleId}`}
        aria-label="Bookmark article"
      >
        {hasBookmarked ? (
          <BookmarkCheck className="w-4 h-4 text-primary" />
        ) : (
          <BookmarkPlus className="w-4 h-4" />
        )}
        <span>{formatNumber(bookmarks)}</span>
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted/60 transition-all text-sm text-muted-foreground hover:text-foreground font-medium"
        id={`share-${articleId}`}
        aria-label="Share article"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Link Copied</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </>
        )}
      </button>
    </div>
  )
}
