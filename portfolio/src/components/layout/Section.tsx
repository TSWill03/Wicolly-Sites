import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  className?: string
  children: ReactNode
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section className={['section', className].filter(Boolean).join(' ')} id={id}>
      <div className="container">{children}</div>
    </section>
  )
}
