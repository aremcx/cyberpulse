// src/app/(public)/security-awareness/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldAlert, Users, BookOpen, CheckCircle, ChevronRight, Mail, Smartphone, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Security Awareness | CyberPulse',
  description: 'Build a security-conscious culture in your organization. Phishing simulations, training programmes, and awareness campaigns for African businesses.',
}

const programs = [
  {
    icon: Mail,
    title: 'Phishing Simulation',
    description: "Test your team's resilience with realistic phishing campaigns. Measure click rates and train at-risk employees.",
    features: ['Custom phishing templates', 'Detailed analytics dashboard', 'Automated training triggers'],
  },
  {
    icon: Smartphone,
    title: 'Mobile Security Training',
    description: 'With mobile usage dominating in Africa, we help teams understand risks from SMS fraud, WhatsApp scams, and mobile malware.',
    features: ['Smishing awareness modules', 'WhatsApp Business security', 'BYOD policy templates'],
  },
  {
    icon: Globe,
    title: 'Compliance & Policy',
    description: 'Align your awareness program with NDPR, CBN guidelines, and industry-specific frameworks.',
    features: ['NDPR compliance checklist', 'Policy template library', 'Board-level presentations'],
  },
  {
    icon: Users,
    title: 'Team Workshops',
    description: 'Live virtual and in-person workshops delivered by experienced practitioners across Nigeria and West Africa.',
    features: ['Interactive workshops', 'Capture-the-flag exercises', 'Certificate of completion'],
  },
]

const stats = [
  { value: '68%', label: 'of African breaches start with phishing' },
  { value: '90%', label: 'reduction in click rates after training' },
  { value: '500+', label: 'organizations trained' },
]

export default function SecurityAwarenessPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-red-500/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
              <ShieldAlert className="w-4 h-4" />
              Security Awareness
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Your People Are Your{' '}
              <span className="text-amber-400">First Line</span>{' '}
              of Defence
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Build a security-first culture in your organization. Our awareness programmes are designed for the African business context — culturally relevant, practical, and measurable.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl font-semibold text-primary-foreground text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30 bg-amber-500"
              >
                Get a Free Assessment
              </Link>
              <Link
                href="/articles?category=security-awareness"
                className="px-8 py-4 rounded-xl font-semibold border border-border hover:border-amber-500/40 hover:bg-amber-500/5 transition-colors"
              >
                Read Free Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-amber-400 mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Awareness Programmes</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tailored programmes that address the unique threat landscape facing African organizations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((prog) => {
              const Icon = prog.icon
              return (
                <div key={prog.title} className="p-6 rounded-2xl border border-border bg-muted/20 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{prog.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{prog.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mt-4">
                    {prog.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Strengthen Your Human Firewall?</h2>
            <p className="text-muted-foreground mb-8">
              Get a free security awareness assessment for your organization. Our team will evaluate your current posture and recommend a customized programme.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-primary-foreground bg-amber-500 hover:scale-105 transition-transform"
            >
              Contact Our Team <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
