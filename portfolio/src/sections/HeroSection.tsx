import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { StatCard } from '@/components/ui/StatCard'
import type { HeroData } from '@/types/portfolio'
import { resolveContentUrl } from '@/utils/resolveContentUrl'

interface HeroSectionProps {
  data: HeroData
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="section section--hero" id="hero">
      <div className="container hero">
        <div className="hero__content">
          <Reveal>
            <span className="eyebrow">{data.eyebrow}</span>
          </Reveal>

          <Reveal className="hero__identity" delay={80}>
            <div className="hero__nameplate">
              <span className="hero__name">{data.name}</span>
              <Badge tone="secondary">{data.availability}</Badge>
            </div>
            <p className="hero__role">{data.role}</p>
          </Reveal>

          <Reveal delay={140}>
            <h1 className="hero__title">{data.title}</h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="hero__description">{data.description}</p>
          </Reveal>

          <Reveal delay={260}>
            <p className="hero__subtitle">{data.subtitle}</p>
          </Reveal>

          <Reveal className="hero__actions" delay={320}>
            {data.actions.map((action) => (
              <Button
                href={action.href}
                icon={action.icon}
                key={action.label}
                variant={action.variant}
              >
                {action.label}
              </Button>
            ))}
          </Reveal>

          <Reveal className="tag-list" delay={380}>
            {data.badges.map((badge) => (
              <span className="tag" key={badge}>
                {badge}
              </span>
            ))}
          </Reveal>

          <Reveal delay={440}>
            <SocialLinks items={data.socialLinks} label="Redes sociais da hero section" />
          </Reveal>

          <div className="hero__stats">
            {data.metrics.map((item, index) => (
              <Reveal delay={500 + index * 80} key={item.label}>
                <StatCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="hero__visual">
          <Reveal className="glass-card hero__art" delay={180}>
            <img alt={data.image.alt} src={resolveContentUrl(data.image.src)} />
          </Reveal>

          <Reveal className="glass-card hero__feature" delay={320}>
            <span className="eyebrow">Produto editavel</span>
            <h2>{data.feature.title}</h2>
            <p>{data.feature.description}</p>

            <ul className="hero__feature-list">
              {data.feature.items.map((item) => (
                <li key={item}>
                  <span className="hero__feature-dot" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
