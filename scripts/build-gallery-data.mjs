// One-off: merges the imgur album export with the Figma canvas layouts into src/data/galleries.json
// usage: node scripts/build-gallery-data.mjs <albums.json> <fit-layouts.json>
import { readFileSync, writeFileSync } from 'node:fs'

const [albumsPath, layoutsPath] = process.argv.slice(2)
const albums = JSON.parse(readFileSync(albumsPath, 'utf8'))
const layouts = JSON.parse(readFileSync(layoutsPath, 'utf8'))
const albumBySlug = {
  'vnoc-2025': 'VNOC 2025', 'vncc-2025': 'VNCC 2025', dkh: 'DKH', 'vncc-2024': 'VNCC 2024',
  'vnoc-2024': 'VNOC 2024', harmonia: 'Harmonia', 'aim-cup-3': 'Aim Cup 3', narukami: 'Narukami',
}
const out = {}
for (const [slug, album] of Object.entries(albumBySlug)) {
  const media = albums[album]
  const items = layouts[slug].items
  if (media.length !== items.length) throw new Error(`${slug}: ${media.length} images vs ${items.length} layout items`)
  out[slug] = media.map((m, i) => {
    const [caption, x, y, w, h] = items[i]
    return { id: m.id, ext: m.ext, caption, width: m.width, height: m.height, x, y, w, h }
  })
}
writeFileSync(new URL('../src/data/galleries.json', import.meta.url), JSON.stringify(out, null, 1))
console.log(Object.entries(out).map(([k, v]) => `${k}: ${v.length}`).join(', '))
