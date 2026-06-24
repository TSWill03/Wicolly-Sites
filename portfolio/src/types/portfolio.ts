export type PortfolioSectionKey =
  | 'hero'
  | 'about'
  | 'projects'
  | 'roadmap'
  | 'credentials'
  | 'gallery'
  | 'services'
  | 'contact'

export type ProjectStatus = 'in-progress' | 'completed' | 'planned'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

export type IconName =
  | 'mail'
  | 'github'
  | 'linkedin'
  | 'whatsapp'
  | 'instagram'
  | 'globe'
  | 'sparkles'
  | 'workflow'
  | 'rocket'
  | 'layers'
  | 'shield'
  | 'palette'
  | 'award'
  | 'play'
  | 'download'
  | 'monitor'
  | 'phone'
  | 'folder'

export interface SectionLead {
  eyebrow: string
  title: string
  description: string
}

export interface ActionLink {
  label: string
  href: string
  variant?: ButtonVariant
  icon?: IconName
}

export interface NavigationItem {
  label: string
  target: PortfolioSectionKey
}

export interface HeaderData {
  cta: ActionLink
}

export interface SocialLink {
  label: string
  href: string
  icon: IconName
}

export interface MetricItem {
  value: string
  label: string
  detail: string
}

export interface HeroFeature {
  title: string
  description: string
  items: string[]
}

export interface HeroData extends SectionLead {
  name: string
  role: string
  subtitle: string
  availability: string
  actions: ActionLink[]
  badges: string[]
  metrics: MetricItem[]
  image: {
    src: string
    alt: string
  }
  feature: HeroFeature
  socialLinks: SocialLink[]
}

export interface HighlightCard {
  icon: IconName
  title: string
  description: string
}

export interface TechnologyGroup {
  label: string
  items: string[]
}

export interface AboutData extends SectionLead {
  paragraphs: string[]
  skills: string[]
  technologies: TechnologyGroup[]
  highlights: HighlightCard[]
}

export interface ProjectGalleryItem {
  src: string
  alt: string
}

export interface ProjectItem {
  id: string
  title: string
  description: string
  status: ProjectStatus
  phase: string
  technologies: string[]
  cover: string
  coverAlt: string
  githubUrl?: string
  demoUrl?: string
  videoEmbedUrl?: string
  gallery?: ProjectGalleryItem[]
  highlights: string[]
  details: string
}

export interface ProjectsData extends SectionLead {
  items: ProjectItem[]
}

export interface RoadmapItem {
  phase: string
  title: string
  description: string
  status: string
  outcomes: string[]
}

export interface RoadmapData extends SectionLead {
  items: RoadmapItem[]
}

export interface CredentialItem {
  type: 'Curso' | 'Certificado'
  title: string
  institution: string
  workload?: string
  date: string
  image: string
  imageAlt: string
  credentialUrl?: string
  summary: string
}

export interface CredentialsData extends SectionLead {
  items: CredentialItem[]
}

export interface GalleryImage {
  title: string
  description: string
  src: string
  alt: string
  tag: string
}

export interface GalleryVideo {
  title: string
  description: string
  embedUrl: string
}

export interface GalleryData extends SectionLead {
  images: GalleryImage[]
  videos: GalleryVideo[]
}

export interface ServiceOffering {
  icon: IconName
  title: string
  description: string
  features: string[]
}

export interface CustomizationGroup {
  title: string
  description: string
  items: string[]
}

export interface ServicesCustomization {
  title: string
  description: string
  groups: CustomizationGroup[]
}

export interface ProcessStep {
  step: string
  title: string
  description: string
}

export interface ServicesData extends SectionLead {
  offerLabel: string
  offerings: ServiceOffering[]
  customization: ServicesCustomization
  differentiators: string[]
  process: ProcessStep[]
  cta: ActionLink
}

export interface ContactMethod {
  title: string
  value: string
  href: string
  icon: IconName
  description: string
}

export interface ContactData extends SectionLead {
  availability: string
  quickMessage: string
  methods: ContactMethod[]
  socialLinks: SocialLink[]
  quickLinks: ActionLink[]
}

export interface FooterData {
  note: string
  copyright: string
}

export interface ThemeSettings {
  colors: {
    background: string
    backgroundAlt: string
    surface: string
    surfaceAlt: string
    text: string
    muted: string
    primary: string
    secondary: string
    accent: string
    border: string
    success: string
    warning: string
    overlay: string
  }
  gradients: {
    hero: string
    spotlight: string
    card: string
  }
  fonts: {
    display: string
    body: string
  }
  layout: {
    maxWidth: string
    radius: string
  }
}

export interface SeoData {
  title: string
  description: string
  keywords: string[]
  siteUrl: string
  ogImage: string
}

export interface PortfolioData {
  seo: SeoData
  theme: ThemeSettings
  header: HeaderData
  navigation: NavigationItem[]
  sectionOrder: PortfolioSectionKey[]
  hero: HeroData
  about: AboutData
  projects: ProjectsData
  roadmap: RoadmapData
  credentials: CredentialsData
  gallery: GalleryData
  services: ServicesData
  contact: ContactData
  footer: FooterData
}
