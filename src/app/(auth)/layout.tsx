// src/app/(auth)/layout.tsx
import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background cyber-grid relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-600/5" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="font-bold text-2xl">
              <span className="gradient-text">Cyber</span>
              <span className="text-foreground">Pulse</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-dark border border-border rounded-2xl p-8 shadow-2xl animate-fade-in">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By using CyberPulse, you agree to our{' '}
          <Link href="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
