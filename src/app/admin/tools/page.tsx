// src/app/admin/tools/page.tsx
import { db } from '@/lib/db'
import { Wrench, Star, ExternalLink, GitBranch, Plus } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export const metadata = {
  title: 'Tools Directory Admin | CyberPulse',
}

export default async function AdminToolsPage() {
  const tools = await db.tool.findMany({
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  })

  async function toggleFeatured(formData: FormData) {
    'use server'
    const toolId = formData.get('toolId') as string
    const current = formData.get('featured') === 'true'
    if (!toolId) return

    await db.tool.update({
      where: { id: toolId },
      data: { featured: !current },
    })

    revalidatePath('/admin/tools')
    revalidatePath('/tools')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Tools Directory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Administer security utilities, SIEM systems, pentesting tools, and featured entries
          </p>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          Total Tools: <span className="font-bold text-foreground">{tools.length}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
          <span>Tool</span>
          <span className="w-32">Category</span>
          <span className="w-24 text-center">Type</span>
          <span className="w-24 text-center">Featured</span>
          <span className="w-24 text-right">Links</span>
        </div>

        {tools.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No tools in directory yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tools.map((tool) => (
              <div key={tool.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground truncate">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
                </div>

                <span className="w-32 text-xs font-medium text-muted-foreground truncate">
                  {tool.category}
                </span>

                <div className="w-24 text-center">
                  {tool.isOpenSource ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Open Source
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted text-muted-foreground">
                      Proprietary
                    </span>
                  )}
                </div>

                <div className="w-24 flex justify-center">
                  <form action={toggleFeatured}>
                    <input type="hidden" name="toolId" value={tool.id} />
                    <input type="hidden" name="featured" value={String(tool.featured)} />
                    <button
                      type="submit"
                      className={`p-1.5 rounded-lg border transition-colors ${
                        tool.featured
                          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                      title={tool.featured ? 'Unfeature' : 'Feature on homepage'}
                    >
                      <Star className={`w-4 h-4 ${tool.featured ? 'fill-yellow-400' : ''}`} />
                    </button>
                  </form>
                </div>

                <div className="w-24 flex justify-end gap-1">
                  {tool.website && (
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                      title="Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {tool.github && (
                    <a
                      href={tool.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                      title="GitHub"
                    >
                      <GitBranch className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
