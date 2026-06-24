import { CustomizationCard } from '@/components/cards/CustomizationCard'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import type { ServicesData } from '@/types/portfolio'

interface ServicesSectionProps {
  data: ServicesData
}

export function ServicesSection({ data }: ServicesSectionProps) {
  return (
    <Section id="services">
      <SectionHeader
        centered
        description={data.description}
        eyebrow={data.eyebrow}
        title={data.title}
      />

      <Reveal className="glass-card services-banner">
        <div>
          <span className="eyebrow">{data.offerLabel}</span>
          <h3>Este mesmo site pode ser adaptado para outros clientes e nichos.</h3>
          <p>
            Ajuste o conteudo, troque as cores, reorganize as secoes e transforme a base em um
            produto pronto para venda.
          </p>
        </div>

        <Button href={data.cta.href} icon={data.cta.icon} variant={data.cta.variant}>
          {data.cta.label}
        </Button>
      </Reveal>

      <div className="services-grid">
        {data.offerings.map((item, index) => (
          <Reveal delay={index * 90} key={item.title}>
            <ServiceCard item={item} />
          </Reveal>
        ))}
      </div>

      <div className="services-details">
        <Reveal className="glass-card services-panel customization-panel">
          <div className="customization-panel__header">
            <span className="eyebrow">100% configuravel</span>
            <h3>{data.customization.title}</h3>
            <p>{data.customization.description}</p>
          </div>

          <div className="customization-grid">
            {data.customization.groups.map((item) => (
              <CustomizationCard item={item} key={item.title} />
            ))}
          </div>
        </Reveal>

        <div className="services-side-column">
          <Reveal className="glass-card services-panel">
            <h3>Diferenciais desta estrutura</h3>
            <ul className="services-panel__list">
              {data.differentiators.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>

          <div className="process-list">
            {data.process.map((step, index) => (
              <Reveal className="glass-card process-card" delay={120 + index * 90} key={step.step}>
                <span className="process-card__step">{step.step}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
