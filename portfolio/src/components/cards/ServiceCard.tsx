import { Icon } from '@/components/ui/Icon'
import type { ServiceOffering } from '@/types/portfolio'

interface ServiceCardProps {
  item: ServiceOffering
}

export function ServiceCard({ item }: ServiceCardProps) {
  return (
    <article className="glass-card service-card">
      <div className="service-card__icon">
        <Icon className="service-card__icon-glyph" name={item.icon} />
      </div>

      <div className="service-card__copy">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>

      <ul className="service-card__features">
        {item.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </article>
  )
}
