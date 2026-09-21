// src/app/(public)/africa/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Globe, Shield, TrendingUp, Users, Radio, BookOpen, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Africa Cybersecurity Hub | CyberPulse',
  description: 'Dedicated cybersecurity intelligence, research, policy analysis, and community resources for the African continent.',
}

const features = [
  {
    icon: Radio,
    title: 'African Threat Landscape',
    description: 'Tracking cybercriminal groups, state-sponsored actors, and emerging threats specifically targeting African nations, banks, telecoms, and critical infrastructure.',
    href: '/threat-intelligence',
  },
  {
    icon: Shield,
    title: 'NDPR & Regulatory Watch',
    description: 'Nigeria Data Protection Regulation updates, NITDA guidance, and country-by-country policy tracker for East, West, and Southern Africa.',
    href: '/articles?category=compliance',
  },
  {
    icon: TrendingUp,
    title: 'Fintech & Banking Security',
    description: "Nigeria's fintech boom has made financial institutions prime targets. We cover BVN fraud, mobile money attacks, USSD interception, and more.",
    href: '/vulnerabilities',
  },
  {
    icon: Users,
    title: 'African Security Community',
    description: 'Connect with security professionals across Lagos, Nairobi, Accra, Johannesburg, and beyond. Share knowledge, find mentors, and build your network.',
    href: '/community',
  },
  {
    icon: BookOpen,
    title: 'Local CTFs & Training',
    description: 'Upcoming capture-the-flag competitions, workshops, and bootcamps happening across the continent — both virtual and in-person.',
    href: '/events',
  },
  {
    icon: Globe,
    title: 'Country Profiles',
    description: "In-depth cybersecurity assessments of Nigeria, Kenya, Ghana, South Africa, Egypt, and other major African digital economies.",
    href: '/articles?category=africa',
  },
]

const countries = [
  { name: 'Nigeria', flag: '🇳🇬', articles: 47 },
  { name: 'Kenya', flag: '🇰🇪', articles: 23 },
  { name: 'Ghana', flag: '🇬🇭', articles: 18 },
  { name: 'South Africa', flag: '🇿🇦', articles: 31 },
  { name: 'Egypt', flag: '🇪🇬', articles: 15 },
  { name: 'Ethiopia', flag: '🇪🇹', articles: 9 },
  { name: 'Tanzania', flag: '🇹🇿', articles: 7 },
  { name: 'Rwanda', flag: '🇷🇼', articles: 11 },
]

export default function AfricaPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10" />
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-5"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 800 800\'%3E%3Ctext x=\'50%25\' y=\'50%25\' font-size=\'400\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3E🌍%3C/text%3E%3C/svg%3E")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              Africa Cybersecurity Hub
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Securing Africa's{' '}
              <span className="text-emerald-400">Digital Future</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              The continent's most comprehensive cybersecurity resource for African defenders, researchers, and policy makers. Built in Nigeria. Serving the continent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/articles?category=africa"
                className="px-8 py-4 rounded-xl font-semibold text-primary-foreground text-lg transition-all duration-300 hover:scale-105 bg-emerald-600 hover:bg-emerald-500"
              >
                Explore Africa Coverage
              </Link>
              <Link
                href="/community"
                className="px-8 py-4 rounded-xl font-semibold border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              >
                Join the Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Cover</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Dedicated intelligence, research, and community resources for every corner of Africa's cyber ecosystem.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon
              return (
                <Link
                  key={feat.title}
                  href={feat.href}
                  className="p-6 rounded-2xl border border-border bg-muted/20 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{feat.description}</p>
                  <span className="text-emerald-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <ChevronRight className="w-4 h-4" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Country Coverage */}
      <section className="py-20 border-t border-border bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Country Coverage</h2>
            <p className="text-muted-foreground">Cybersecurity intelligence tailored to major African digital economies</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {countries.map((country) => (
              <Link
                key={country.name}
                href={`/articles?q=${country.name.toLowerCase()}`}
                className="p-4 rounded-xl border border-border bg-background hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 text-center group"
              >
                <div className="text-3xl mb-2">{country.flag}</div>
                <div className="font-semibold text-sm">{country.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{country.articles} articles</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
