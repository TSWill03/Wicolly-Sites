import type { ReactNode } from 'react'

type BadgeTone = 'neutral' | 'primary' | 'secondary' | 'success' | 'warning'

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}
