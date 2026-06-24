import { useState } from 'react'
import { Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import type { ActionLink, NavigationItem } from '@/types/portfolio'

function getBrandMark(brandName: string) {
  const initials = brandName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((entry) => entry[0]?.toUpperCase() ?? '')
    .join('')

  return initials || brandName.slice(0, 2).toUpperCase()
}

interface HeaderProps {
  activeSection: string
  brandName: string
  brandRole: string
  cta: ActionLink
  navigation: NavigationItem[]
}

export function Header({ activeSection, brandName, brandRole, cta, navigation }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const brandMark = getBrandMark(brandName)

  return (
    <header className="site-header">
      <div className="container">
        <div className="glass-card site-header__bar">
          <a className="site-brand" href="#hero" onClick={() => setIsOpen(false)}>
            <span aria-hidden="true" className="site-brand__mark">
              {brandMark}
            </span>
            <span className="site-brand__copy">
              <strong>{brandName}</strong>
              <span>{brandRole}</span>
            </span>
          </a>

          <button
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Fechar menu de navegacao' : 'Abrir menu de navegacao'}
            className="site-header__toggle"
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <nav
            aria-label="Navegacao principal"
            className={['site-nav', isOpen ? 'is-open' : ''].filter(Boolean).join(' ')}
          >
            <div className="site-nav__links">
              {navigation.map((item) => (
                <a
                  aria-current={activeSection === item.target ? 'page' : undefined}
                  className="site-nav__link"
                  data-active={activeSection === item.target}
                  href={`#${item.target}`}
                  key={item.target}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <Button href={cta.href} icon={cta.icon} variant={cta.variant}>
              {cta.label}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
