import { useId, useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { ProjectItem, ProjectStatus } from '@/types/portfolio'
import { resolveContentUrl } from '@/utils/resolveContentUrl'

const statusMap: Record<ProjectStatus, { label: string; tone: 'primary' | 'success' | 'warning' }> = {
  completed: { label: 'Concluido', tone: 'success' },
  'in-progress': { label: 'Em andamento', tone: 'primary' },
  planned: { label: 'Planejado', tone: 'warning' },
}

interface ProjectCardProps {
  project: ProjectItem
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const detailsId = useId()
  const status = statusMap[project.status]

  return (
    <article className="glass-card project-card">
      <div className="project-card__cover">
        <img alt={project.coverAlt} loading="lazy" src={resolveContentUrl(project.cover)} />
      </div>

      <div className="project-card__content">
        <div className="project-card__meta">
          <Badge tone={status.tone}>{status.label}</Badge>
          <span className="project-card__phase">{project.phase}</span>
        </div>

        <div className="project-card__copy">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>

        <div className="tag-list">
          {project.technologies.map((technology) => (
            <span className="tag" key={technology}>
              {technology}
            </span>
          ))}
        </div>

        <div className="project-card__actions">
          {project.demoUrl ? (
            <Button href={project.demoUrl} icon="globe" variant="secondary">
              Ver demo
            </Button>
          ) : null}

          {project.githubUrl ? (
            <Button href={project.githubUrl} icon="github" variant="ghost">
              GitHub
            </Button>
          ) : null}

          {project.videoEmbedUrl ? (
            <Button href={project.videoEmbedUrl} icon="play" variant="ghost">
              Video
            </Button>
          ) : null}

          <Button
            ariaLabel={isExpanded ? 'Esconder detalhes do projeto' : 'Mostrar detalhes do projeto'}
            aria-controls={detailsId}
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((current) => !current)}
            variant="ghost"
          >
            {isExpanded ? 'Ocultar detalhes' : 'Ver detalhes'}
          </Button>
        </div>

        {isExpanded ? (
          <div className="project-card__details" id={detailsId}>
            <p className="project-card__details-copy">{project.details}</p>

            <ul className="project-card__highlight-list">
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            {project.gallery?.length ? (
              <div className="project-card__gallery">
                {project.gallery.map((item) => (
                  <img
                    alt={item.alt}
                    key={item.src}
                    loading="lazy"
                    src={resolveContentUrl(item.src)}
                  />
                ))}
              </div>
            ) : null}

            {project.videoEmbedUrl ? (
              <div className="video-embed">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  src={resolveContentUrl(project.videoEmbedUrl)}
                  title={`Video demonstrativo do projeto ${project.title}`}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
