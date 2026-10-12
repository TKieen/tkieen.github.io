import toolAe from '../assets/icons/tool-ae.svg'
import toolFigma from '../assets/icons/tool-figma.svg'
import toolPhotoshop from '../assets/icons/tool-photoshop.svg'
import toolVisual from '../assets/icons/tool-visual.svg'

export const owner = {
  name: 'Nguyen The Kien',
  role: 'UX/UI designer',
  availability: 'Available for selected projects',
  copyright: '© 2026 NGUYEN THE KIEN · DESIGNED WITH INTENT',
}

/** Sections of the home page, in scroll order. */
export const sections = [
  { id: 'home', label: 'Home', index: '00' },
  { id: 'about', label: 'About me', index: '01' },
  { id: 'experience', label: 'Experience', index: '02' },
  { id: 'portfolio', label: 'Portfolio', index: '03' },
  { id: 'contact', label: 'Contact', index: '04' },
] as const

export type SectionId = (typeof sections)[number]['id']

export const quickDetails = [
  { label: 'Based in', value: 'Ho Chi Minh City, VN' },
  { label: 'Discipline', value: 'UX/UI & Visual Design' },
  { label: 'Languages', value: 'Vietnamese · English' },
]

export const skillTags: { label: string; tone?: 'blue' | 'amber' }[] = [
  { label: 'Figma', tone: 'blue' },
  { label: 'Photoshop', tone: 'blue' },
  { label: 'Claude', tone: 'amber' },
  { label: 'Codex', tone: 'amber' },
  { label: 'After Effects' },
  { label: 'Illustrator' },
  { label: 'React.js' },
  { label: 'Material-UI' },
  { label: 'HTML5 / CSS3' },
  { label: 'Visual systems' },
]

export const tools = [
  { code: 'PS', tone: 'ps', icon: toolPhotoshop, iconSize: 24, title: 'Photoshop', meta: '4 years', note: 'Image craft & production', emphasis: true },
  { code: 'FI', tone: 'figma', icon: toolFigma, iconSize: 22, title: 'Figma', meta: '3 years', note: 'Product & prototyping' },
  { code: 'AE', tone: 'ae', icon: toolAe, iconSize: 22, title: 'Web & motion', meta: 'After Effects', note: 'Illustrator' },
  { code: 'VD', tone: 'visual', icon: toolVisual, iconSize: 22, title: 'Visual design', meta: 'Skilled', note: 'Layout & identity' },
]

export const practice = [
  {
    years: '2022–2025',
    title: 'Vietnam osu! Championship',
    role: 'Lead designer',
    description:
      'Built the tournament’s design system and custom broadcast overlays, then re-themed them each season while keeping the brand consistent and recognizable to the community.',
    client: 'Vietnam Community League',
    tools: 'Figma, Photoshop, After Effects',
  },
  {
    years: '2024–2025',
    title: 'Vietnam CHUMAI Championship',
    role: 'Lead designer',
    description:
      'Designed the full tournament branding and promotional assets, consistent across social and marketing channels.',
    client: 'Selenadia',
    tools: 'Figma, Photoshop, After Effects',
  },
  {
    years: '2026',
    title: 'Student Housing UX/UI',
    role: 'Concept & interface',
    description:
      'Researched and prototyped a student accommodation platform in high fidelity, focused on usability and accessibility.',
    client: 'HCI Course',
    tools: 'Figma',
  },
]

export type FeaturedProject = {
  key: 'osu' | 'chumai' | 'housing'
  index: string
  tag: string
  /** title split into segments so one word can take the accent colour */
  title: { text: string; accent?: boolean }[]
  caption: string
  description: string
  tools: string
  cover: { src: string; width: number; height: number }
  /** internal route or external URL */
  href: string
}

export const featuredProjects: FeaturedProject[] = [
  {
    key: 'osu',
    index: 'P—01',
    tag: 'Lead designer',
    title: [{ text: 'Vietnam ' }, { text: 'osu! ', accent: true }, { text: 'Championship' }],
    caption: '2022–2025 · For: Vietnam Community League',
    description: practice[0].description,
    tools: 'FIGMA · PHOTOSHOP · AFTER EFFECTS',
    cover: { src: '/covers/cover-osu.webp', width: 1200, height: 522 },
    href: '/portfolio/vnoc-2025',
  },
  {
    key: 'chumai',
    index: 'P—02',
    tag: 'Lead designer',
    title: [{ text: 'Vietnam ' }, { text: 'CHUMAI ', accent: true }, { text: 'Championship' }],
    caption: '2024–2025 · For: Selenadia',
    description: practice[1].description,
    tools: 'FIGMA · PHOTOSHOP · AFTER EFFECTS',
    cover: { src: '/covers/cover-chumai.webp', width: 2000, height: 1047 },
    href: '/portfolio/vncc-2025',
  },
  {
    key: 'housing',
    index: 'P—03',
    tag: 'Concept & interface',
    title: [{ text: 'Student Housing ' }, { text: 'UX/UI', accent: true }],
    caption: '2026 · For: HCI Course',
    description: practice[2].description,
    tools: 'FIGMA',
    cover: { src: '/covers/cover-student-housing.webp', width: 1584, height: 672 },
    href: 'https://www.figma.com/design/U7OkZ5l0YNZ3B9V91xaufP/Curriculum-Vitae?node-id=2209-2',
  },
]

export const contactLinks = [
  { label: 'Email', value: 'tkieen.works@gmail.com', href: 'mailto:tkieen.works@gmail.com', icon: 'mail' },
  { label: 'Phone', value: '0389 268 034', href: 'tel:+84389268034', icon: 'phone' },
  { label: 'GitHub', value: 'github.com/TKieen', href: 'https://github.com/TKieen', icon: 'github' },
  { label: 'Portfolio', value: 'tkieen.github.io', href: 'https://tkieen.github.io', icon: 'external-link' },
] as const
