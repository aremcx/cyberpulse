// src/proxy.ts  — Next.js 16 naming convention (replaces middleware.ts)
// Runs in Node.js runtime (full Node access)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/profile']
// Routes that require admin access
const adminRoutes = ['/admin']
// Auth routes — redirect to dashboard if already logged in
const authRoutes = ['/auth/login', '/auth/register']
// Admin role values (avoids Prisma import)
const adminRoles = new Set(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MODERATOR'])

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Get session via auth()
  const session = await auth()
  const isAuthenticated = !!session?.user

  // ---- Auth route redirect ----
  if (authRoutes.some((r) => pathname.startsWith(r))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // ---- Protected routes ----
  if (protectedRoutes.some((r) => pathname.startsWith(r))) {
    if (!isAuthenticated) {
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  // ---- Admin routes ----
  if (adminRoutes.some((r) => pathname.startsWith(r))) {
    if (!isAuthenticated) {
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    const role = (session?.user as { role?: string })?.role
    if (!role || !adminRoles.has(role)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)).*)',
  ],
}
