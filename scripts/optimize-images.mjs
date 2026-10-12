// One-off: converts the source PNG/JPEG exports into web-sized WebP files under public/
// usage: node scripts/optimize-images.mjs <carrd-dir> <figma-assets-dir>
import { mkdirSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const [carrdDir, figmaDir] = process.argv.slice(2)
const galleries = JSON.parse(readFileSync(new URL('../src/data/galleries.json', import.meta.url), 'utf8'))
const publicDir = new URL('../public/', import.meta.url)
const outDir = (p) => { const d = new URL(p, publicDir); mkdirSync(d, { recursive: true }); return d }

for (const [slug, items] of Object.entries(galleries)) {
  const dir = outDir(`projects/${slug}/`)
  for (const { id, ext } of items) {
    const src = [join(carrdDir, 'img', `${id}.${ext}`), join(carrdDir, 'vnoc25', `${id}.${ext}`)].find(existsSync)
    if (!src) throw new Error(`missing source for ${slug}/${id}`)
    const input = sharp(src, { limitInputPixels: false })
    await input.clone().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 84 }).toFile(fileURLToPath(new URL(`${id}.webp`, dir)))
    await input.clone().resize({ width: 900, height: 900, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(fileURLToPath(new URL(`${id}-thumb.webp`, dir)))
  }
  console.log(slug, items.length)
}

const covers = outDir('covers/')
for (const name of ['cover-osu', 'cover-chumai', 'cover-student-housing']) {
  const meta = await sharp(join(figmaDir, `${name}.png`)).metadata()
  await sharp(join(figmaDir, `${name}.png`)).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 86 }).toFile(fileURLToPath(new URL(`${name}.webp`, covers)))
  console.log(name, meta.width, meta.height)
}
