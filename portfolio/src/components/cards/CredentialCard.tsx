import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { CredentialItem } from '@/types/portfolio'
import { resolveContentUrl } from '@/utils/resolveContentUrl'

interface CredentialCardProps {
  item: CredentialItem
}

export function CredentialCard({ item }: CredentialCardProps) {
  return (
    <article className="glass-card credential-card">
      <img
        alt={item.imageAlt}
        className="credential-card__image"
        loading="lazy"
        src={resolveContentUrl(item.image)}
      />

      <div className="credential-card__body">
        <div className="credential-card__meta">
          <Badge tone={item.type === 'Certificado' ? 'secondary' : 'primary'}>{item.type}</Badge>
          <span>{item.date}</span>
          {item.workload ? <span>{item.workload}</span> : null}
        </div>

        <div className="credential-card__copy">
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
        </div>

        <div className="credential-card__footer">
          <strong>{item.institution}</strong>

          {item.credentialUrl ? (
            <Button href={item.credentialUrl} icon="award" variant="ghost">
              Abrir comprovante
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
