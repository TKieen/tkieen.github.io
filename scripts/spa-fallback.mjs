// Static hosts without rewrite rules (e.g. GitHub Pages) serve 404.html for unknown paths.
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
