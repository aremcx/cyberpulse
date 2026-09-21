// src/app/(public)/research/page.tsx
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security Research | CyberPulse',
  description: 'Original cybersecurity research, vulnerability disclosures, and threat intelligence reports.',
}

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const resolved = await searchParams
  const params = new URLSearchParams()
  params.set('contentType', 'RESEARCH')
  if (resolved) {
    for (const [k, v] of Object.entries(resolved)) {
      if (v) params.set(k, v)
    }
  }
  redirect(`/articles?${params.toString()}`)
}
