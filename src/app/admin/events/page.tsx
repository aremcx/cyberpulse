// src/app/admin/events/page.tsx
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { Calendar, MapPin, Globe, Users } from 'lucide-react'

export const metadata = {
  title: 'Events Admin | CyberPulse',
}

export default async function AdminEventsPage() {
  const events = await db.event.findMany({
    orderBy: { startDate: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Cybersecurity Events</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage webinars, CTF competitions, security summits, and regional meetups
          </p>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          Total Events: <span className="font-bold text-foreground">{events.length}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3.5 bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
          <span>Event</span>
          <span className="w-28 text-center">Category</span>
          <span className="w-28 text-center">Format</span>
          <span className="w-28 text-right">Start Date</span>
        </div>

        {events.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No events scheduled yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {events.map((evt) => (
              <div key={evt.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground truncate">{evt.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{evt.organizer ?? 'CyberPulse'}</p>
                </div>

                <div className="w-28 text-center">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                    {evt.category}
                  </span>
                </div>

                <div className="w-28 text-center text-xs text-muted-foreground">
                  {evt.isOnline ? '🌐 Virtual' : (evt.location ?? 'In-Person')}
                </div>

                <span className="w-28 text-right text-xs font-medium text-foreground" suppressHydrationWarning>
                  {formatDate(evt.startDate)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
