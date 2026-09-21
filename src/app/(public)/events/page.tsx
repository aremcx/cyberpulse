// src/app/(public)/events/page.tsx
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { Calendar, MapPin, Globe, ExternalLink, Video } from 'lucide-react'
import { EventCategory } from '@prisma/client'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cybersecurity Events',
  description: 'Conferences, CTFs, webinars, and training events in cybersecurity — focused on Africa and the global community.',
}

interface EventsPageProps {
  searchParams: Promise<{ category?: string; region?: string }>
}

const categoryConfig: Record<EventCategory, { label: string; color: string }> = {
  CONFERENCE: { label: 'Conference', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  WEBINAR: { label: 'Webinar', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  CTF: { label: 'CTF', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  HACKATHON: { label: 'Hackathon', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  TRAINING: { label: 'Training', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  MEETUP: { label: 'Meetup', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  WORKSHOP: { label: 'Workshop', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const filters = await searchParams
  const now = new Date()

  const where = {
    startDate: { gte: now },
    ...(filters.category ? { category: filters.category as EventCategory } : {}),
    ...(filters.region ? { region: { contains: filters.region, mode: 'insensitive' as const } } : {}),
  }

  const [upcoming, past] = await Promise.all([
    db.event.findMany({ where, orderBy: { startDate: 'asc' }, take: 20 }),
    db.event.findMany({
      where: { startDate: { lt: now } },
      orderBy: { startDate: 'desc' },
      take: 6,
    }),
  ])

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-7 h-7 text-purple-400" />
          <h1 className="text-3xl font-black text-foreground">Cybersecurity Events</h1>
        </div>
        <p className="text-muted-foreground">
          Conferences, CTFs, webinars, and training events — focused on Africa and the global security community.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        <Link
          href="/events"
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            !filters.category ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
          }`}
        >
          All
        </Link>
        {Object.entries(categoryConfig).map(([value, config]) => (
          <Link
            key={value}
            href={`/events?category=${value}`}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              filters.category === value ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
            }`}
          >
            {config.label}
          </Link>
        ))}
      </div>

      {/* Upcoming Events */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Upcoming Events
          <span className="ml-3 px-2.5 py-0.5 text-sm rounded-full bg-primary/10 text-primary font-medium">
            {upcoming.length}
          </span>
        </h2>

        {upcoming.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-border">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground">No upcoming events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {upcoming.map((event) => {
              const cat = categoryConfig[event.category]
              return (
                <div
                  key={event.id}
                  className={`p-5 rounded-2xl border transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 duration-300 ${
                    event.featured ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'
                  }`}
                >
                  {event.featured && (
                    <span className="inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-primary/20 text-primary mb-3">
                      ⚡ Featured
                    </span>
                  )}

                  <div className="flex items-start gap-3 mb-3">
                    {/* Date block */}
                    <div className="shrink-0 w-14 text-center rounded-xl border border-border bg-background p-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {formatDate(event.startDate, 'MMM')}
                      </p>
                      <p className="text-2xl font-black text-foreground leading-none">
                        {formatDate(event.startDate, 'd')}
                      </p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-2 py-0.5 text-xs rounded-full border font-medium ${cat.color}`}>
                          {cat.label}
                        </span>
                        {event.isOnline && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Video className="w-3 h-3" />
                            Online
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-foreground leading-snug">{event.name}</h3>
                      {event.organizer && (
                        <p className="text-sm text-muted-foreground mt-0.5">By {event.organizer}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{event.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {event.location && !event.isOnline && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </span>
                      )}
                      {event.endDate && event.endDate.toDateString() !== event.startDate.toDateString() && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Until {formatDate(event.endDate, 'MMM d')}
                        </span>
                      )}
                    </div>
                    {event.registrationUrl && (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                        id={`register-event-${event.id}`}
                      >
                        Register
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Past Events */}
      {past.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-foreground mb-6 text-muted-foreground/70">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {past.map((event) => {
              const cat = categoryConfig[event.category]
              return (
                <div key={event.id} className="p-4 rounded-xl border border-border bg-card opacity-60">
                  <span className={`px-2 py-0.5 text-xs rounded-full border font-medium ${cat.color}`}>
                    {cat.label}
                  </span>
                  <h3 className="font-semibold text-foreground mt-2 text-sm line-clamp-2">{event.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(event.startDate)}</p>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Submit event CTA */}
      <div className="mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5 text-center">
        <h3 className="font-bold text-foreground mb-2">Organizing a Cybersecurity Event?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Submit your conference, CTF, webinar, or workshop to be featured in our events calendar.
        </p>
        <a
          href="/contact?subject=event-submission"
          className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
        >
          Submit Your Event
        </a>
      </div>
    </div>
  )
}
