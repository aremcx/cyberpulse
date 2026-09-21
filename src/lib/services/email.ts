// src/lib/services/email.ts
/**
 * Email service interface.
 * Currently logs to console in development.
 * Replace the implementation with Resend/SendGrid when RESEND_API_KEY is set.
 */

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM ?? 'noreply@cyberpulse.io'

  if (!apiKey) {
    // Development: log to console
    console.log('[Email Mock]', {
      from,
      to: options.to,
      subject: options.subject,
      text: options.text ?? options.html.replace(/<[^>]*>/g, ''),
    })
    return { success: true, messageId: 'mock-' + Date.now() }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      return { success: false, error }
    }

    const data = await res.json() as { id: string }
    return { success: true, messageId: data.id }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<EmailResult> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`

  return sendEmail({
    to: email,
    subject: 'Verify your CyberPulse email',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00d4ff;">Welcome to CyberPulse, ${name}!</h1>
        <p>Please verify your email address to complete your registration.</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #00d4ff; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Verify Email
        </a>
        <p style="margin-top: 16px; color: #666; font-size: 14px;">
          If you didn't create an account, you can safely ignore this email.
          This link expires in 24 hours.
        </p>
      </div>
    `,
    text: `Welcome to CyberPulse! Verify your email: ${url}`,
  })
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<EmailResult> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`

  return sendEmail({
    to: email,
    subject: 'Reset your CyberPulse password',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00d4ff;">Password Reset</h1>
        <p>Someone requested a password reset for your CyberPulse account.</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #00d4ff; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Reset Password
        </a>
        <p style="margin-top: 16px; color: #666; font-size: 14px;">
          If you didn't request this, you can safely ignore this email.
          This link expires in 1 hour.
        </p>
      </div>
    `,
    text: `Reset your CyberPulse password: ${url}`,
  })
}

export async function sendArticleStatusEmail(
  email: string,
  name: string,
  articleTitle: string,
  status: 'approved' | 'rejected',
  note?: string
): Promise<EmailResult> {
  const subject = status === 'approved'
    ? `Your article "${articleTitle}" has been approved`
    : `Your article "${articleTitle}" needs changes`

  return sendEmail({
    to: email,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00d4ff;">${subject}</h1>
        <p>Hi ${name},</p>
        ${status === 'approved'
          ? '<p>Great news! Your article has been approved and will be published soon.</p>'
          : '<p>Your article requires some changes before it can be published.</p>'
        }
        ${note ? `<div style="background: #f5f5f5; padding: 12px; border-radius: 6px; margin-top: 12px;"><strong>Editor notes:</strong><br/>${note}</div>` : ''}
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #00d4ff; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold;">
          View Dashboard
        </a>
      </div>
    `,
    text: `${subject}${note ? '\n\nEditor notes: ' + note : ''}`,
  })
}
