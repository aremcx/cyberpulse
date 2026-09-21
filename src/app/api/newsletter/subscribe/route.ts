// src/app/api/newsletter/subscribe/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  subNews: z.boolean().default(true),
  subThreatIntel: z.boolean().default(false),
  subVulns: z.boolean().default(false),
  subTutorials: z.boolean().default(false),
  subCareers: z.boolean().default(false),
  subEvents: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = subscribeSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const { email, ...prefs } = parsed.data

    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existing) {
      if (existing.unsubscribedAt) {
        // Re-subscribe
        await db.newsletterSubscriber.update({
          where: { id: existing.id },
          data: { unsubscribedAt: null, confirmedAt: new Date(), ...prefs },
        })
        return Response.json({ message: 'Welcome back! You have been re-subscribed.' })
      }
      return Response.json({ message: 'You are already subscribed!' })
    }

    await db.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase(),
        confirmedAt: new Date(), // auto-confirm for now; in prod, send confirmation email
        ...prefs,
      },
    })

    return Response.json(
      { message: 'Successfully subscribed!' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Newsletter Subscribe]', error)
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return Response.json({ error: 'Missing unsubscribe token' }, { status: 400 })
    }

    const sub = await db.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
    })

    if (!sub) {
      return Response.json({ error: 'Invalid token' }, { status: 404 })
    }

    await db.newsletterSubscriber.update({
      where: { id: sub.id },
      data: { unsubscribedAt: new Date() },
    })

    return Response.json({ message: 'Successfully unsubscribed' })
  } catch (error) {
    console.error('[Newsletter Unsubscribe]', error)
    return Response.json({ error: 'Failed to unsubscribe' }, { status: 500 })
  }
}
