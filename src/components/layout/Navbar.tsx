'use client'
// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import {
  Shield, Search, Bell, Sun, Moon, Menu, X, ChevronDown,
  User, LayoutDashboard, Settings, LogOut, BookOpen,
  Zap, Radio, Bug, Wrench, GraduationCap, Briefcase,
  Calendar, Users, ShieldAlert, Globe
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'

const navItems = [
  { href: '/articles', label: 'Articles' },
  { href: '/news', label: 'News' },
  { href: '/tutorials', label: 'Tutorials' },
  {
    label: 'Intelligence',
    children: [
      { href: '/threat-intelligence', label: 'Threat Intelligence', icon: Radio },
      { href: '/vulnerabilities', label: 'Vulnerabilities', icon: Bug },
      { href: '/research', label: 'Research', icon: BookOpen },
    ],
  },
  {
    label: 'Resources',
    children: [
      { href: '/tools', label: 'Tools', icon: Wrench },
      { href: '/academy', label: 'Academy', icon: GraduationCap },
      { href: '/security-awareness', label: 'Security Awareness', icon: ShieldAlert },
      { href: '/africa', label: 'Africa Cyber', icon: Globe },
    ],
  },
  {
    label: 'Community',
    children: [
      { href: '/jobs', label: 'Jobs', icon: Briefcase },
      { href: '/events', label: 'Events', icon: Calendar },
      { href: '/community', label: 'Community', icon: Users },
    ],
  },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isDark = (resolvedTheme || theme) === 'dark'
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  const user = session?.user

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass-dark border-b border-border/50 shadow-xl'
            : 'bg-transparent'
        )}
      >
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative">
              <Shield className="w-7 h-7 text-primary group-hover:animate-pulse-cyber transition-all" />
              <div className="absolute inset-0 w-7 h-7 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="gradient-text">Cyber</span>
              <span className="text-foreground">Pulse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              if ('children' in item) {
                return (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          'w-3.5 h-3.5 transition-transform',
                          openDropdown === item.label && 'rotate-180'
                        )}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-1 w-52 glass-dark border border-border rounded-xl shadow-2xl py-1 animate-fade-in">
                        {item.children?.map((child) => {
                          const Icon = child.icon
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                            >
                              <Icon className="w-4 h-4 text-primary" />
                              {child.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Search"
              id="navbar-search-btn"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label={mounted ? (isDark ? 'Switch to light theme' : 'Switch to dark theme') : 'Toggle theme'}
              title={mounted ? (isDark ? 'Switch to light theme' : 'Switch to dark theme') : 'Toggle theme'}
              id="theme-toggle"
            >
              {mounted ? (
                isDark ? (
                  <Sun className="w-4.5 h-4.5 text-cyber-orange transition-transform hover:rotate-45" />
                ) : (
                  <Moon className="w-4.5 h-4.5 text-primary transition-transform hover:-rotate-12" />
                )
              ) : (
                <div className="w-4.5 h-4.5" />
              )}
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <button
                  className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  aria-label="Notifications"
                  id="notifications-btn"
                >
                  <Bell className="w-4.5 h-4.5" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'user' ? null : 'user')}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/60 transition-colors"
                    aria-label="User menu"
                    id="user-menu-btn"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name ?? 'User'}
                        className="w-7 h-7 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary">
                        {getInitials(user.name ?? user.email ?? 'U')}
                      </div>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                  </button>

                  {openDropdown === 'user' && (
                    <div className="absolute right-0 top-full mt-1 w-52 glass-dark border border-border rounded-xl shadow-2xl py-1 animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-border">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      {['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user.role) && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors border-t border-border mt-1"
                        id="signout-btn"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="hidden sm:block px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  id="login-link"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cyber-glow"
                  id="register-link"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              id="mobile-menu-btn"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden glass-dark border-t border-border animate-fade-in">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => {
                if ('children' in item) {
                  return (
                    <div key={item.label}>
                      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {item.label}
                      </p>
                      {item.children?.map((child) => {
                        const Icon = child.icon
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                          >
                            <Icon className="w-4 h-4 text-primary" />
                            {child.label}
                          </Link>
                        )
                      })}
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
              {!user && (
                <div className="pt-2 mt-2 border-t border-border flex gap-2">
                  <Link href="/auth/login" className="flex-1 text-center px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted/60">
                    Login
                  </Link>
                  <Link href="/auth/register" className="flex-1 text-center px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Click outside to close dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <div className="w-full max-w-2xl glass-dark border border-border rounded-2xl shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                autoFocus
                type="search"
                placeholder="Search articles, tutorials, CVEs, tools..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                id="global-search-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value.trim()
                    if (val) {
                      window.location.href = `/search?q=${encodeURIComponent(val)}`
                    }
                  }
                  if (e.key === 'Escape') setSearchOpen(false)
                }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground">
                Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">Enter</kbd> to search,{' '}
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
