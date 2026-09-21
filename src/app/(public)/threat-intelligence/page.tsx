// src/app/(public)/threat-intelligence/page.tsx
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Threat Intelligence | CyberPulse',
  description: 'Real-time threat intelligence, APT tracking, IOC feeds, and adversary profiling for the African cyber ecosystem.',
}

export default async function ThreatIntelligencePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const resolved = await searchParams
  const params = new URLSearchParams()
  params.set('contentType', 'THREAT_REPORT')
  if (resolved) {
    for (const [k, v] of Object.entries(resolved)) {
      if (v) params.set(k, v)
    }
  }
  redirect(`/articles?${params.toString()}`)
}
