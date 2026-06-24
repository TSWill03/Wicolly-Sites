import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { SocialLinks } from '@/components/ui/SocialLinks'
import type { ContactData } from '@/types/portfolio'

interface ContactSectionProps {
  data: ContactData
}

export function ContactSection({ data }: ContactSectionProps) {
  return (
    <Section id="contact">
      <SectionHeader
        description={data.description}
        eyebrow={data.eyebrow}
        title={data.title}
      />

      <div className="contact-layout">
        <Reveal className="glass-card contact-panel">
          <p className="contact-panel__availability">{data.availability}</p>
          <p className="contact-panel__message">Mensagem sugerida: "{data.quickMessage}"</p>

          <div className="contact-panel__actions">
            {data.quickLinks.map((link) => (
              <Button href={link.href} icon={link.icon} key={link.label} variant={link.variant}>
                {link.label}
              </Button>
            ))}
          </div>

          <SocialLinks items={data.socialLinks} label="Redes sociais da secao de contato" />
        </Reveal>

        <div className="contact-methods">
          {data.methods.map((method, index) => (
            <Reveal delay={index * 90} key={method.title}>
              <a className="glass-card contact-card" href={method.href} rel="noreferrer" target="_blank">
                <div className="contact-card__icon">
                  <Icon className="contact-card__glyph" name={method.icon} />
                </div>
                <div className="contact-card__body">
                  <span>{method.title}</span>
                  <strong>{method.value}</strong>
                  <p>{method.description}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
