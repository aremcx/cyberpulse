// src/app/(public)/community/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, MessageSquare, Calendar, Award, Zap, BookOpen, ChevronRight, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Community | CyberPulse',
  description: "Join Africa's fastest-growing cybersecurity community. Discuss, learn, and grow with security professionals across the continent.",
}

const channels = [
  { name: '#general', description: 'General cybersecurity discussions', members: 1240 },
  { name: '#threat-intel', description: 'Share IOCs, TTPs, and threat reports', members: 876 },
  { name: '#ctf-challenges', description: 'CTF writeups and challenge discussions', members: 654 },
  { name: '#job-board', description: 'Security job postings and career advice', members: 983 },
  { name: '#nigeria-sec', description: 'Nigerian cybersecurity news and events', members: 1102 },
  { name: '#tools-tooling', description: 'Tool reviews, scripts, and automation', members: 423 },
]

const perks = [
  { icon: MessageSquare, title: 'Active Forums', description: 'Engage in discussions across 20+ specialized channels covering everything from malware analysis to cloud security.' },
  { icon: Calendar, title: 'Events & Meetups', description: 'Get early access to webinars, CTFs, and in-person meetups hosted by our community across Nigeria and Africa.' },
  { icon: Award, title: 'Recognition System', description: 'Earn badges and points for contributing quality content, helping others, and participating in challenges.' },
  { icon: BookOpen, title: 'Learning Resources', description: 'Community-curated study guides, cheat sheets, and certification roadmaps freely shared by experienced practitioners.' },
  { icon: Zap, title: 'Job Connections', description: 'Our members have landed roles at major banks, telecoms, government agencies, and global tech companies.' },
  { icon: Shield, title: 'Mentorship', description: "Get paired with senior security professionals who have walked the path you're on. Mentors available for free." },
]

export default function CommunityPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Community
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Defend Together,{' '}
              <span className="gradient-text">Grow Together</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join 5,000+ cybersecurity professionals across Africa and the diaspora. Share knowledge, build skills, and accelerate your career.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="px-8 py-4 rounded-xl font-semibold text-primary-foreground text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))' }}
              >
                Join for Free
              </Link>
              <Link
                href="/events"
                className="px-8 py-4 rounded-xl font-semibold border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                View Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Join Our Community?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're more than a forum — we're a professional network built by defenders, for defenders.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk) => {
              const Icon = perk.icon
              return (
                <div key={perk.title} className="p-6 rounded-2xl border border-border bg-muted/20 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{perk.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{perk.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Discord/Forum Channels */}
      <section className="py-20 border-t border-border bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Active Channels</h2>
            <p className="text-muted-foreground">Where the conversations happen</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {channels.map((channel) => (
              <div
                key={channel.name}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-primary text-sm">{channel.name}</span>
                  <span className="text-sm text-muted-foreground">{channel.description}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {channel.members.toLocaleString()}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-primary-foreground transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))' }}
            >
              Join the Community <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
