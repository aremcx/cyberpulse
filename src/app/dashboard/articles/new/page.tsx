// src/app/dashboard/articles/new/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText, BookOpen, Lightbulb, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Write for CyberPulse | Submit an Article',
  description: "Share your cybersecurity knowledge with Africa's security community. Submit articles, tutorials, research, and threat reports.",
}

const guidelines = [
  { title: 'Original Content', description: 'All submissions must be original work. Properly cite and attribute any sources, data, or tools you reference.' },
  { title: 'Accurate & Verified', description: 'Ensure all technical claims are tested and accurate. Responsible vulnerability disclosure practices must be followed.' },
  { title: 'Practical Value', description: 'Write for practitioners. Include actionable insights, code snippets, commands, or step-by-step walkthroughs where applicable.' },
  { title: 'Clear Structure', description: 'Use clear headings, bullet points, and code blocks. Articles should have a clear introduction, body, and conclusion.' },
]

const types = [
  { icon: FileText, label: 'Tutorial', description: 'Step-by-step technical guide on a security tool, technique, or concept.' },
  { icon: BookOpen, label: 'Research', description: 'Original security research, vulnerability analysis, or threat report.' },
  { icon: Lightbulb, label: 'Opinion', description: 'Commentary on industry trends, policy, or best practices in African cybersecurity.' },
]

export default function NewArticlePage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-black mb-4">Write for <span className="gradient-text">CyberPulse</span></h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Share your knowledge with Africa's cybersecurity community. We publish expert articles, tutorials, research, and threat reports from practitioners across the continent.
            </p>
          </div>

          {/* Content Types */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">What We Publish</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {types.map((type) => {
                const Icon = type.icon
                return (
                  <div key={type.label} className="p-5 rounded-2xl border border-border bg-muted/20 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{type.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{type.description}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Guidelines */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Submission Guidelines</h2>
            <div className="space-y-4">
              {guidelines.map((g) => (
                <div key={g.title} className="flex gap-4 p-4 rounded-xl border border-border bg-muted/10">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">{g.title}</h3>
                    <p className="text-sm text-muted-foreground">{g.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="p-8 rounded-2xl border border-primary/30 bg-primary/5 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Share Your Knowledge?</h3>
            <p className="text-muted-foreground mb-6">
              Sign in or create an account to access the full article editor with rich text, code blocks, image uploads, and SEO tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="px-8 py-4 rounded-xl font-semibold text-primary-foreground transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))' }}
              >
                Sign In to Write
              </Link>
              <Link
                href="/auth/register"
                className="px-8 py-4 rounded-xl font-semibold border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Have questions? <Link href="/contact" className="text-primary hover:underline">Contact our editorial team →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
