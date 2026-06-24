import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'
import type { RoadmapData } from '@/types/portfolio'

interface RoadmapSectionProps {
  data: RoadmapData
}

export function RoadmapSection({ data }: RoadmapSectionProps) {
  return (
    <Section id="roadmap">
      <SectionHeader
        description={data.description}
        eyebrow={data.eyebrow}
        title={data.title}
      />

      <div className="roadmap-list">
        {data.items.map((item, index) => (
          <Reveal className="glass-card roadmap-card" delay={index * 100} key={item.title}>
            <div className="roadmap-card__phase">{item.phase}</div>

            <div className="roadmap-card__content">
              <div className="roadmap-card__header">
                <h3>{item.title}</h3>
                <Badge tone="secondary">{item.status}</Badge>
              </div>

              <p>{item.description}</p>

              <div className="tag-list">
                {item.outcomes.map((outcome) => (
                  <span className="tag" key={outcome}>
                    {outcome}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
