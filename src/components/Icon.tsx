import type { CSSProperties } from 'react'
import arrowDown from '../assets/icons/arrow-down.svg'
import arrowDownRight from '../assets/icons/arrow-down-right.svg'
import arrowLeft from '../assets/icons/arrow-left.svg'
import arrowRight from '../assets/icons/arrow-right.svg'
import arrowUp from '../assets/icons/arrow-up.svg'
import arrowUpRight from '../assets/icons/arrow-up-right-white.svg'
import chevronLeft from '../assets/icons/chevron-left.svg'
import chevronRight from '../assets/icons/chevron-right.svg'
import close from '../assets/icons/close.svg'
import closeMenu from '../assets/icons/close-menu.svg'
import externalLink from '../assets/icons/external-link.svg'
import fit from '../assets/icons/fit.svg'
import github from '../assets/icons/github.svg'
import mail from '../assets/icons/mail.svg'
import menu from '../assets/icons/menu.svg'
import phone from '../assets/icons/phone.svg'
import zoomIn from '../assets/icons/zoom-in.svg'
import zoomOut from '../assets/icons/zoom-out.svg'

const icons = {
  'arrow-down': arrowDown,
  'arrow-down-right': arrowDownRight,
  'arrow-left': arrowLeft,
  'arrow-right': arrowRight,
  'arrow-up': arrowUp,
  'arrow-up-right': arrowUpRight,
  'chevron-left': chevronLeft,
  'chevron-right': chevronRight,
  close,
  'close-menu': closeMenu,
  'external-link': externalLink,
  fit,
  github,
  mail,
  menu,
  phone,
  'zoom-in': zoomIn,
  'zoom-out': zoomOut,
}

export type IconName = keyof typeof icons

type IconProps = { name: IconName; size?: number; className?: string }

/** Single-colour icon: the SVG file is used as a mask so it follows `currentColor`. */
export function Icon({ name, size = 16, className }: IconProps) {
  const style = { '--icon': `url("${icons[name]}")`, width: size, height: size } as CSSProperties
  return <span aria-hidden="true" className={className ? `icon ${className}` : 'icon'} style={style} />
}
