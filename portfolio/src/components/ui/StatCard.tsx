import type { MetricItem } from '@/types/portfolio'

interface StatCardProps {
  item: MetricItem
}

export function StatCard({ item }: StatCardProps) {
  return (
    <article className="glass-card stat-card">
      <strong className="stat-card__value">{item.value}</strong>
      <p className="stat-card__label">{item.label}</p>
      <span className="stat-card__detail">{item.detail}</span>
    </article>
  )
}
