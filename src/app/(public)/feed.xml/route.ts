// src/app/(public)/feed.xml/route.ts
import { db } from '@/lib/db'
import { ArticleStatus } from '@prisma/client'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const articles = await db.article.findMany({
    where: { status: ArticleStatus.PUBLISHED },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  }).catch(() => [])

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://cyberpulse.io'

  const items = articles
    .map((a) => {
      const url = `${baseUrl}/articles/${a.slug}`
      const pubDate = a.publishedAt ? new Date(a.publishedAt).toUTCString() : new Date().toUTCString()
      const description = a.excerpt ? `<![CDATA[${a.excerpt}]]>` : ''
      return `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${a.author?.name ?? 'CyberPulse'}</author>
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CyberPulse — Cybersecurity Knowledge &amp; Intelligence</title>
    <link>${baseUrl}</link>
    <description>Africa's premier cybersecurity knowledge platform. Latest articles, threat intelligence, and security research.</description>
    <language>en-ng</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/favicon.ico</url>
      <title>CyberPulse</title>
      <link>${baseUrl}</link>
    </image>${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
