import type { CSSProperties, ElementType, ReactNode } from 'react'

import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'

interface RevealProps {
  children: ReactNode
  className?: string
  as?: ElementType
  delay?: number
}

export function Reveal({
  children,
  className,
  as: Component = 'div',
  delay = 0,
}: RevealProps) {
  const { ref, isVisible } = useRevealOnScroll()

  const style = {
    '--reveal-delay': `${delay}ms`,
  } as CSSProperties

  return (
    <Component
      className={['reveal', isVisible ? 'is-visible' : '', className].filter(Boolean).join(' ')}
      ref={ref}
      style={style}
    >
      {children}
    </Component>
  )
}
