// src/app/admin/settings/page.tsx
import { db } from '@/lib/db'
import { Settings as SettingsIcon, Shield, Server, Bell, Save } from 'lucide-react'

export const metadata = {
  title: 'Platform Settings | CyberPulse Admin',
}

export default async function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-foreground">Platform Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Global configuration, security policies, and editorial parameters
        </p>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">General Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Site Name</label>
              <input
                type="text"
                defaultValue="CyberPulse"
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-foreground text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Support & Inquiries Email</label>
              <input
                type="email"
                defaultValue="hello@cyberpulse.io"
                readOnly
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-foreground text-sm"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Security & Access Policies</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <p className="font-semibold text-foreground">Public User Registration</p>
                <p className="text-xs text-muted-foreground">Allow new community defenders to create accounts.</p>
              </div>
              <input type="checkbox" defaultChecked readOnly className="w-4 h-4 accent-primary rounded" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <p className="font-semibold text-foreground">Editorial Approval Requirement</p>
                <p className="text-xs text-muted-foreground">Require Editor or Admin approval before community articles go live.</p>
              </div>
              <input type="checkbox" defaultChecked readOnly className="w-4 h-4 accent-primary rounded" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <p className="font-semibold text-foreground">Automated CVE Ingestion Feeds</p>
                <p className="text-xs text-muted-foreground">Sync with NVD and CISA KEV feeds periodically.</p>
              </div>
              <input type="checkbox" defaultChecked readOnly className="w-4 h-4 accent-primary rounded" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
