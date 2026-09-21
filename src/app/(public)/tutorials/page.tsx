// src/app/(public)/tutorials/page.tsx
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cybersecurity Tutorials | CyberPulse',
  description: 'Hands-on cybersecurity tutorials for all skill levels — from fundamentals to advanced red team and blue team techniques.',
}

export default async function TutorialsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const resolved = await searchParams
  const params = new URLSearchParams()
  params.set('contentType', 'TUTORIAL')
  if (resolved) {
    for (const [k, v] of Object.entries(resolved)) {
      if (v) params.set(k, v)
    }
  }
  redirect(`/articles?${params.toString()}`)
}
