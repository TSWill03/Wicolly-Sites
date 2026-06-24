import { useState } from 'react'

import { ProjectCard } from '@/components/cards/ProjectCard'
import { Section } from '@/components/layout/Section'
import { FilterChips } from '@/components/ui/FilterChips'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import type { ProjectStatus, ProjectsData } from '@/types/portfolio'

const filterLabels: Record<'all' | ProjectStatus, string> = {
  all: 'Todos',
  completed: 'Concluidos',
  'in-progress': 'Em andamento',
  planned: 'Planejados',
}

interface ProjectsSectionProps {
  data: ProjectsData
}

export function ProjectsSection({ data }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | ProjectStatus>('all')

  const filteredProjects =
    activeFilter === 'all'
      ? data.items
      : data.items.filter((project) => project.status === activeFilter)

  const filterOptions = Object.entries(filterLabels).map(([status, label]) => ({
    label,
    value: status,
    count:
      status === 'all'
        ? data.items.length
        : data.items.filter((project) => project.status === status).length,
  }))

  return (
    <Section id="projects">
      <SectionHeader
        description={data.description}
        eyebrow={data.eyebrow}
        title={data.title}
      />

      <Reveal className="projects-toolbar">
        <FilterChips
          activeValue={activeFilter}
          label="Filtro de projetos"
          onChange={(status) => setActiveFilter(status as 'all' | ProjectStatus)}
          options={filterOptions}
        />

        <p className="projects-toolbar__count">
          <strong>{filteredProjects.length}</strong> projeto(s) em destaque
        </p>
      </Reveal>

      <div className="project-list">
        {filteredProjects.map((project, index) => (
          <Reveal delay={100 + index * 90} key={project.id}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
