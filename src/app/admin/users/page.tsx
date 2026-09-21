// src/app/admin/users/page.tsx
import { db } from '@/lib/db'
import { Role } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import { Users as UsersIcon, Shield, Search, UserCheck, AlertTriangle } from 'lucide-react'
import { revalidatePath } from 'next/cache'

interface AdminUsersProps {
  searchParams: Promise<{ q?: string; role?: string }>
}

export const metadata = {
  title: 'User Management | CyberPulse Admin',
}

export default async function AdminUsersPage({ searchParams }: AdminUsersProps) {
  const { q, role } = await searchParams

  const where: {
    role?: Role
    OR?: Array<{ name?: { contains: string; mode: 'insensitive' }; email?: { contains: string; mode: 'insensitive' } }>
  } = {}

  if (role && Object.values(Role).includes(role as Role)) {
    where.role = role as Role
  }

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ]
  }

  const [users, totalCount] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        _count: {
          select: { articles: true, comments: true },
        },
      },
    }),
    db.user.count({ where }),
  ])

  async function updateRole(formData: FormData) {
    'use server'
    const userId = formData.get('userId') as string
    const newRole = formData.get('role') as Role
    if (!userId || !newRole) return

    await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    })

    revalidatePath('/admin/users')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage user roles, permissions, and monitor community contributors
          </p>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          Total Users: <span className="font-bold text-foreground">{totalCount}</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form method="GET" className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <input
              name="q"
              defaultValue={q ?? ''}
              placeholder="Search by name or email..."
              className="w-full px-4 py-2 pl-10 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-primary"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <select
            name="role"
            defaultValue={role ?? ''}
            className="px-4 py-2 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-primary"
          >
            <option value="">All Roles</option>
            {Object.values(Role).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
          <span>User</span>
          <span className="w-36">Role</span>
          <span className="w-20 text-center">Articles</span>
          <span className="w-20 text-center">Comments</span>
          <span className="w-28 text-right">Joined</span>
        </div>

        {users.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No users match the search criteria.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors">
                <div className="min-w-0 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (user.name ?? user.email ?? 'U')[0].toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{user.name ?? 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>

                <div className="w-36">
                  <form action={updateRole}>
                    <input type="hidden" name="userId" value={user.id} />
                    <select
                      name="role"
                      defaultValue={user.role}
                      onChange={(e) => e.target.form?.requestSubmit()}
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary font-medium"
                    >
                      {Object.values(Role).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </form>
                </div>

                <span className="w-20 text-center text-sm font-medium text-foreground">
                  {user._count.articles}
                </span>

                <span className="w-20 text-center text-sm font-medium text-foreground">
                  {user._count.comments}
                </span>

                <span className="w-28 text-right text-xs text-muted-foreground" suppressHydrationWarning>
                  {formatDate(user.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
