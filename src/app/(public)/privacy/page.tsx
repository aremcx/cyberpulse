// src/app/(public)/privacy/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | CyberPulse',
  description: 'CyberPulse privacy policy — how we collect, use, and protect your data.',
}

const lastUpdated = '1 September 2026'

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us when you register an account, create or submit articles, post comments, subscribe to our newsletter, or contact us. This includes:
    
• **Account Data**: Name, email address, username, password (hashed), and profile information.
• **Content Data**: Articles, comments, and other content you submit to the platform.
• **Usage Data**: Pages visited, articles read, search queries, and interaction data used to improve the platform.
• **Device Data**: IP address, browser type, operating system, and device identifiers collected automatically.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

• Provide, maintain, and improve the CyberPulse platform
• Send you security alerts, newsletter updates, and platform notifications (with your consent)
• Personalize your content feed and recommendations
• Detect and prevent fraud, abuse, and security threats
• Comply with applicable laws, including Nigeria's NDPR
• Communicate with you about your account and our services`,
  },
  {
    title: '3. Data Sharing and Disclosure',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with:

• **Service Providers**: Trusted partners who assist in operating the platform (hosting, email delivery, analytics), bound by data processing agreements.
• **Legal Requirements**: When required by Nigerian law, court order, or governmental authority.
• **Safety**: To protect the rights, safety, and security of our users, platform, or the public.
• **Business Transfers**: In connection with a merger, acquisition, or sale of assets, with appropriate notice to users.`,
  },
  {
    title: '4. Data Retention',
    content: `We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us at privacy@cyberpulse.io. We will comply within 30 days, subject to legal obligations.`,
  },
  {
    title: '5. Your Rights (NDPR & GDPR)',
    content: `Under the Nigeria Data Protection Regulation (NDPR) and applicable data protection laws, you have the right to:

• **Access**: Request a copy of the personal data we hold about you.
• **Rectification**: Correct inaccurate or incomplete personal data.
• **Erasure**: Request deletion of your personal data ("right to be forgotten").
• **Portability**: Receive your data in a structured, machine-readable format.
• **Objection**: Object to processing of your data for marketing purposes.
• **Withdraw Consent**: Withdraw consent at any time where processing is based on consent.

To exercise these rights, contact us at privacy@cyberpulse.io.`,
  },
  {
    title: '6. Cookies and Tracking',
    content: `We use essential cookies to operate the platform (authentication, preferences) and analytics cookies to understand how users interact with our content. You can control cookie preferences through your browser settings. We do not use third-party advertising cookies.`,
  },
  {
    title: '7. Security',
    content: `We implement industry-standard security measures including encryption in transit (TLS), hashed passwords (bcrypt), and regular security assessments. However, no method of transmission over the internet is 100% secure. We encourage users to use strong, unique passwords and enable two-factor authentication.`,
  },
  {
    title: '8. Contact',
    content: `For privacy-related enquiries or to exercise your rights, contact our Data Protection Officer at:

**Email**: privacy@cyberpulse.io  
**Address**: CyberPulse, Lagos, Nigeria`,
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>

          <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5 mb-10">
            <p className="text-sm leading-relaxed">
              CyberPulse is committed to protecting your privacy and handling your data in accordance with Nigeria's Data Protection Regulation (NDPR) and applicable international data protection laws. This policy explains what data we collect, why we collect it, and how you can control it.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold mb-4">{section.title}</h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm prose-sm">
                  {section.content.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('•') ? 'ml-4 mb-1' : 'mb-2'}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-10 mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/terms" className="text-sm text-primary hover:underline">Terms of Service</Link>
            <Link href="/security" className="text-sm text-primary hover:underline">Security Policy</Link>
            <Link href="/contact" className="text-sm text-primary hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
