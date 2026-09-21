// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { Toaster } from '@/components/ui/Toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://cyberpulse.io'),
  title: {
    default: 'CyberPulse — Cybersecurity Knowledge & Intelligence Platform',
    template: '%s | CyberPulse',
  },
  description:
    'Your trusted source for cybersecurity news, threat intelligence, tutorials, vulnerabilities, and career resources. Serving Africa and beyond.',
  keywords: [
    'cybersecurity', 'threat intelligence', 'CVE', 'malware', 'penetration testing',
    'SOC analyst', 'security awareness', 'Nigeria cybersecurity', 'Africa cybersecurity',
    'DFIR', 'incident response', 'blue team', 'red team',
  ],
  authors: [{ name: 'CyberPulse', url: 'https://cyberpulse.io' }],
  creator: 'CyberPulse',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cyberpulse.io',
    siteName: 'CyberPulse',
    title: 'CyberPulse — Cybersecurity Knowledge & Intelligence Platform',
    description:
      'Your trusted source for cybersecurity news, threat intelligence, tutorials, and career resources.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CyberPulse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CyberPulse — Cybersecurity Knowledge & Intelligence Platform',
    description:
      'Your trusted source for cybersecurity news, threat intelligence, tutorials, and career resources.',
    images: ['/og-image.png'],
    creator: '@cyberpulse_io',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
