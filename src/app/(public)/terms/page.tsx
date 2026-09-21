// src/app/(public)/terms/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | CyberPulse',
  description: 'CyberPulse terms of service — rules and guidelines for using our platform.',
}

const lastUpdated = '1 September 2026'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using CyberPulse, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform. We reserve the right to update these terms at any time, with notice provided through the platform.',
  },
  {
    title: '2. User Accounts',
    content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials. You must immediately notify us of any unauthorized access to your account. One person may not maintain more than one active account.',
  },
  {
    title: '3. Content Guidelines',
    content: `Users may submit articles, comments, and other content subject to the following rules:

• Content must be original or properly attributed
• No plagiarism, disinformation, or fabricated security research
• No offensive, hateful, or discriminatory content
• No unsolicited promotion or spam
• No content that facilitates illegal activities
• Vulnerability disclosures must follow responsible disclosure practices

We reserve the right to remove content that violates these guidelines without notice.`,
  },
  {
    title: '4. Intellectual Property',
    content: 'Content you create on CyberPulse remains yours. By publishing on CyberPulse, you grant us a non-exclusive, royalty-free licence to display, distribute, and promote your content on the platform and associated channels (newsletter, social media). The CyberPulse name, logo, and platform design are our intellectual property.',
  },
  {
    title: '5. Prohibited Conduct',
    content: `You agree not to:

• Attempt to gain unauthorized access to the platform or other users' accounts
• Use the platform to distribute malware or conduct cyberattacks
• Scrape, crawl, or automate interactions with the platform without written permission
• Misrepresent your identity or credentials
• Use the platform for commercial solicitation without our consent
• Circumvent security features or platform rate limits`,
  },
  {
    title: '6. Disclaimer of Warranties',
    content: 'The CyberPulse platform is provided "as is" without warranties of any kind. Security information on this platform is for educational purposes. We do not guarantee the accuracy, completeness, or timeliness of any security intelligence or vulnerability information. Always verify information independently before acting on it in a production environment.',
  },
  {
    title: '7. Limitation of Liability',
    content: 'To the fullest extent permitted by Nigerian law, CyberPulse shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including any security decisions made based on content published here.',
  },
  {
    title: '8. Governing Law',
    content: 'These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.',
  },
  {
    title: '9. Contact',
    content: 'For questions about these Terms, contact us at legal@cyberpulse.io or visit our Contact page.',
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-black mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-muted/20 mb-10 text-sm text-muted-foreground leading-relaxed">
            Please read these Terms of Service carefully before using the CyberPulse platform. These terms constitute a legal agreement between you and CyberPulse.
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                <div className="text-muted-foreground leading-relaxed text-sm">
                  {section.content.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('•') ? 'ml-4 mb-1' : 'mb-2'}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-10 mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/privacy" className="text-sm text-primary hover:underline">Privacy Policy</Link>
            <Link href="/security" className="text-sm text-primary hover:underline">Security Policy</Link>
            <Link href="/contact" className="text-sm text-primary hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
