// src/app/(public)/news/page.tsx
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cybersecurity News | CyberPulse',
  description: 'Latest cybersecurity news, breach alerts, and threat reports from across Africa and beyond.',
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const resolved = await searchParams
  const params = new URLSearchParams()
  params.set('contentType', 'NEWS')
  if (resolved) {
    for (const [k, v] of Object.entries(resolved)) {
      if (v) params.set(k, v)
    }
  }
  redirect(`/articles?${params.toString()}`)
}
