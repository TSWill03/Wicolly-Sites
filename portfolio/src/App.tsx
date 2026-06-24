import type { CSSProperties } from 'react'
import { useEffect } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { portfolioData } from '@/data/portfolioData'
import { useActiveSection } from '@/hooks/useActiveSection'
import { AboutSection } from '@/sections/AboutSection'
import { ContactSection } from '@/sections/ContactSection'
import { CredentialsSection } from '@/sections/CredentialsSection'
import { GallerySection } from '@/sections/GallerySection'
import { HeroSection } from '@/sections/HeroSection'
import { ProjectsSection } from '@/sections/ProjectsSection'
import { RoadmapSection } from '@/sections/RoadmapSection'
import { ServicesSection } from '@/sections/ServicesSection'
import type { PortfolioSectionKey } from '@/types/portfolio'

const data = portfolioData

const themeStyles = {
  '--color-background': data.theme.colors.background,
  '--color-background-alt': data.theme.colors.backgroundAlt,
  '--color-surface': data.theme.colors.surface,
  '--color-surface-alt': data.theme.colors.surfaceAlt,
  '--color-text': data.theme.colors.text,
  '--color-muted': data.theme.colors.muted,
  '--color-primary': data.theme.colors.primary,
  '--color-secondary': data.theme.colors.secondary,
  '--color-accent': data.theme.colors.accent,
  '--color-border': data.theme.colors.border,
  '--color-success': data.theme.colors.success,
  '--color-warning': data.theme.colors.warning,
  '--color-overlay': data.theme.colors.overlay,
  '--gradient-hero': data.theme.gradients.hero,
  '--gradient-spotlight': data.theme.gradients.spotlight,
  '--gradient-card': data.theme.gradients.card,
  '--font-display': data.theme.fonts.display,
  '--font-body': data.theme.fonts.body,
  '--layout-max-width': data.theme.layout.maxWidth,
  '--radius-xl': data.theme.layout.radius,
} as CSSProperties

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.content = content
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }

  element.href = href
}

function resolveUrl(value: string) {
  try {
    return new URL(value, data.seo.siteUrl).toString()
  } catch {
    return value
  }
}

function renderSection(section: PortfolioSectionKey) {
  switch (section) {
    case 'hero':
      return <HeroSection data={data.hero} key={section} />
    case 'about':
      return <AboutSection data={data.about} key={section} />
    case 'projects':
      return <ProjectsSection data={data.projects} key={section} />
    case 'roadmap':
      return <RoadmapSection data={data.roadmap} key={section} />
    case 'credentials':
      return <CredentialsSection data={data.credentials} key={section} />
    case 'gallery':
      return <GallerySection data={data.gallery} key={section} />
    case 'services':
      return <ServicesSection data={data.services} key={section} />
    case 'contact':
      return <ContactSection data={data.contact} key={section} />
    default:
      return null
  }
}

function App() {
  const activeSection = useActiveSection(data.sectionOrder)

  useEffect(() => {
    const siteUrl = resolveUrl(data.seo.siteUrl)
    const ogImage = resolveUrl(data.seo.ogImage)

    document.title = data.seo.title
    document.documentElement.lang = 'pt-BR'

    upsertMeta('name', 'description', data.seo.description)
    upsertMeta('name', 'keywords', data.seo.keywords.join(', '))
    upsertMeta('name', 'theme-color', data.theme.colors.background)
    upsertMeta('property', 'og:title', data.seo.title)
    upsertMeta('property', 'og:description', data.seo.description)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:url', siteUrl)
    upsertMeta('property', 'og:locale', 'pt_BR')
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', data.seo.title)
    upsertMeta('name', 'twitter:description', data.seo.description)
    upsertMeta('name', 'twitter:image', ogImage)
    upsertCanonical(siteUrl)

    let jsonLdElement = document.head.querySelector<HTMLScriptElement>(
      'script[data-portfolio-schema="true"]',
    )

    if (!jsonLdElement) {
      jsonLdElement = document.createElement('script')
      jsonLdElement.type = 'application/ld+json'
      jsonLdElement.dataset.portfolioSchema = 'true'
      document.head.appendChild(jsonLdElement)
    }

    jsonLdElement.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.hero.name,
      description: data.hero.description,
      jobTitle: data.hero.role,
      image: ogImage,
      url: siteUrl,
      knowsAbout: [...data.about.skills, ...data.projects.items.flatMap((item) => item.technologies)],
      sameAs: data.contact.socialLinks.map((item) => item.href),
    })
  }, [])

  return (
    <div className="app-shell" style={themeStyles}>
      <a className="skip-link" href="#main-content">
        Pular para o conteudo principal
      </a>

      <div aria-hidden="true" className="site-background" />

      <Header
        brandName={data.hero.name}
        brandRole={data.hero.role}
        cta={data.header.cta}
        activeSection={activeSection}
        navigation={data.navigation}
      />

      <main id="main-content">{data.sectionOrder.map((section) => renderSection(section))}</main>

      <Footer
        brandName={data.hero.name}
        copyright={data.footer.copyright}
        navigation={data.navigation}
        note={data.footer.note}
        socialLinks={data.contact.socialLinks}
      />
    </div>
  )
}

export default App
