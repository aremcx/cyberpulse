// src/app/api/auth/register/route.ts
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { registerSchema } from '@/lib/validations/auth'
import { createAuditLog } from '@/lib/services/audit'
import { slugify } from '@/lib/utils'
import { Role } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    // Check existing user
    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existing) {
      return Response.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Generate unique username
    const baseUsername = slugify(name).substring(0, 20)
    let username = baseUsername
    let suffix = 0

    while (await db.user.findUnique({ where: { username } })) {
      suffix++
      username = `${baseUsername}${suffix}`
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        username,
        password: hashedPassword,
        role: Role.USER,
      },
      select: { id: true, email: true, name: true, username: true },
    })

    // Audit log
    await createAuditLog({
      userId: user.id,
      action: 'REGISTER',
      resource: 'auth',
      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
    })

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, user.name ?? '', token)

    return Response.json(
      { message: 'Account created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Register API]', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
