import type { CustomizationGroup } from '@/types/portfolio'

interface CustomizationCardProps {
  item: CustomizationGroup
}

export function CustomizationCard({ item }: CustomizationCardProps) {
  return (
    <article className="glass-card customization-card">
      <div className="customization-card__copy">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>

      <ul className="customization-card__list">
        {item.items.map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>
    </article>
  )
}
