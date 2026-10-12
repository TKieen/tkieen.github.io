# Nguyen The Kien — portfolio

Personal portfolio built from the Figma file "Curriculum Vitae" (page *Portfolio*). Vite + React + TypeScript, plain CSS.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build in dist/
npm run preview  # serve dist/ locally
```

## Routes

| Path | Screen |
| --- | --- |
| `/` | Home: hero, about, experience, selected projects, contact |
| `/portfolio` | Gallery of all 8 projects |
| `/portfolio/:slug` | Gallery with the project popup open (zoomable canvas + image lightbox) |

## Where to edit content

- `src/data/site.ts` — home page copy: skills, tools, practice entries, the three featured projects, contact links.
- `src/data/projects.ts` — the 8 gallery projects: text, links, button colours.
- `src/data/galleries.json` — images of each project and their position on the 856 × 820 popup canvas (generated, see below).

## Images

Project images live in `public/projects/<slug>/` as WebP, in two sizes (`<id>.webp` up to 2400px, `<id>-thumb.webp` up to 900px).
They are produced from the original exports by two one-off scripts:

```bash
node scripts/build-gallery-data.mjs <albums.json> <fit-layouts.json>   # writes src/data/galleries.json
node scripts/optimize-images.mjs <carrd-dir> <figma-assets-dir>        # writes public/projects and public/covers
```

## Deploying

The site is a single-page app, so the host must serve `index.html` for every path.
`vercel.json` (Vercel), `public/_redirects` (Netlify / Cloudflare Pages) and the generated `dist/404.html` (GitHub Pages) cover the common hosts.
It expects to be served from the domain root.
