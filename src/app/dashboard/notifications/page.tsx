// src/app/dashboard/notifications/page.tsx
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Bell, CheckCircle2, MessageSquare, Shield, AlertTriangle, ExternalLink } from 'lucide-react'

export const metadata = {
  title: 'Notifications | CyberPulse Dashboard',
}

export default async function NotificationsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/dashboard/notifications')
  }

  const notifications = await db.notification.findMany({
    where: { recipientId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      sender: { select: { name: true, image: true, username: true } },
    },
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            System alerts, comments, editorial feedback, and platform updates
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-border bg-card">
          <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <h3 className="font-bold text-foreground text-base mb-1">No notifications yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You are all caught up. When someone interacts with your articles or there are editorial updates, you will see them here.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {notifications.map((notif) => {
            const Wrapper = notif.link ? Link : 'div'
            return (
              <Wrapper
                key={notif.id}
                href={notif.link ?? '#'}
                className={`p-4 flex items-start gap-3.5 transition-colors ${
                  notif.link ? 'hover:bg-muted/40 cursor-pointer' : ''
                } ${!notif.isRead ? 'bg-primary/5' : ''}`}
              >
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  !notif.isRead ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">
                      {notif.title}
                    </p>
                    <span className="text-xs text-muted-foreground shrink-0" suppressHydrationWarning>
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>

                  {notif.message && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notif.message}
                    </p>
                  )}
                </div>

                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 self-center" />
                )}
              </Wrapper>
            )
          })}
        </div>
      )}
    </div>
  )
}
