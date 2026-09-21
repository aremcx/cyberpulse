// src/app/dashboard/settings/page.tsx
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Settings as SettingsIcon, Bell, Shield, Lock, Mail, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Account Settings | CyberPulse Dashboard',
}

export default async function DashboardSettingsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/dashboard/settings')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account preferences, notifications, and security
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Info */}
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Account Overview</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <span className="text-xs text-muted-foreground block mb-1">Email Address</span>
              <span className="font-semibold text-foreground">{user.email}</span>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <span className="text-xs text-muted-foreground block mb-1">Account Role</span>
              <span className="font-semibold text-foreground capitalize">
                {user.role.toLowerCase().replace('_', ' ')}
              </span>
            </div>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Email Notifications</h2>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <p className="font-semibold text-foreground">Critical Vulnerability Alerts</p>
                <p className="text-xs text-muted-foreground mt-0.5">Receive immediate email alerts when critical CVEs are disclosed.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary rounded cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <p className="font-semibold text-foreground">Weekly CyberPulse Intelligence Digest</p>
                <p className="text-xs text-muted-foreground mt-0.5">Weekly curated threat reports, news roundup, and job postings.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary rounded cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <p className="font-semibold text-foreground">Article Comments & Reviews</p>
                <p className="text-xs text-muted-foreground mt-0.5">Notifications when readers comment on your articles or editorial reviews are ready.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary rounded cursor-pointer" />
            </div>
          </div>
        </section>

        {/* Security & Password */}
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Security</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            To change your password or security credentials, use our self-service reset flow.
          </p>
          <a
            href="/auth/forgot-password"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted/60 hover:text-primary transition-colors"
          >
            Request Password Change
          </a>
        </section>
      </div>
    </div>
  )
}
