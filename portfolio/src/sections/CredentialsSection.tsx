import { useState } from 'react'

import { CredentialCard } from '@/components/cards/CredentialCard'
import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { FilterChips } from '@/components/ui/FilterChips'
import { Reveal } from '@/components/ui/Reveal'
import type { CredentialsData } from '@/types/portfolio'

type CredentialFilter = 'all' | 'Curso' | 'Certificado'

interface CredentialsSectionProps {
  data: CredentialsData
}

function isPlaceholderCredential(url?: string) {
  return Boolean(url && /(?:seusite\.com|example\.com|example\.org)/i.test(url))
}

export function CredentialsSection({ data }: CredentialsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<CredentialFilter>('all')
  const verifiedItems = data.items.filter((item) => !isPlaceholderCredential(item.credentialUrl))

  const filteredItems =
    activeFilter === 'all'
      ? verifiedItems
      : verifiedItems.filter((item) => item.type === activeFilter)

  const filterOptions = [
    { label: 'Todos', value: 'all', count: verifiedItems.length },
    {
      label: 'Cursos',
      value: 'Curso',
      count: verifiedItems.filter((item) => item.type === 'Curso').length,
    },
    {
      label: 'Certificados',
      value: 'Certificado',
      count: verifiedItems.filter((item) => item.type === 'Certificado').length,
    },
  ]

  return (
    <Section id="credentials">
      <SectionHeader
        description={data.description}
        eyebrow={data.eyebrow}
        title={data.title}
      />

      {verifiedItems.length === 0 ? (
        <Reveal className="glass-card contact-panel">
          <p className="contact-panel__availability">Credenciais em atualização</p>
          <p className="contact-panel__message">
            Os exemplos anteriores foram retirados da navegação. Certificados reais serão adicionados
            quando instituição, data e comprovante puderem ser confirmados.
          </p>
        </Reveal>
      ) : (
        <>
          <Reveal className="projects-toolbar credentials-toolbar">
            <FilterChips
              activeValue={activeFilter}
              label="Filtro de credenciais"
              onChange={(value) => setActiveFilter(value as CredentialFilter)}
              options={filterOptions}
            />

            <p className="projects-toolbar__count">
              <strong>{filteredItems.length}</strong> item(ns) visiveis
            </p>
          </Reveal>

          <div className="credentials-grid">
            {filteredItems.map((item, index) => (
              <Reveal delay={index * 90} key={`${item.title}-${item.date}`}>
                <CredentialCard item={item} />
              </Reveal>
            ))}
          </div>
        </>
      )}
    </Section>
  )
}
