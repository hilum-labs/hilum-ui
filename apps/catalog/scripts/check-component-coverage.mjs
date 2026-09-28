import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { componentRegistry } from "../src/data/component-registry.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG_ROOT = join(__dirname, "..");
const REPO_ROOT = join(CATALOG_ROOT, "..", "..");
// Every @hilum/ui entry that re-exports components. Components that live on a
// subpath (e.g. the AI surfaces on `@hilum/ui/ai`) must stay covered too.
const UI_COMPONENT_ENTRIES = [
  { entry: "@hilum/ui", file: join(REPO_ROOT, "packages", "ui", "src", "index.ts") },
  { entry: "@hilum/ui/ai", file: join(REPO_ROOT, "packages", "ui", "src", "ai.ts") },
];

function unique(values) {
  return [...new Set(values)];
}

function formatList(values) {
  return values.length > 0 ? values.map((value) => `  - ${value}`).join("\n") : "  - none";
}

function parseExportedComponentSlugs() {
  return UI_COMPONENT_ENTRIES.flatMap(({ entry, file }) => {
    if (!existsSync(file)) {
      errors.push(`${entry} entry file is missing: ${file}`);
      return [];
    }
    const source = readFileSync(file, "utf8");
    return [...source.matchAll(/export \* from "\.\/components\/([^"]+)"/g)].map(
      (match) => match[1],
    );
  });
}

const errors = [];
const exportedSlugList = parseExportedComponentSlugs();
const exportedSlugs = unique(exportedSlugList).sort();
const doublyExported = exportedSlugList.filter(
  (slug, index) => exportedSlugList.indexOf(slug) !== index,
);
if (doublyExported.length > 0) {
  errors.push(
    `Components exported from more than one @hilum/ui entry:\n${formatList(unique(doublyExported))}`,
  );
}
const registrySlugs = componentRegistry.map((component) => component.slug).sort();
const duplicateRegistrySlugs = registrySlugs.filter(
  (slug, index) => registrySlugs.indexOf(slug) !== index,
);
const missingFromRegistry = exportedSlugs.filter((slug) => !registrySlugs.includes(slug));
const extraInRegistry = registrySlugs.filter((slug) => !exportedSlugs.includes(slug));

if (duplicateRegistrySlugs.length > 0) {
  errors.push(`Duplicate registry slugs:\n${formatList(unique(duplicateRegistrySlugs))}`);
}

if (missingFromRegistry.length > 0) {
  errors.push(
    `Exported components missing from component registry:\n${formatList(missingFromRegistry)}`,
  );
}

if (extraInRegistry.length > 0) {
  errors.push(
    `Registry entries without @hilum/ui (or subpath) exports:\n${formatList(extraInRegistry)}`,
  );
}

for (const component of componentRegistry) {
  const expectedCatalogPath = `/${component.section}/${component.slug}/`;
  const sourcePath = join(REPO_ROOT, component.sourcePath);
  const pagePath = join(CATALOG_ROOT, "src", "app", component.section, component.slug, "page.tsx");

  if (component.catalogPath !== expectedCatalogPath) {
    errors.push(
      `${component.slug} has catalogPath ${component.catalogPath}; expected ${expectedCatalogPath}`,
    );
  }

  if (!existsSync(sourcePath)) {
    errors.push(`${component.slug} source file is missing: ${component.sourcePath}`);
  }

  if (!existsSync(pagePath)) {
    errors.push(`${component.slug} catalog page is missing: ${pagePath}`);
  }

  if (!component.description || component.description.length < 24) {
    errors.push(`${component.slug} needs a useful registry description`);
  }
}

if (errors.length > 0) {
  console.error(`component coverage: failed with ${errors.length} issue(s)\n`);
  console.error(errors.join("\n\n"));
  process.exit(1);
}

console.log(
  `component coverage: ${exportedSlugs.length} exported components (${UI_COMPONENT_ENTRIES.map((e) => e.entry).join(", ")}) covered by registry and catalog routes`,
);
