// src/app/(public)/contact/page.tsx
'use client'
import { useState } from 'react'
import type { Metadata } from 'next'
import { Mail, MapPin, Clock, Send, CheckCircle, MessageSquare } from 'lucide-react'

const contacts = [
  { icon: Mail, label: 'Email', value: 'hello@cyberpulse.io', href: 'mailto:hello@cyberpulse.io' },
  { icon: MapPin, label: 'Location', value: 'Lagos, Nigeria 🇳🇬', href: null },
  { icon: Clock, label: 'Response Time', value: 'Within 24 hours', href: null },
]

const topics = [
  'General Enquiry',
  'Content Submission / Write for Us',
  'Partnership or Sponsorship',
  'Security Awareness Training',
  'Advertising',
  'Technical Issue / Bug Report',
  'Media & Press',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            Contact Us
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Let's <span className="gradient-text">Connect</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Whether you have a story tip, partnership idea, or just want to say hello — we're here.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            {contacts.map((c) => {
              const Icon = c.icon
              return (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="font-semibold hover:text-primary transition-colors">{c.value}</a>
                    ) : (
                      <p className="font-semibold">{c.value}</p>
                    )}
                  </div>
                </div>
              )
            })}

            <div className="p-6 rounded-2xl border border-border bg-muted/20 mt-8">
              <h3 className="font-bold mb-2">Content Submissions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Are you a security practitioner with something to share? We welcome original articles, tutorials, research, and opinion pieces from the community.
              </p>
              <p className="text-sm text-muted-foreground">
                Read our <a href="/dashboard/articles/new" className="text-primary hover:underline">submission guidelines →</a>
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                <CheckCircle className="w-16 h-16 text-emerald-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">
                  Thanks for reaching out, {form.name}. We'll get back to you at {form.email} within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="contact-name">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="contact-email">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="contact-topic">Topic</label>
                  <select
                    id="contact-topic"
                    required
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Select a topic...</option>
                    {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))' }}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
