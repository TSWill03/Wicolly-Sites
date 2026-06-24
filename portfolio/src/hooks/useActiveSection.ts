import { useEffect, useMemo, useRef, useState } from 'react'

function sortEntriesByPriority(entries: IntersectionObserverEntry[]) {
  return [...entries].sort((left, right) => {
    if (right.intersectionRatio !== left.intersectionRatio) {
      return right.intersectionRatio - left.intersectionRatio
    }

    return left.boundingClientRect.top - right.boundingClientRect.top
  })
}

export function useActiveSection(sectionIds: string[]) {
  const validIds = useMemo(() => sectionIds.filter(Boolean), [sectionIds])
  const entriesRef = useRef<Record<string, IntersectionObserverEntry>>({})
  const [activeSection, setActiveSection] = useState(validIds[0] ?? '')

  useEffect(() => {
    if (!validIds.length) {
      return
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return
    }

    const sections = validIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement)

    if (!sections.length) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entriesRef.current[entry.target.id] = entry
        })

        const visibleEntries = sortEntriesByPriority(
          Object.values(entriesRef.current).filter((entry) => entry.isIntersecting),
        )

        if (visibleEntries[0]) {
          setActiveSection(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: '-18% 0px -58% 0px',
        threshold: [0.2, 0.35, 0.55, 0.75],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      entriesRef.current = {}
      observer.disconnect()
    }
  }, [validIds])

  return activeSection
}
