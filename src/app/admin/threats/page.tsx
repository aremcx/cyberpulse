// src/app/admin/threats/page.tsx
import { db } from '@/lib/db'
import { Radio, Bug, Shield, Globe, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Threat Intelligence | CyberPulse Admin',
}

export default async function AdminThreatsPage() {
  const [actors, malwares, indicatorsCount] = await Promise.all([
    db.threatActor.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 20,
    }),
    db.malware.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 20,
    }),
    db.indicator.count(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-foreground">Threat Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Adversary profiling, malware family registry, and indicators of compromise (IOCs)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{actors.length}</p>
              <p className="text-xs text-muted-foreground">Tracked Threat Actors</p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{malwares.length}</p>
              <p className="text-xs text-muted-foreground">Malware Families</p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{indicatorsCount}</p>
              <p className="text-xs text-muted-foreground">Indicators of Compromise</p>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Actors */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Radio className="w-4 h-4 text-red-400" />
          Threat Actors
        </h2>
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {actors.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No threat actors recorded yet.
            </div>
          ) : (
            actors.map((actor) => (
              <div key={actor.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground text-sm">{actor.name}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      {actor.type}
                    </span>
                    {actor.origin && (
                      <span className="text-xs text-muted-foreground">({actor.origin})</span>
                    )}
                  </div>
                  {actor.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{actor.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {actor.targets.map((t) => (
                    <span key={t} className="px-2 py-0.5 text-[10px] rounded-full bg-muted text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Malware */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Bug className="w-4 h-4 text-orange-400" />
          Malware Signatures
        </h2>
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {malwares.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No malware families recorded yet.
            </div>
          ) : (
            malwares.map((m) => (
              <div key={m.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground text-sm">{m.name}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {m.type}
                    </span>
                  </div>
                  {m.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{m.description}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
