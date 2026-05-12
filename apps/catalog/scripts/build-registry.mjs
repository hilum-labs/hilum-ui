/**
 * Generates public/registry.json from the marketing catalog pages.
 *
 * For each src/app/marketing/*\/page.tsx it:
 *   1. Finds all `?raw` imports to map variable names → component file paths
 *   2. Finds each <PreviewBlock> and extracts title, description, and the code={varName} reference
 *   3. Reads the component source from disk
 *   4. Detects known dependencies by scanning imports in the source
 *   5. Writes the full registry to apps/catalog/public/registry.json
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CATALOG_ROOT = join(__dirname, '..')
const MARKETING_PAGES_DIR = join(CATALOG_ROOT, 'src', 'app', 'marketing')
const MARKETING_COMPONENTS_DIR = join(CATALOG_ROOT, 'src', 'components', 'marketing')
const OUT_FILE = join(CATALOG_ROOT, 'public', 'registry.json')

// Known runtime dependencies a block might use
const KNOWN_DEPS = ['@hilum/ui', 'lucide-react']

function detectDependencies(source) {
  return KNOWN_DEPS.filter(dep => source.includes(`from '${dep}'`) || source.includes(`from "${dep}"`))
}

function titleFromFilename(filename) {
  return filename
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function parsePageFile(pageContent, category) {
  // Build map: rawVarName → relative component path (e.g. "heroes/hero-simple-centered")
  const rawImportRe = /import\s+(\w+)\s+from\s+"@\/components\/marketing\/([^"]+)\?raw"/g
  const rawVarToPath = {}
  let m
  while ((m = rawImportRe.exec(pageContent)) !== null) {
    rawVarToPath[m[1]] = m[2] // e.g. { heroSimpleCenteredSource: "heroes/hero-simple-centered" }
  }

  // Find each PreviewBlock opening tag and extract title, description, code var
  // PreviewBlock props can appear in any order and span multiple lines
  const blockRe = /<PreviewBlock([\s\S]*?)(?:>|\/>)/g
  const blocks = []

  while ((m = blockRe.exec(pageContent)) !== null) {
    const attrs = m[1]

    const titleMatch = attrs.match(/title="([^"]+)"/)
    const descMatch = attrs.match(/description="([^"]+)"/)
    const codeMatch = attrs.match(/code=\{(\w+)\}/)

    if (!codeMatch) continue

    const codeVar = codeMatch[1]
    const componentPath = rawVarToPath[codeVar]
    if (!componentPath) continue

    const name = basename(componentPath)
    const title = titleMatch ? titleMatch[1] : titleFromFilename(name)
    const description = descMatch ? descMatch[1] : ''

    blocks.push({ name, category, title, description, componentPath })
  }

  return blocks
}

function buildRegistry() {
  const blocks = []

  // Each subdirectory of src/app/marketing/ that has a page.tsx is a category
  const entries = readdirSync(MARKETING_PAGES_DIR, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const category = entry.name
    const pagePath = join(MARKETING_PAGES_DIR, category, 'page.tsx')

    let pageContent
    try {
      pageContent = readFileSync(pagePath, 'utf8')
    } catch {
      continue
    }

    const pageBlocks = parsePageFile(pageContent, category)

    for (const block of pageBlocks) {
      const sourcePath = join(MARKETING_COMPONENTS_DIR, `${block.componentPath}.tsx`)
      let source
      try {
        source = readFileSync(sourcePath, 'utf8')
      } catch {
        console.warn(`  warn: source not found for ${block.name} at ${sourcePath}`)
        continue
      }

      blocks.push({
        name: block.name,
        category: block.category,
        title: block.title,
        description: block.description,
        source,
        dependencies: detectDependencies(source),
      })
    }
  }

  // Sort alphabetically within each category for stable output
  blocks.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))

  const registry = {
    version: '1',
    updatedAt: new Date().toISOString(),
    blocks,
  }

  writeFileSync(OUT_FILE, JSON.stringify(registry, null, 2))
  console.log(`registry: wrote ${blocks.length} blocks → ${OUT_FILE}`)
}

buildRegistry()
