// src/app/admin/layout.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { canAccessAdmin } from '@/lib/rbac'
import { Role } from '@prisma/client'
import Link from 'next/link'
import {
  Shield, LayoutDashboard, FileText, Users, Bug, Wrench,
  Briefcase, Calendar, Mail, Bell, Settings, BarChart2,
  Radio, LogOut, ChevronRight, AlertTriangle
} from 'lucide-react'
import { signOut } from '@/lib/auth'

const adminNavItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Articles',
    href: '/admin/articles',
    icon: FileText,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Threat Intel',
    href: '/admin/threats',
    icon: Radio,
  },
  {
    label: 'Vulnerabilities',
    href: '/admin/vulnerabilities',
    icon: Bug,
  },
  {
    label: 'Tools',
    href: '/admin/tools',
    icon: Wrench,
  },
  {
    label: 'Jobs',
    href: '/admin/jobs',
    icon: Briefcase,
  },
  {
    label: 'Events',
    href: '/admin/events',
    icon: Calendar,
  },
  {
    label: 'Newsletter',
    href: '/admin/newsletter',
    icon: Mail,
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart2,
  },
  {
    label: 'Reports',
    href: '/admin/security-reports',
    icon: AlertTriangle,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/admin')
  }

  const role = session.user.role as Role
  if (!canAccessAdmin(role)) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <div>
              <p className="font-bold text-sm text-foreground">CyberPulse</p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-0.5">
            {adminNavItems.map((item) => {
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
          </div>
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {session.user.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{session.user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{role.toLowerCase().replace('_', ' ')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 text-center text-xs py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              View Site
            </Link>
            <form action={async () => {
              'use server'
              await signOut({ redirectTo: '/' })
            }}>
              <button
                type="submit"
                className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Logout
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card flex items-center px-6 gap-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link href="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors" aria-label="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
