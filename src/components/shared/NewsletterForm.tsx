'use client'
// src/components/shared/NewsletterForm.tsx
import { useState } from 'react'
import { Mail, Loader2, CheckCircle } from 'lucide-react'

export function NewsletterForm({ id = 'newsletter-form' }: { id?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Subscription failed')
      }

      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center gap-3 p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400">
        <CheckCircle className="w-5 h-5" />
        <p className="font-medium">You&apos;re subscribed! Check your inbox to confirm.</p>
      </div>
    )
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          id={`${id}-email`}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all cyber-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
        id={`${id}-submit`}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Subscribing...
          </>
        ) : (
          'Subscribe Free'
        )}
      </button>
      {error && (
        <p className="text-sm text-destructive mt-1 absolute">{error}</p>
      )}
    </form>
  )
}
