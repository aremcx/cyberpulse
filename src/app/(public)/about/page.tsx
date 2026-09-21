// src/app/(public)/about/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Users, Globe, Zap, ChevronRight, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About CyberPulse | Africa\'s Premier Cybersecurity Platform',
  description: 'Learn about CyberPulse — our mission, team, and commitment to strengthening cybersecurity across Africa and the diaspora.',
}

const values = [
  { icon: Shield, title: 'Defence First', description: 'We exist to make Africa more secure. Every article, tool, and course is chosen with the defender in mind.' },
  { icon: Globe, title: 'Africa Focused', description: 'Built in Nigeria, designed for the continent. We understand the unique threat landscape, regulatory environment, and talent challenges African security teams face.' },
  { icon: Users, title: 'Community Driven', description: 'Our best content comes from our community. We amplify practitioner voices and create space for knowledge sharing.' },
  { icon: Zap, title: 'Actionable Intelligence', description: 'No fluff. Every vulnerability advisory, threat report, and tutorial is written to be immediately useful to practitioners.' },
]

const team = [
  { name: 'Chidi Okonkwo', role: 'Founder & Editor-in-Chief', bio: 'Former SOC Lead with 12 years in financial services security across Nigeria and the UK.', initials: 'CO' },
  { name: 'Amara Eze', role: 'Head of Research', bio: 'Malware analyst and threat intelligence specialist. Previously at Symantec and Kaspersky Labs.', initials: 'AE' },
  { name: 'Bola Adeyemi', role: 'Community Lead', bio: 'Cybersecurity educator and CTF organizer. Runs the largest cybersecurity meetup in Lagos.', initials: 'BA' },
  { name: 'Nkechi Obi', role: 'Head of Academy', bio: 'Curriculum designer and trainer. Certified instructor with SANS, (ISC)², and EC-Council.', initials: 'NO' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              About CyberPulse
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              Built for Africa's{' '}
              <span className="gradient-text">Cyber Defenders</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              CyberPulse is Africa's premier cybersecurity knowledge platform — delivering threat intelligence, expert tutorials, vulnerability tracking, and career resources to security professionals across the continent and diaspora.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 border-y border-border bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              We believe that a more secure Africa is possible — but it requires investing in local talent, building indigenous security capabilities, and creating spaces where African practitioners can learn, share, and grow together. CyberPulse is that space.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((val) => {
              const Icon = val.icon
              return (
                <div key={val.title} className="p-6 rounded-2xl border border-border bg-muted/20 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{val.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{val.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 border-t border-border bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Team</h2>
            <p className="text-muted-foreground">Practitioners who've been in the trenches — and now build for those who are.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="p-6 rounded-2xl border border-border bg-background text-center hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {member.initials}
                </div>
                <h3 className="font-bold mb-1">{member.name}</h3>
                <p className="text-xs text-primary font-medium mb-3">{member.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Want to contribute, partner, or just say hello? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))' }}
            >
              <Mail className="w-4 h-4" /> Contact Us
            </Link>
            <Link
              href="/dashboard/articles/new"
              className="px-8 py-4 rounded-xl font-semibold border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors flex items-center gap-2"
            >
              Write for Us <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
