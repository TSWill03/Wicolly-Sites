import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

import { Icon } from '@/components/ui/Icon'
import type { ButtonVariant, IconName } from '@/types/portfolio'
import { resolveContentUrl } from '@/utils/resolveContentUrl'

interface BaseButtonProps {
  children: ReactNode
  className?: string
  icon?: IconName
  variant?: ButtonVariant
  ariaLabel?: string
}

interface LinkButtonProps extends BaseButtonProps {
  href: string
  target?: string
}

interface NativeButtonProps
  extends BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  href?: never
}

type ButtonProps = LinkButtonProps | NativeButtonProps

function isLinkButton(props: ButtonProps): props is LinkButtonProps {
  return 'href' in props
}

function getButtonClassName(variant: ButtonVariant, className?: string) {
  return ['button', `button--${variant}`, className].filter(Boolean).join(' ')
}

export function Button(props: ButtonProps) {
  const variant = props.variant ?? 'primary'
  const className = getButtonClassName(variant, props.className)

  const content = (
    <>
      {props.icon ? <Icon className="button__icon" name={props.icon} /> : null}
      <span>{props.children}</span>
      <ArrowRight aria-hidden="true" className="button__arrow" />
    </>
  )

  if (isLinkButton(props)) {
    const resolvedHref = resolveContentUrl(props.href)
    const opensNewTab =
      props.target === '_blank' ||
      resolvedHref.startsWith('http') ||
      resolvedHref.endsWith('.pdf')

    return (
      <a
        aria-label={props.ariaLabel}
        className={className}
        href={resolvedHref}
        rel={opensNewTab ? 'noreferrer' : undefined}
        target={opensNewTab ? '_blank' : props.target}
      >
        {content}
      </a>
    )
  }

  const {
    children: nativeChildren,
    className: nativeClassName,
    icon: nativeIcon,
    variant: nativeVariant,
    ariaLabel,
    ...buttonProps
  } = props

  void nativeChildren
  void nativeClassName
  void nativeIcon
  void nativeVariant

  return (
    <button
      aria-label={ariaLabel}
      className={className}
      type={buttonProps.type ?? 'button'}
      {...buttonProps}
    >
      {content}
    </button>
  )
}
