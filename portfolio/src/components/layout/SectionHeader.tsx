import { Reveal } from '@/components/ui/Reveal'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  description: string
  centered?: boolean
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeaderProps) {
  return (
    <Reveal className={centered ? 'section-heading section-heading--centered' : 'section-heading'}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      <p className="section-description">{description}</p>
    </Reveal>
  )
}
