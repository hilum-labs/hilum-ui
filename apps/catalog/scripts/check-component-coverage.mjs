import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { componentRegistry } from "../src/data/component-registry.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG_ROOT = join(__dirname, "..");
const REPO_ROOT = join(CATALOG_ROOT, "..", "..");
const UI_INDEX_FILE = join(REPO_ROOT, "packages", "ui", "src", "index.ts");

function unique(values) {
  return [...new Set(values)];
}

function formatList(values) {
  return values.length > 0 ? values.map((value) => `  - ${value}`).join("\n") : "  - none";
}

function parseExportedComponentSlugs() {
  const source = readFileSync(UI_INDEX_FILE, "utf8");
  return [...source.matchAll(/export \* from "\.\/components\/([^"]+)"/g)].map((match) => match[1]);
}

const errors = [];
const exportedSlugs = parseExportedComponentSlugs().sort();
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
  errors.push(`Registry entries without @hilum/ui exports:\n${formatList(extraInRegistry)}`);
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
  `component coverage: ${exportedSlugs.length} exported components covered by registry and catalog routes`,
);
