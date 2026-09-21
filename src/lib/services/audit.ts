// src/lib/services/audit.ts
import 'server-only'
import { db } from '@/lib/db'
import { AuditAction, Prisma } from '@prisma/client'

interface AuditLogParams {
  userId?: string
  action: AuditAction
  resource?: string
  resourceId?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

export async function createAuditLog(params: AuditLogParams): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        metadata: params.metadata as Prisma.InputJsonValue | undefined,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    })
  } catch (error) {
    // Audit log failures should never crash the main request
    console.error('[AuditLog] Failed to create audit log:', error)
  }
}

export async function getAuditLogs({
  userId,
  action,
  page = 1,
  limit = 50,
}: {
  userId?: string
  action?: AuditAction
  page?: number
  limit?: number
}) {
  const skip = (page - 1) * limit
  const where = {
    ...(userId ? { userId } : {}),
    ...(action ? { action } : {}),
  }

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    db.auditLog.count({ where }),
  ])

  return { logs, total, pages: Math.ceil(total / limit) }
}
