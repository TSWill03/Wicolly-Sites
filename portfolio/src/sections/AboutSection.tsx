import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import type { AboutData } from '@/types/portfolio'

interface AboutSectionProps {
  data: AboutData
}

export function AboutSection({ data }: AboutSectionProps) {
  return (
    <Section id="about">
      <SectionHeader
        description={data.description}
        eyebrow={data.eyebrow}
        title={data.title}
      />

      <div className="about-grid">
        <Reveal className="glass-card about-card">
          <div className="about-card__copy">
            {data.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div>
            <h3 className="subheading">Habilidades principais</h3>
            <div className="tag-list">
              {data.skills.map((skill) => (
                <span className="tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="glass-card about-card" delay={100}>
          <div>
            <h3 className="subheading">Tecnologias e fluxo de trabalho</h3>
            <div className="technology-groups">
              {data.technologies.map((group) => (
                <article className="technology-group" key={group.label}>
                  <h4>{group.label}</h4>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="highlight-grid">
        {data.highlights.map((highlight, index) => (
          <Reveal className="glass-card highlight-card" delay={160 + index * 90} key={highlight.title}>
            <div className="highlight-card__icon">
              <Icon className="highlight-card__glyph" name={highlight.icon} />
            </div>
            <h3>{highlight.title}</h3>
            <p>{highlight.description}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
