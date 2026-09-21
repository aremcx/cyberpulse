// src/components/ui/Badge.tsx
import { cn } from '@/lib/utils'
import { VulnerabilitySeverity, DifficultyLevel, ContentType } from '@prisma/client'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'cyber'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variant === 'default' && 'bg-primary/10 text-primary border border-primary/20',
        variant === 'secondary' && 'bg-muted text-muted-foreground border border-border',
        variant === 'outline' && 'border border-border text-foreground',
        variant === 'destructive' && 'bg-destructive/10 text-destructive border border-destructive/20',
        variant === 'cyber' && 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono',
        className
      )}
    >
      {children}
    </span>
  )
}

const severityConfig: Record<VulnerabilitySeverity, { label: string; className: string }> = {
  CRITICAL: { label: 'Critical', className: 'severity-critical border' },
  HIGH: { label: 'High', className: 'severity-high border' },
  MEDIUM: { label: 'Medium', className: 'severity-medium border' },
  LOW: { label: 'Low', className: 'severity-low border' },
  INFORMATIONAL: { label: 'Info', className: 'severity-info border' },
}

export function SeverityBadge({
  severity,
  className,
}: {
  severity: VulnerabilitySeverity
  className?: string
}) {
  const config = severityConfig[severity]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}

const difficultyConfig: Record<DifficultyLevel, { label: string; className: string }> = {
  BEGINNER: { label: 'Beginner', className: 'difficulty-beginner' },
  INTERMEDIATE: { label: 'Intermediate', className: 'difficulty-intermediate' },
  ADVANCED: { label: 'Advanced', className: 'difficulty-advanced' },
  EXPERT: { label: 'Expert', className: 'difficulty-expert' },
}

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: DifficultyLevel
  className?: string
}) {
  const config = difficultyConfig[difficulty]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}

const contentTypeLabels: Partial<Record<ContentType, string>> = {
  ARTICLE: 'Article',
  TUTORIAL: 'Tutorial',
  NEWS: 'News',
  RESEARCH: 'Research',
  THREAT_REPORT: 'Threat Report',
  CASE_STUDY: 'Case Study',
  TOOL_REVIEW: 'Tool Review',
  INTERVIEW: 'Interview',
  CAREER: 'Career',
  SECURITY_AWARENESS: 'Awareness',
  OPINION: 'Opinion',
}

const contentTypeColors: Partial<Record<ContentType, string>> = {
  NEWS: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  TUTORIAL: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  RESEARCH: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  THREAT_REPORT: 'bg-red-500/10 text-red-400 border-red-500/20',
  CASE_STUDY: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  TOOL_REVIEW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  INTERVIEW: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  CAREER: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  SECURITY_AWARENESS: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  OPINION: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
}

export function ContentTypeBadge({
  type,
  className,
}: {
  type: ContentType
  className?: string
}) {
  const label = contentTypeLabels[type] ?? type
  const colorClass = contentTypeColors[type] ?? 'bg-primary/10 text-primary border-primary/20'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border',
        colorClass,
        className
      )}
    >
      {label}
    </span>
  )
}
