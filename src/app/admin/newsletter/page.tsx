// src/app/admin/newsletter/page.tsx
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { Mail, Users, CheckCircle2, XCircle } from 'lucide-react'

export const metadata = {
  title: 'Newsletter Subscribers | CyberPulse Admin',
}

export default async function AdminNewsletterPage() {
  const [subscribers, totalCount, activeCount] = await Promise.all([
    db.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    db.newsletterSubscriber.count(),
    db.newsletterSubscriber.count({ where: { unsubscribedAt: null } }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Newsletter Audience</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage cybersecurity weekly intelligence digest subscribers and subscriber metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{totalCount}</p>
              <p className="text-xs text-muted-foreground">Total Subscribers</p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active Subscriptions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3.5 bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
          <span>Subscriber Email</span>
          <span className="w-24 text-center">Status</span>
          <span className="w-28 text-right">Subscribed</span>
        </div>

        {subscribers.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No newsletter subscribers yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {subscribers.map((sub) => (
              <div key={sub.id} className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors">
                <p className="text-sm font-medium text-foreground truncate">{sub.email}</p>

                <div className="w-24 text-center">
                  {!sub.unsubscribedAt ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted text-muted-foreground">
                      Inactive
                    </span>
                  )}
                </div>

                <span className="w-28 text-right text-xs text-muted-foreground" suppressHydrationWarning>
                  {formatDate(sub.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
