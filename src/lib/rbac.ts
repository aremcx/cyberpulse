// src/lib/rbac.ts
import { Role } from '@prisma/client'

// Permission keys
export type Permission =
  // Articles
  | 'articles:create'
  | 'articles:read'
  | 'articles:update:own'
  | 'articles:update:any'
  | 'articles:delete:own'
  | 'articles:delete:any'
  | 'articles:publish'
  | 'articles:submit'
  | 'articles:review'
  | 'articles:schedule'
  | 'articles:feature'
  // Comments
  | 'comments:create'
  | 'comments:delete:own'
  | 'comments:delete:any'
  | 'comments:moderate'
  // Users
  | 'users:read'
  | 'users:update:own'
  | 'users:update:any'
  | 'users:delete:any'
  | 'users:suspend'
  | 'users:role:assign'
  // Categories & Tags
  | 'categories:manage'
  | 'tags:manage'
  // Threat Intel
  | 'threats:read'
  | 'threats:manage'
  // Vulnerabilities
  | 'vulns:read'
  | 'vulns:manage'
  // Tools
  | 'tools:read'
  | 'tools:manage'
  // Jobs
  | 'jobs:read'
  | 'jobs:manage'
  // Events
  | 'events:read'
  | 'events:manage'
  // Newsletter
  | 'newsletter:subscribe'
  | 'newsletter:manage'
  // Notifications
  | 'notifications:read:own'
  // Audit Logs
  | 'audit:read'
  // Admin
  | 'admin:access'
  | 'settings:manage'
  | 'analytics:read'
  // Bookmarks & Likes
  | 'bookmarks:manage:own'
  | 'likes:manage:own'
  // Security Reports
  | 'security-reports:submit'
  | 'security-reports:manage'

const rolePermissions: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [
    'articles:create', 'articles:read', 'articles:update:own', 'articles:update:any',
    'articles:delete:own', 'articles:delete:any', 'articles:publish', 'articles:submit',
    'articles:review', 'articles:schedule', 'articles:feature',
    'comments:create', 'comments:delete:own', 'comments:delete:any', 'comments:moderate',
    'users:read', 'users:update:own', 'users:update:any', 'users:delete:any',
    'users:suspend', 'users:role:assign',
    'categories:manage', 'tags:manage',
    'threats:read', 'threats:manage',
    'vulns:read', 'vulns:manage',
    'tools:read', 'tools:manage',
    'jobs:read', 'jobs:manage',
    'events:read', 'events:manage',
    'newsletter:subscribe', 'newsletter:manage',
    'notifications:read:own',
    'audit:read',
    'admin:access', 'settings:manage', 'analytics:read',
    'bookmarks:manage:own', 'likes:manage:own',
    'security-reports:submit', 'security-reports:manage',
  ],
  [Role.ADMIN]: [
    'articles:create', 'articles:read', 'articles:update:own', 'articles:update:any',
    'articles:delete:own', 'articles:delete:any', 'articles:publish', 'articles:submit',
    'articles:review', 'articles:schedule', 'articles:feature',
    'comments:create', 'comments:delete:own', 'comments:delete:any', 'comments:moderate',
    'users:read', 'users:update:own', 'users:update:any', 'users:suspend',
    'categories:manage', 'tags:manage',
    'threats:read', 'threats:manage',
    'vulns:read', 'vulns:manage',
    'tools:read', 'tools:manage',
    'jobs:read', 'jobs:manage',
    'events:read', 'events:manage',
    'newsletter:subscribe', 'newsletter:manage',
    'notifications:read:own',
    'audit:read',
    'admin:access', 'analytics:read',
    'bookmarks:manage:own', 'likes:manage:own',
    'security-reports:submit', 'security-reports:manage',
  ],
  [Role.EDITOR]: [
    'articles:create', 'articles:read', 'articles:update:own', 'articles:update:any',
    'articles:delete:own', 'articles:publish', 'articles:submit', 'articles:review', 'articles:schedule',
    'comments:create', 'comments:delete:own', 'comments:moderate',
    'users:read', 'users:update:own',
    'categories:manage', 'tags:manage',
    'threats:read', 'vulns:read', 'tools:read',
    'jobs:read', 'events:read',
    'newsletter:subscribe',
    'notifications:read:own',
    'admin:access', 'analytics:read',
    'bookmarks:manage:own', 'likes:manage:own',
    'security-reports:submit',
  ],
  [Role.AUTHOR]: [
    'articles:create', 'articles:read', 'articles:update:own', 'articles:delete:own', 'articles:submit',
    'comments:create', 'comments:delete:own',
    'users:read', 'users:update:own',
    'threats:read', 'vulns:read', 'tools:read',
    'jobs:read', 'events:read',
    'newsletter:subscribe',
    'notifications:read:own',
    'bookmarks:manage:own', 'likes:manage:own',
    'security-reports:submit',
  ],
  [Role.CONTRIBUTOR]: [
    'articles:create', 'articles:read', 'articles:update:own', 'articles:submit',
    'comments:create', 'comments:delete:own',
    'users:read', 'users:update:own',
    'threats:read', 'vulns:read', 'tools:read',
    'jobs:read', 'events:read',
    'newsletter:subscribe',
    'notifications:read:own',
    'bookmarks:manage:own', 'likes:manage:own',
    'security-reports:submit',
  ],
  [Role.MODERATOR]: [
    'articles:read',
    'comments:create', 'comments:delete:own', 'comments:delete:any', 'comments:moderate',
    'users:read', 'users:update:own',
    'threats:read', 'vulns:read', 'tools:read',
    'jobs:read', 'events:read',
    'newsletter:subscribe',
    'notifications:read:own',
    'bookmarks:manage:own', 'likes:manage:own',
    'security-reports:submit',
  ],
  [Role.USER]: [
    'articles:read',
    'comments:create', 'comments:delete:own',
    'users:read', 'users:update:own',
    'threats:read', 'vulns:read', 'tools:read',
    'jobs:read', 'events:read',
    'newsletter:subscribe',
    'notifications:read:own',
    'bookmarks:manage:own', 'likes:manage:own',
    'security-reports:submit',
  ],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

export function canAccessAdmin(role: Role): boolean {
  return hasPermission(role, 'admin:access')
}

export function isAtLeast(role: Role, minRole: Role): boolean {
  const hierarchy: Role[] = [
    Role.USER,
    Role.CONTRIBUTOR,
    Role.MODERATOR,
    Role.AUTHOR,
    Role.EDITOR,
    Role.ADMIN,
    Role.SUPER_ADMIN,
  ]
  return hierarchy.indexOf(role) >= hierarchy.indexOf(minRole)
}
