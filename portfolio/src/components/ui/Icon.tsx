import type { ComponentType, SVGProps } from 'react'
import {
  Award,
  Download,
  FolderKanban,
  Github,
  Globe,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  MessageCircle,
  MonitorSmartphone,
  Palette,
  Phone,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react'

import type { IconName } from '@/types/portfolio'

const iconMap: Record<IconName, ComponentType<SVGProps<SVGSVGElement>>> = {
  award: Award,
  download: Download,
  folder: FolderKanban,
  github: Github,
  globe: Globe,
  instagram: Instagram,
  layers: Layers3,
  linkedin: Linkedin,
  mail: Mail,
  monitor: MonitorSmartphone,
  palette: Palette,
  phone: Phone,
  play: PlayCircle,
  rocket: Rocket,
  shield: ShieldCheck,
  sparkles: Sparkles,
  whatsapp: MessageCircle,
  workflow: Workflow,
}

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
}

export function Icon({ name, ...props }: IconProps) {
  const Component = iconMap[name]

  return <Component aria-hidden="true" {...props} />
}
