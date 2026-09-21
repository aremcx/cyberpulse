// src/app/(public)/security/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Lock, AlertTriangle, CheckCircle, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Security Policy | CyberPulse',
  description: 'CyberPulse security policy — how we secure the platform and how to report vulnerabilities.',
}

const measures = [
  { icon: Lock, title: 'Encryption in Transit', description: 'All data transmitted between your browser and our servers is encrypted using TLS 1.3.' },
  { icon: Shield, title: 'Password Security', description: 'Passwords are hashed using bcrypt with a high work factor. We never store plaintext passwords.' },
  { icon: CheckCircle, title: 'Authentication', description: 'Secure session management with HttpOnly cookies, CSRF protection, and support for two-factor authentication.' },
  { icon: AlertTriangle, title: 'Vulnerability Management', description: 'We conduct regular security assessments and promptly patch discovered vulnerabilities.' },
]

export default function SecurityPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Security
            </div>
            <h1 className="text-4xl font-black mb-4">Security Policy</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We take the security of the CyberPulse platform and our users' data seriously. Here's what we do to keep you safe.
            </p>
          </div>

          {/* Security Measures */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Security Measures</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {measures.map((m) => {
                const Icon = m.icon
                return (
                  <div key={m.title} className="p-5 rounded-2xl border border-border bg-muted/20 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{m.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Responsible Disclosure */}
          <section className="mb-16 p-8 rounded-2xl border border-amber-500/30 bg-amber-500/5">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              Responsible Disclosure
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We operate a responsible disclosure programme. If you discover a security vulnerability in the CyberPulse platform, we ask that you:
            </p>
            <ol className="space-y-3 text-sm text-muted-foreground mb-6">
              <li className="flex gap-3"><span className="font-bold text-amber-400">1.</span> Email us at <a href="mailto:security@cyberpulse.io" className="text-primary hover:underline">security@cyberpulse.io</a> with details of the vulnerability.</li>
              <li className="flex gap-3"><span className="font-bold text-amber-400">2.</span> Allow us reasonable time (up to 90 days) to investigate and remediate before public disclosure.</li>
              <li className="flex gap-3"><span className="font-bold text-amber-400">3.</span> Do not exploit the vulnerability, access or modify data that isn't yours, or disrupt the platform's availability.</li>
              <li className="flex gap-3"><span className="font-bold text-amber-400">4.</span> Provide sufficient information to reproduce the issue (screenshots, PoC, affected URLs).</li>
            </ol>
            <p className="text-sm text-muted-foreground">
              We will acknowledge receipt within 24 hours and keep you updated on our remediation progress. Researchers who follow this policy responsibly may be recognised in our security hall of fame.
            </p>
          </section>

          {/* What to Report */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4">What to Report</h2>
            <p className="text-sm text-muted-foreground mb-4">We're interested in hearing about:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                'Authentication bypass or privilege escalation vulnerabilities',
                'SQL injection, XSS, CSRF, or SSRF vulnerabilities',
                'Sensitive data exposure or information disclosure',
                'Remote code execution vulnerabilities',
                'Broken access controls',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Contact */}
          <div className="p-6 rounded-2xl border border-border bg-muted/20 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-1">Contact Our Security Team</h3>
              <p className="text-sm text-muted-foreground mb-2">For vulnerability reports and security questions:</p>
              <a href="mailto:security@cyberpulse.io" className="text-primary font-medium hover:underline">security@cyberpulse.io</a>
            </div>
          </div>

          <div className="border-t border-border pt-10 mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/privacy" className="text-sm text-primary hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-primary hover:underline">Terms of Service</Link>
            <Link href="/contact" className="text-sm text-primary hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
