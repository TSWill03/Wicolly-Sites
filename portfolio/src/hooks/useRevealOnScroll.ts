import { useEffect, useRef, useState } from 'react'

function shouldRevealImmediately() {
  if (typeof window === 'undefined') {
    return true
  }

  const prefersReducedMotion =
    'matchMedia' in window && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return prefersReducedMotion || !('IntersectionObserver' in window)
}

export function useRevealOnScroll(threshold = 0.18) {
  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(() => shouldRevealImmediately())

  useEffect(() => {
    const node = ref.current

    if (!node || isVisible) {
      return
    }

    if (shouldRevealImmediately()) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(node)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [isVisible, threshold])

  return { ref, isVisible }
}
