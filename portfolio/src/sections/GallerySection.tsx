import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'
import type { GalleryData } from '@/types/portfolio'
import { resolveContentUrl } from '@/utils/resolveContentUrl'

interface GallerySectionProps {
  data: GalleryData
}

export function GallerySection({ data }: GallerySectionProps) {
  const hasVideos = data.videos.length > 0

  return (
    <Section id="gallery">
      <SectionHeader
        description={data.description}
        eyebrow={data.eyebrow}
        title={data.title}
      />

      <div className={hasVideos ? 'gallery-layout' : 'gallery-layout gallery-layout--single'}>
        <div className="gallery-grid">
          {data.images.map((image, index) => (
            <Reveal
              className={[
                'glass-card gallery-card',
                index === 0 ? 'gallery-card--featured' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              delay={index * 90}
              key={image.title}
            >
              <img alt={image.alt} loading="lazy" src={resolveContentUrl(image.src)} />
              <div className="gallery-card__body">
                <Badge tone="secondary">{image.tag}</Badge>
                <h3>{image.title}</h3>
                <p>{image.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {hasVideos ? (
          <div className="video-list">
            {data.videos.map((video, index) => (
              <Reveal className="glass-card video-card" delay={120 + index * 90} key={video.title}>
                <div className="video-embed">
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    src={resolveContentUrl(video.embedUrl)}
                    title={video.title}
                  />
                </div>
                <div className="video-card__body">
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  )
}
