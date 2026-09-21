// src/app/dashboard/profile/page.tsx
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { User as UserIcon, Globe, GitBranch, Share2, MapPin, Save, Shield } from 'lucide-react'

export const metadata = {
  title: 'Profile Settings | CyberPulse Dashboard',
}

export default async function DashboardProfilePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/dashboard/profile')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    redirect('/auth/login')
  }

  async function updateProfile(formData: FormData) {
    'use server'
    const session = await auth()
    if (!session?.user?.id) return

    const name = formData.get('name') as string
    const username = formData.get('username') as string
    const bio = formData.get('bio') as string
    const location = formData.get('location') as string
    const website = formData.get('website') as string
    const twitter = formData.get('twitter') as string
    const github = formData.get('github') as string
    const linkedin = formData.get('linkedin') as string

    await db.user.update({
      where: { id: session.user.id },
      data: {
        name: name?.trim() || null,
        username: username?.trim() || null,
        bio: bio?.trim() || null,
        location: location?.trim() || null,
        website: website?.trim() || null,
        twitter: twitter?.trim() || null,
        github: github?.trim() || null,
        linkedin: linkedin?.trim() || null,
      },
    })

    revalidatePath('/dashboard/profile')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-foreground">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your public cybersecurity profile and social links
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <form action={updateProfile} className="space-y-6">
          {/* Avatar and basic info */}
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-2xl font-bold text-primary overflow-hidden">
              {user.image ? (
                <img src={user.image} alt={user.name ?? ''} className="w-full h-full object-cover" />
              ) : (
                (user.name ?? user.email ?? 'U')[0].toUpperCase()
              )}
            </div>
            <div>
              <p className="font-bold text-foreground text-base">{user.name ?? 'User'}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary/10 text-primary capitalize">
                {user.role.toLowerCase().replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name ?? ''}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1.5">
                Username / Handle
              </label>
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={user.username ?? ''}
                placeholder="e.g. cyber_analyst"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1.5">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                defaultValue={user.bio ?? ''}
                placeholder="Tell the cybersecurity community about your background, interests, and research..."
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1.5">
                Location
              </label>
              <div className="relative">
                <input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue={user.location ?? ''}
                  placeholder="e.g. Lagos, Nigeria"
                  className="w-full px-4 py-2.5 pl-9 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-foreground mb-1.5">
                Personal Website / Portfolio
              </label>
              <div className="relative">
                <input
                  id="website"
                  name="website"
                  type="text"
                  defaultValue={user.website ?? ''}
                  placeholder="https://yourblog.io"
                  className="w-full px-4 py-2.5 pl-9 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Globe className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-foreground mb-1.5">
                Twitter / X Handle
              </label>
              <div className="relative">
                <input
                  id="twitter"
                  name="twitter"
                  type="text"
                  defaultValue={user.twitter ?? ''}
                  placeholder="@handle"
                  className="w-full px-4 py-2.5 pl-9 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Share2 className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="github" className="block text-sm font-medium text-foreground mb-1.5">
                GitHub Username
              </label>
              <div className="relative">
                <input
                  id="github"
                  name="github"
                  type="text"
                  defaultValue={user.github ?? ''}
                  placeholder="username"
                  className="w-full px-4 py-2.5 pl-9 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <GitBranch className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="linkedin" className="block text-sm font-medium text-foreground mb-1.5">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <input
                  id="linkedin"
                  name="linkedin"
                  type="text"
                  defaultValue={user.linkedin ?? ''}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2.5 pl-9 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Share2 className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all cyber-glow"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
