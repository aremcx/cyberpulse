// src/app/(public)/tools/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { DifficultyBadge } from '@/components/ui/Badge'
import { Wrench, Search, ExternalLink, GitBranch, Star } from 'lucide-react'
import { DifficultyLevel } from '@prisma/client'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Security Tools Directory',
  description: 'Comprehensive directory of cybersecurity tools — SIEM, penetration testing, forensics, threat intelligence, and more.',
}

interface ToolsPageProps {
  searchParams: Promise<{ q?: string; category?: string; level?: string; opensource?: string }>
}

const toolCategories = [
  'All', 'SIEM', 'Penetration Testing', 'Network Security', 'Web Security',
  'Digital Forensics', 'Threat Intelligence', 'Cloud Security', 'Malware Analysis',
  'Vulnerability Management', 'SOAR', 'Endpoint Security',
]

async function ToolsGrid({ filters }: { filters: Awaited<ToolsPageProps['searchParams']> }) {
  const where = {
    ...(filters.category && filters.category !== 'All' ? { category: filters.category } : {}),
    ...(filters.level ? { skillLevel: filters.level as DifficultyLevel } : {}),
    ...(filters.opensource === 'true' ? { isOpenSource: true } : {}),
    ...(filters.q
      ? {
          OR: [
            { name: { contains: filters.q, mode: 'insensitive' as const } },
            { description: { contains: filters.q, mode: 'insensitive' as const } },
            { category: { contains: filters.q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const tools = await db.tool.findMany({
    where,
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  })

  if (!tools.length) {
    return (
      <div className="text-center py-16 rounded-2xl border border-border col-span-full">
        <Wrench className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium text-foreground">No tools found</p>
        <p className="text-sm text-muted-foreground mt-1">Try different search terms.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {tools.map((tool) => (
        <div
          key={tool.id}
          className={`flex flex-col p-5 rounded-2xl border transition-all group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 duration-300 ${
            tool.featured ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
          }`}
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl border border-border bg-muted flex items-center justify-center text-2xl shrink-0 overflow-hidden">
              {tool.logo ? (
                <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" />
              ) : (
                '🔧'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {tool.name}
                </h2>
                {tool.featured && (
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">{tool.category}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed mb-4">
            {tool.description}
          </p>

          {/* Platforms */}
          {tool.platform.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tool.platform.map((p) => (
                <span key={p} className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                  {p}
                </span>
              ))}
            </div>
          )}

          {/* Use cases */}
          {tool.useCases.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tool.useCases.slice(0, 3).map((uc) => (
                <span key={uc} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                  {uc}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              {tool.skillLevel && <DifficultyBadge difficulty={tool.skillLevel} />}
              {tool.isOpenSource && (
                <span className="text-xs text-green-400 font-medium">Open Source</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {tool.github && (
                <a
                  href={tool.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  aria-label={`${tool.name} GitHub`}
                >
                  <GitBranch className="w-4 h-4" />
                </a>
              )}
              {tool.website && (
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={`${tool.name} website`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const filters = await searchParams
  const totalTools = await db.tool.count()
  const openSourceCount = await db.tool.count({ where: { isOpenSource: true } })

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Wrench className="w-7 h-7 text-emerald-400" />
          <h1 className="text-3xl font-black text-foreground">Security Tools Directory</h1>
        </div>
        <p className="text-muted-foreground mb-4">
          {totalTools} tools · {openSourceCount} open source — curated for security professionals at every level.
        </p>
      </div>

      {/* Filters */}
      <form method="get" className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              name="q"
              defaultValue={filters.q ?? ''}
              placeholder="Search tools..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              id="tool-search"
            />
          </div>
          <select
            name="level"
            defaultValue={filters.level ?? ''}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary"
            id="tool-level-filter"
          >
            <option value="">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer px-3 py-2 rounded-lg border border-border hover:bg-muted/30">
            <input
              type="checkbox"
              name="opensource"
              value="true"
              defaultChecked={filters.opensource === 'true'}
              id="opensource-filter"
            />
            Open Source Only
          </label>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            id="tool-search-submit"
          >
            Search
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {toolCategories.map((cat) => (
            <a
              key={cat}
              href={`/tools?category=${cat === 'All' ? '' : encodeURIComponent(cat)}`}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                (filters.category === cat || (!filters.category && cat === 'All'))
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
              }`}
            >
              {cat}
            </a>
          ))}
        </div>
      </form>

      {/* Grid */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-56 rounded-2xl" />
            ))}
          </div>
        }
      >
        <ToolsGrid filters={filters} />
      </Suspense>
    </div>
  )
}
