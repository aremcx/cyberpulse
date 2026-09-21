// src/app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import {
  Shield, LayoutDashboard, FileText, BookmarkIcon, Bell,
  User, Settings, PenSquare, LogOut, ChevronRight
} from 'lucide-react'
import { signOut } from '@/lib/auth'
import { getInitials } from '@/lib/utils'

const dashboardNav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/articles', label: 'My Articles', icon: FileText },
  { href: '/dashboard/articles/new', label: 'Write Article', icon: PenSquare },
  { href: '/dashboard/bookmarks', label: 'Bookmarks', icon: BookmarkIcon },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/dashboard')
  }

  const user = session.user

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-bold text-sm">
            <span className="gradient-text">Cyber</span><span>Pulse</span>
          </span>
        </Link>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Dashboard</span>
        <div className="flex-1" />
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← View Site
        </Link>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col">
          {/* User info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img src={user.image} alt={user.name ?? ''} className="w-9 h-9 rounded-full object-cover border border-border" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary">
                  {getInitials(user.name ?? user.email ?? 'U')}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-0.5">
            {dashboardNav.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors group"
                >
                  <Icon className="w-4 h-4 shrink-0 group-hover:text-primary transition-colors" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-border">
            <form action={async () => {
              'use server'
              await signOut({ redirectTo: '/' })
            }}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
