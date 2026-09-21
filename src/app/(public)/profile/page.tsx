// src/app/(public)/profile/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function ProfileRedirectPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/dashboard/profile')
  }

  redirect('/dashboard/profile')
}
