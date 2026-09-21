// src/components/layout/Footer.tsx
import Link from 'next/link'
import {
  Shield, X, GitBranch, Rss, Mail
} from 'lucide-react'

const footerLinks = {
  Platform: [
    { label: 'Articles', href: '/articles' },
    { label: 'News', href: '/news' },
    { label: 'Tutorials', href: '/tutorials' },
    { label: 'Research', href: '/research' },
    { label: 'Academy', href: '/academy' },
  ],
  Intelligence: [
    { label: 'Threat Intelligence', href: '/threat-intelligence' },
    { label: 'Vulnerabilities', href: '/vulnerabilities' },
    { label: 'Tools Directory', href: '/tools' },
    { label: 'Security Awareness', href: '/security-awareness' },
    { label: 'Africa Cyber', href: '/africa' },
  ],
  Community: [
    { label: 'Jobs', href: '/jobs' },
    { label: 'Events', href: '/events' },
    { label: 'Community', href: '/community' },
    { label: 'Newsletter', href: '/#newsletter' },
    { label: 'Write for Us', href: '/dashboard/articles/new' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Security', href: '/security' },
    { label: 'RSS Feed', href: '/feed.xml' },
  ],
}

const socialLinks = [
  { icon: X, href: '#', label: 'X (Twitter)' },
  { icon: GitBranch, href: '#', label: 'GitHub' },
  { icon: Rss, href: '/feed.xml', label: 'RSS Feed' },
  { icon: Mail, href: 'mailto:hello@cyberpulse.io', label: 'Email' },
]


const categories = [
  'Fundamentals', 'Blue Team', 'Red Team', 'SOC', 'DFIR',
  'Malware', 'Cloud Security', 'Web Security', 'AI Security', 'GRC',
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">
                <span className="gradient-text">Cyber</span>
                <span className="text-foreground">Pulse</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Your trusted cybersecurity knowledge, intelligence and learning platform.
              Serving Africa and beyond.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-sm text-foreground mb-4">{section}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="border-t border-border pt-8 mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Explore Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/articles?category=${cat.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-3 py-1 text-xs font-medium rounded-full border border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CyberPulse. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </span>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/security" className="hover:text-primary transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
