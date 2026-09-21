// src/app/(public)/academy/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { GraduationCap, BookOpen, Shield, Award, Clock, ChevronRight, Star, Users, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'CyberPulse Academy | Cybersecurity Courses & Training',
  description: 'Advance your cybersecurity career with expert-led courses, hands-on labs, and industry certifications tailored for African security professionals.',
}

const tracks = [
  {
    icon: Shield,
    title: 'Blue Team Defender',
    description: 'Master SOC operations, SIEM, incident response, and threat hunting. Build the skills to detect and contain real-world attacks.',
    courses: 12,
    hours: 48,
    level: 'Beginner → Advanced',
    color: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    badge: 'Most Popular',
  },
  {
    icon: Lock,
    title: 'Penetration Testing',
    description: 'Learn ethical hacking methodologies, web app testing, network exploitation, and professional report writing.',
    courses: 10,
    hours: 40,
    level: 'Intermediate → Expert',
    color: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    badge: null,
  },
  {
    icon: Award,
    title: 'GRC & Compliance',
    description: 'Navigate NDPR, ISO 27001, NIST, and other frameworks relevant to Nigerian and African enterprises.',
    courses: 8,
    hours: 32,
    level: 'All Levels',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    badge: 'Africa Focus',
  },
  {
    icon: BookOpen,
    title: 'Cloud Security',
    description: 'Secure AWS, Azure and GCP environments. Tackle misconfiguration, IAM, and cloud-native threats.',
    courses: 9,
    hours: 36,
    level: 'Intermediate',
    color: 'from-orange-500/20 to-yellow-500/20',
    border: 'border-orange-500/30',
    badge: null,
  },
]

const stats = [
  { value: '2,400+', label: 'Active Learners' },
  { value: '39+', label: 'Expert Courses' },
  { value: '156+', label: 'Hands-on Labs' },
  { value: '94%', label: 'Completion Rate' },
]

export default function AcademyPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 50%, hsl(var(--primary) / 0.06) 0%, transparent 50%), radial-gradient(circle at 75% 50%, hsl(280 100% 50% / 0.06) 0%, transparent 50%)',
          }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              CyberPulse Academy
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Level Up Your{' '}
              <span className="gradient-text">Cybersecurity</span>{' '}
              Career
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Expert-curated courses, hands-on labs, and career paths designed for African security professionals. From SOC analyst to CISO — we've got the curriculum.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="px-8 py-4 rounded-xl font-semibold text-primary-foreground text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))' }}
              >
                Start Learning Free
              </Link>
              <Link
                href="/vulnerabilities"
                className="px-8 py-4 rounded-xl font-semibold border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Tracks */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Learning Tracks</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Structured learning paths that take you from foundational knowledge to professional mastery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tracks.map((track) => {
              const Icon = track.icon
              return (
                <div
                  key={track.title}
                  className={`relative p-6 rounded-2xl border ${track.border} bg-gradient-to-br ${track.color} backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300 cursor-pointer group`}
                >
                  {track.badge && (
                    <span className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                      {track.badge}
                    </span>
                  )}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{track.title}</h3>
                      <span className="text-xs text-muted-foreground">{track.level}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{track.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {track.courses} courses
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {track.hours}h content
                      </span>
                    </div>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <h2 className="text-3xl font-bold mb-4">Join 2,400+ Security Professionals</h2>
            <p className="text-muted-foreground mb-8">
              Start your free account today. No credit card required. Access 10+ courses instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="px-8 py-4 rounded-xl font-semibold text-primary-foreground transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))' }}
              >
                Create Free Account
              </Link>
              <Link
                href="/articles"
                className="px-8 py-4 rounded-xl font-semibold border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                View Community
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
