// src/app/admin/security-reports/page.tsx
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { AlertTriangle, ShieldCheck, Clock, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Security Disclosures | CyberPulse Admin',
}

export default async function AdminSecurityReportsPage() {
  const reports = await db.securityReport.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Security Vulnerability Disclosures</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Responsible disclosure submissions and platform security triage queue
          </p>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          Total Reports: <span className="font-bold text-foreground">{reports.length}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3.5 bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
          <span>Report & Component</span>
          <span className="w-24 text-center">Severity</span>
          <span className="w-28 text-center">Status</span>
          <span className="w-28 text-right">Submitted</span>
        </div>

        {reports.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground text-sm">
            <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-emerald-400 opacity-60" />
            <p className="font-bold text-foreground">No vulnerability reports submitted</p>
            <p className="text-xs text-muted-foreground mt-1">Responsible disclosures from researchers will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {reports.map((r) => (
              <div key={r.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground truncate">{r.affectedComponent}</h3>
                  <p className="text-xs text-muted-foreground truncate">{r.description}</p>
                </div>

                <div className="w-24 text-center">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    r.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
                    r.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {r.severity}
                  </span>
                </div>

                <div className="w-28 text-center">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-muted text-muted-foreground">
                    {r.status}
                  </span>
                </div>

                <span className="w-28 text-right text-xs text-muted-foreground" suppressHydrationWarning>
                  {formatDate(r.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
