import { Icon } from '@/components/ui/Icon'
import type { SocialLink } from '@/types/portfolio'

interface SocialLinksProps {
  items: SocialLink[]
  label: string
}

export function SocialLinks({ items, label }: SocialLinksProps) {
  return (
    <div aria-label={label} className="social-links" role="list">
      {items.map((item) => (
        <a
          aria-label={item.label}
          className="social-link"
          href={item.href}
          key={item.label}
          rel="noreferrer"
          role="listitem"
          target="_blank"
        >
          <Icon className="social-link__icon" name={item.icon} />
          <span className="sr-only">{item.label}</span>
        </a>
      ))}
    </div>
  )
}
