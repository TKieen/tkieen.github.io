import galleries from './galleries.json'

export type GalleryImage = {
  id: string
  caption: string
  /** natural pixel size of the source image */
  width: number
  height: number
  /** placement on the 856 × 820 detail canvas */
  x: number
  y: number
  w: number
  h: number
}

export type ProjectLink = { label: string; href: string }

export type Project = {
  slug: string
  index: string
  title: string
  /** longer title used on the gallery card */
  cardTitle: string
  summary: string
  role: string
  year: string
  scope: string
  tools: string
  /** id of the gallery image used as the card cover, or a file in /covers */
  cover: { src: string; width: number; height: number }
  /** per-project tint of the "View detail" button */
  accent: { fill: string; stroke: string; icon: string }
  primaryLink: ProjectLink
  secondaryLinks: ProjectLink[]
  images: GalleryImage[]
}

export const CANVAS = { width: 856, height: 820 }

export const imageUrl = (slug: string, id: string, size: 'full' | 'thumb' = 'full') =>
  `/projects/${slug}/${id}${size === 'thumb' ? '-thumb' : ''}.webp`

const gallery = (slug: keyof typeof galleries): GalleryImage[] =>
  galleries[slug].map(({ id, caption, width, height, x, y, w, h }) => ({ id, caption, width, height, x, y, w, h }))

const galleryCover = (slug: keyof typeof galleries, index: number) => {
  const image = galleries[slug][index]
  return { src: imageUrl(slug, image.id), width: image.width, height: image.height }
}

const TOOLS = 'Figma · Photoshop · After Effects'

export const projects: Project[] = [
  {
    slug: 'vnoc-2025',
    index: 'P—01',
    title: 'Vietnam osu! Championship 2025',
    cardTitle: 'Vietnam osu! Championship 2025',
    summary:
      'A complete visual system and custom broadcast package designed to evolve across seasons while remaining unmistakably familiar to the community.',
    role: 'Lead designer',
    year: '2025',
    scope: 'Tournament identity, social posts, custom map banner, merchandise',
    tools: TOOLS,
    cover: { src: '/covers/cover-osu.webp', width: 1200, height: 522 },
    accent: { fill: '#ffe2e2', stroke: '#b44343', icon: '#e57878' },
    primaryLink: {
      label: 'Watch on YouTube',
      href: 'https://www.youtube.com/watch?v=VTTGGwKbmM8&list=PLk3I3iyqXKktR97JU1FgNcM2SdEu_gid9&index=5',
    },
    secondaryLinks: [
      { label: 'osu! forum thread', href: 'https://osu.ppy.sh/community/forums/topics/2110201?n=1' },
      { label: 'Full album', href: 'https://imgur.com/a/Wx02a8W' },
    ],
    images: gallery('vnoc-2025'),
  },
  {
    slug: 'vncc-2025',
    index: 'P—02',
    title: 'Vietnam CHUMAI Championship 2025',
    cardTitle: 'Vietnam CHUMAI Championship 2025',
    summary:
      'Tournament branding and a flexible family of digital promotional assets, aligned across social and marketing channels.',
    role: 'Lead designer',
    year: '2025',
    scope: 'Tournament identity, social posts, kiosk LED banner, broadcast overlays, staff cards',
    tools: TOOLS,
    cover: galleryCover('vncc-2025', 0),
    accent: { fill: '#e2e9ff', stroke: '#4378b4', icon: '#78abe5' },
    primaryLink: {
      label: 'Watch on YouTube',
      href: 'https://www.youtube.com/watch?v=OjJsF_P96ng&list=PLrv-FboQX2JNzalB6MkCcKLe0GgDpNz9q&index=7',
    },
    secondaryLinks: [{ label: 'Full album', href: 'https://imgur.com/a/0MO6DEG' }],
    images: gallery('vncc-2025'),
  },
  {
    slug: 'dkh',
    index: 'P—03',
    title: 'DKH (A VHP Rebrand)',
    cardTitle: 'DKH (A VHP Rebrand)',
    summary:
      'A rebrand of the VHP tournament, with a custom logo, an icon set for the tournament ruleset and a matching broadcast package.',
    role: 'Designer',
    year: '—',
    scope: 'Logo, ruleset icon set, broadcast overlays, podium graphic',
    tools: TOOLS,
    cover: galleryCover('dkh', 0),
    accent: { fill: '#e2fff2', stroke: '#43b48b', icon: '#78e5bd' },
    primaryLink: {
      label: 'Watch on YouTube',
      href: 'https://www.youtube.com/watch?v=Cszz_M1TF7E&list=PLk3I3iyqXKkvyp9yDvSJS-ehVV6Cx1Zsx',
    },
    secondaryLinks: [{ label: 'Full album', href: 'https://imgur.com/a/dr9zL1e' }],
    images: gallery('dkh'),
  },
  {
    slug: 'vncc-2024',
    index: 'P—04',
    title: 'Vietnam CHUMAI Championship 2024',
    cardTitle: 'Vietnam CHUMAI Championship 2024',
    summary:
      'Tournament identity for the 2024 season, covering the main banner, social posts and a full set of broadcast screens.',
    role: 'Designer',
    year: '2024',
    scope: 'Main banner, social posts, broadcast overlays',
    tools: TOOLS,
    cover: galleryCover('vncc-2024', 0),
    accent: { fill: '#ece2ff', stroke: '#7443b4', icon: '#a778e5' },
    primaryLink: {
      label: 'Watch on YouTube',
      href: 'https://www.youtube.com/watch?v=M_ljDmDT_Jw&list=PLrv-FboQX2JNzalB6MkCcKLe0GgDpNz9q&index=5',
    },
    secondaryLinks: [{ label: 'Full album', href: 'https://imgur.com/a/iXephhe' }],
    images: gallery('vncc-2024'),
  },
  {
    slug: 'vnoc-2024',
    index: 'P—05',
    title: 'Vietnam osu! Championship 2024',
    cardTitle: 'Vietnam osu! Championship 2024',
    summary:
      'Visual identity and broadcast package for the 2024 season, from the main banner to stream screens and custom map banners.',
    role: 'Designer',
    year: '2024',
    scope: 'Main banner, YouTube thumbnail, broadcast overlays, custom map banner, staff banner',
    tools: TOOLS,
    cover: galleryCover('vnoc-2024', 0),
    accent: { fill: '#ffe2ef', stroke: '#b4436d', icon: '#e578a0' },
    primaryLink: {
      label: 'Watch on YouTube',
      href: 'https://www.youtube.com/watch?v=iG_FFkD_qos&list=PLk3I3iyqXKkv3OYPMFIpt8sQIp_edSDRN',
    },
    secondaryLinks: [{ label: 'Full album', href: 'https://imgur.com/a/186Iq1g' }],
    images: gallery('vnoc-2024'),
  },
  {
    slug: 'harmonia',
    index: 'P—06',
    title: 'Harmonia',
    cardTitle: 'Harmonia (Vietnamese maimai tournament)',
    summary:
      'Branding for a Vietnamese maimai tournament, spanning announcement posts, on-site standee posters, broadcast screens and staff cards.',
    role: 'Designer',
    year: '—',
    scope: 'Announcement posts, standee posters, broadcast overlays, staff cards',
    tools: TOOLS,
    cover: galleryCover('harmonia', 1),
    accent: { fill: '#fff8e2', stroke: '#b4a143', icon: '#e5d378' },
    primaryLink: { label: 'Watch on YouTube', href: 'https://www.youtube.com/live/bPGykIGQ9fI?si=MDpUHwsCTuWNlJPm' },
    secondaryLinks: [{ label: 'Full album', href: 'https://imgur.com/a/viTfOEx' }],
    images: gallery('harmonia'),
  },
  {
    slug: 'aim-cup-3',
    index: 'P—07',
    title: 'Aim Cup 3 (World Cup Edition)',
    cardTitle: 'Aim Cup 3 (World Cup Edition)',
    summary:
      'Broadcast and forum graphics for the tournament: main banner, stream screens, a custom map banner, winner and staff banners, and a badge.',
    role: 'Designer',
    year: '—',
    scope: 'Main banner, broadcast overlays, custom map banner, winner and staff banners, badge',
    tools: TOOLS,
    cover: galleryCover('aim-cup-3', 0),
    accent: { fill: '#e3e2ff', stroke: '#5243b4', icon: '#8678e5' },
    primaryLink: { label: 'Watch on Twitch', href: 'https://www.twitch.tv/videos/1952206204' },
    secondaryLinks: [{ label: 'Full album', href: 'https://imgur.com/a/kvEUjzw' }],
    images: gallery('aim-cup-3'),
  },
  {
    slug: 'narukami',
    index: 'P—08',
    title: 'Narukami',
    cardTitle: 'Narukami (Vietnamese maimai tournament)',
    summary:
      'Branding for a Vietnamese maimai tournament, with a main banner, a full set of broadcast screens and staff cards.',
    role: 'Designer',
    year: '—',
    scope: 'Main banner, broadcast overlays, staff cards',
    tools: TOOLS,
    cover: galleryCover('narukami', 0),
    accent: { fill: '#ffe2f7', stroke: '#b4438f', icon: '#e578c1' },
    primaryLink: { label: 'Watch on YouTube', href: 'https://www.youtube.com/live/ak5ZdiwmTFY?si=q0WB7LbKtJIziMk_' },
    secondaryLinks: [{ label: 'Full album', href: 'https://imgur.com/a/7L7euVY' }],
    images: gallery('narukami'),
  },
]

export const findProject = (slug: string | undefined) => projects.find((project) => project.slug === slug)
