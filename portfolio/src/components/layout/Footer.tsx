import { SocialLinks } from '@/components/ui/SocialLinks'
import type { NavigationItem, SocialLink } from '@/types/portfolio'

interface FooterProps {
  brandName: string
  note: string
  copyright: string
  navigation: NavigationItem[]
  socialLinks: SocialLink[]
}

export function Footer({
  brandName,
  note,
  copyright,
  navigation,
  socialLinks,
}: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="glass-card footer-card">
          <div className="footer-card__brand">
            <strong>{brandName}</strong>
            <p>{note}</p>
          </div>

          <nav aria-label="Links rapidos do rodape" className="footer-card__links">
            {navigation.map((item) => (
              <a href={`#${item.target}`} key={item.target}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="footer-card__social">
            <SocialLinks items={socialLinks} label="Redes sociais do rodape" />
          </div>

          <p className="footer-card__copyright">
            {new Date().getFullYear()} | {copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
