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

import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CATALOG_ROOT = join(__dirname, '..')
const APP_DIR = join(CATALOG_ROOT, 'src', 'app')
const MARKETING_PAGES_DIR = join(CATALOG_ROOT, 'src', 'app', 'marketing')
const MARKETING_COMPONENTS_DIR = join(CATALOG_ROOT, 'src', 'components', 'marketing')
const DOCS_INDEX_FILE = join(CATALOG_ROOT, 'public', 'catalog.json')
const OUT_FILE = join(CATALOG_ROOT, 'public', 'registry.json')
const ROBOTS_FILE = join(CATALOG_ROOT, 'public', 'robots.txt')
const SITEMAP_FILE = join(CATALOG_ROOT, 'public', 'sitemap.xml')

const SITE_NAME = 'Hilum UI'
const SITE_URL = 'https://ui.hilum.dev'
const SITE_DESCRIPTION = 'Hilum UI design system documentation, component catalog, and theming reference.'
const REPOSITORY_URL = 'https://github.com/hilum-labs/hilum-ui'
const UPDATED_AT = new Date().toISOString()

// Known runtime dependencies a block might use
const KNOWN_DEPS = ['@hilum/ui', 'lucide-react']
const SECTION_LABELS = {
  '': 'Home',
  'application-ui': 'Application UI',
  atoms: 'Atoms',
  blocks: 'Blocks',
  designer: 'Designer',
  ecommerce: 'Ecommerce',
  foundations: 'Foundations',
  marketing: 'Marketing',
  molecules: 'Molecules',
  theming: 'Theming',
}

function detectDependencies(source) {
  return KNOWN_DEPS.filter(dep => source.includes(`from '${dep}'`) || source.includes(`from "${dep}"`))
}

function titleFromFilename(filename) {
  return filename
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function sectionLabelFromKey(sectionKey) {
  return SECTION_LABELS[sectionKey] ?? titleFromFilename(sectionKey)
}

function routePathFromPagePath(pagePath) {
  const relativePath = pagePath.slice(APP_DIR.length + 1)
  const routePath = dirname(relativePath)

  if (routePath === '.') {
    return '/'
  }

  return `/${routePath.replace(/\\/g, '/')}`
}

function relativeSourcePath(pagePath) {
  return pagePath.slice(CATALOG_ROOT.length + 1).replace(/\\/g, '/')
}

function routeTitleFromPath(routePath) {
  if (routePath === '/') {
    return 'Design System Overview'
  }

  const segments = routePath.split('/').filter(Boolean)

  if (segments.length === 1) {
    return sectionLabelFromKey(segments[0])
  }

  return titleFromFilename(segments.at(-1))
}

function routeDescriptionFromPath(routePath) {
  if (routePath === '/') {
    return SITE_DESCRIPTION
  }

  const segments = routePath.split('/').filter(Boolean)
  const section = sectionLabelFromKey(segments[0] ?? '')

  if (segments.length === 1) {
    return `${section} documentation for Hilum UI.`
  }

  return `${routeTitleFromPath(routePath)} reference in the ${section} section of Hilum UI.`
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

function collectPageFiles(dir) {
  const pageFiles = []
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      pageFiles.push(...collectPageFiles(fullPath))
      continue
    }

    if (entry.isFile() && entry.name === 'page.tsx') {
      pageFiles.push(fullPath)
    }
  }

  return pageFiles
}

function buildDocsIndex() {
  const routes = collectPageFiles(APP_DIR)
    .map(pagePath => {
      const path = routePathFromPagePath(pagePath)
      const url = new URL(path === '/' ? '/' : `${path}/`, SITE_URL).toString()
      const sectionKey = path === '/' ? '' : path.split('/').filter(Boolean)[0] ?? ''

      return {
        path,
        url,
        title: routeTitleFromPath(path),
        description: routeDescriptionFromPath(path),
        section: sectionLabelFromKey(sectionKey),
        sourcePath: relativeSourcePath(pagePath),
      }
    })
    .sort((a, b) => a.path.localeCompare(b.path))

  const sections = Array.from(
    routes.reduce((map, route) => {
      const section = map.get(route.section) ?? {
        name: route.section,
        path: route.path === '/' ? '/' : `/${route.path.split('/').filter(Boolean)[0]}`,
        url: route.path === '/' ? SITE_URL : new URL(`/${route.path.split('/').filter(Boolean)[0]}/`, SITE_URL).toString(),
        count: 0,
      }

      section.count += 1
      map.set(route.section, section)
      return map
    }, new Map()).values()
  ).sort((a, b) => a.name.localeCompare(b.name))

  const docsIndex = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SITE_NAME} documentation index`,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/catalog.json`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    codeRepository: REPOSITORY_URL,
    dateModified: UPDATED_AT,
    numberOfItems: routes.length,
    sections,
    itemListElement: routes.map((route, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'WebPage',
        name: route.title,
        url: route.url,
        description: route.description,
      },
    })),
    routes,
  }

  writeFileSync(DOCS_INDEX_FILE, JSON.stringify(docsIndex, null, 2))

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map(route => {
      return [
        '  <url>',
        `    <loc>${route.url}</loc>`,
        `    <lastmod>${UPDATED_AT}</lastmod>`,
        '  </url>',
      ].join('\n')
    }),
    '</urlset>',
    '',
  ].join('\n')

  writeFileSync(SITEMAP_FILE, sitemap)

  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n')

  writeFileSync(ROBOTS_FILE, robots)

  console.log(`catalog: wrote ${routes.length} routes → ${DOCS_INDEX_FILE}`)
  console.log(`catalog: wrote sitemap → ${SITEMAP_FILE}`)
  console.log(`catalog: wrote robots → ${ROBOTS_FILE}`)
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
        url: `${SITE_URL}/marketing/${block.category}/`,
        source,
        dependencies: detectDependencies(source),
      })
    }
  }

  // Sort alphabetically within each category for stable output
  blocks.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))

  const registry = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SITE_NAME} marketing blocks registry`,
    description: 'Machine-readable registry of Hilum UI marketing block source files.',
    url: `${SITE_URL}/registry.json`,
    documentation: `${SITE_URL}/marketing`,
    version: '1',
    updatedAt: UPDATED_AT,
    numberOfItems: blocks.length,
    itemListElement: blocks.map((block, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareSourceCode',
        name: block.title,
        description: block.description,
        url: block.url,
        codeRepository: REPOSITORY_URL,
      },
    })),
    blocks,
  }

  mkdirSync(dirname(OUT_FILE), { recursive: true })
  writeFileSync(OUT_FILE, JSON.stringify(registry, null, 2))
  console.log(`registry: wrote ${blocks.length} blocks → ${OUT_FILE}`)
}

buildDocsIndex()
buildRegistry()
