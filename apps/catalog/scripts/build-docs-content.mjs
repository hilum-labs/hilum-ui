import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from "fs";
import { basename, dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG_ROOT = join(__dirname, "..");
const APP_DIR = join(CATALOG_ROOT, "src", "app");
const UI_COMPONENTS_DIR = join(CATALOG_ROOT, "..", "..", "packages", "ui", "src", "components");
const OUT_DIR = join(CATALOG_ROOT, "src", "generated");
const OUT_FILE = join(OUT_DIR, "catalog-docs.ts");

const SECTION_TITLES = {
  "application-ui": "Application UI",
  atoms: "Atoms",
  blocks: "Blocks",
  designer: "Designer",
  ecommerce: "Ecommerce",
  foundations: "Foundations",
  marketing: "Marketing",
  molecules: "Molecules",
  theming: "Theming",
};

const SECTION_INTRO_OVERRIDES = {
  "/": [
    "Start here when you need to understand the full shape of the design system before drilling into individual components.",
    "The overview page groups the catalog by scale, from low-level primitives through full-page application and marketing patterns.",
  ],
  "/application-ui/": [
    "Application UI focuses on full product workflows rather than isolated controls, so the examples are grouped by the job the interface is doing.",
    "Use these sections when you are laying out dashboards, settings, internal tools, or multi-step product surfaces.",
  ],
  "/atoms/": [
    "Atoms are grouped by the kind of interaction they support so teams can find the right primitive before building a larger pattern.",
    "Start in atoms when you need the smallest reusable control and want to stay close to the source component API.",
  ],
  "/blocks/": [
    "Blocks are organized around screen-level jobs such as sign-in, navigation, shell layout, and settings so you can copy a whole composed surface.",
    "Use these when you need a strong production starting point rather than assembling a page from primitives manually.",
  ],
  "/designer/": [
    "Designer pages document the composition environment itself: canvas behavior, shell layout, and pane orchestration.",
    "Use this section when you are working on authoring workflows rather than end-user UI alone.",
  ],
  "/ecommerce/": [
    "Ecommerce examples are grouped by the customer journey, from merchandising and browsing through cart, checkout, and post-purchase states.",
    "This helps teams pick patterns that match a concrete shopping workflow instead of hunting through disconnected examples.",
  ],
  "/foundations/": [
    "Foundations defines the visual language beneath every component, including color, typography, spacing, radius, and shadows.",
    "Read this before customizing tokens or judging whether a component feels off-brand, because most visual decisions roll up from here.",
  ],
  "/marketing/": [
    "Marketing sections are grouped by the role they play on a landing page, such as page introductions, conversion moments, proof points, and supporting content.",
    "Use this catalog when you are building a narrative page and need a reusable section pattern rather than a single control.",
  ],
  "/molecules/": [
    "Molecules are grouped around practical UI jobs, combining multiple atoms into reusable patterns such as fields, headers, lists, and notifications.",
    "Use this section when the primitive pieces are too low-level and you want a composition that already encodes spacing, hierarchy, and behavior.",
  ],
  "/theming/": [
    "Theming explains how brand tokens and generated palettes flow through the component system.",
    "Start here when you need to adapt the catalog to a product identity without forking the component code.",
  ],
};

const ACCESSIBILITY_GUIDES = {
  form: [
    "Keep a visible label or an equivalent accessible name attached to the control.",
    "Surface validation and helper text programmatically so assistive technologies receive the same context as sighted users.",
    "Preserve the native focus order and keyboard interactions instead of replacing them with custom behavior.",
  ],
  overlay: [
    "Move focus into the overlay when it opens and return focus to the trigger when it closes.",
    "Support Escape to dismiss non-destructive overlays and ensure the trigger communicates expanded state where appropriate.",
    "Do not hide critical actions behind hover-only disclosure; keyboard and touch users need equivalent access.",
  ],
  navigation: [
    "Mark the current item clearly with visual state and the appropriate ARIA current/selected semantics.",
    "Ensure arrow-key or tab-key movement stays predictable when the pattern behaves like a composite widget.",
    "Do not rely on icon-only navigation unless every control has a clear accessible name.",
  ],
  data: [
    "Preserve table semantics for tabular data and avoid flattening structured information into generic divs.",
    "Use clear headings, summaries, and labels so assistive technologies can announce the data in context.",
    "Do not rely on color alone to communicate trend, status, or state in charts and metric cards.",
  ],
  feedback: [
    "Use semantic status text in addition to color or icon treatment so the message is understandable to everyone.",
    "Announce transient updates with a live region when the user does not move focus to the message directly.",
    "Keep dismissal and recovery actions accessible from the keyboard.",
  ],
  layout: [
    "Maintain heading order and region labels so the surrounding layout stays understandable when styles are stripped away.",
    "Avoid using visual grouping alone to explain hierarchy; expose the structure semantically as well.",
    "Make sure drag, resize, and reorder interactions have keyboard alternatives when they are part of the core task.",
  ],
  generic: [
    "Keep headings, labels, and supporting text in the DOM before decorative chrome so the page reads well without styles or scripts.",
    "Test the pattern with keyboard navigation and a screen reader before treating the visual layout as complete.",
    "Use status, selection, and disabled states that remain understandable without color alone.",
  ],
};

function toRoutePath(pagePath) {
  const relativePath = relative(APP_DIR, pagePath).replace(/\\/g, "/");
  const routeDir = dirname(relativePath);
  if (routeDir === ".") {
    return "/";
  }
  return `/${routeDir}/`;
}

function titleFromSegment(segment) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bUi\b/g, "UI");
}

function getSectionTitle(routePath) {
  const segment = routePath.split("/").filter(Boolean)[0] ?? "";
  return SECTION_TITLES[segment] ?? titleFromSegment(segment);
}

function stripJsx(text) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\{[^}]+\}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(source, routePath) {
  const match = source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (match) {
    const text = stripJsx(match[1]);
    if (text) {
      return text;
    }
  }

  const segments = routePath.split("/").filter(Boolean);
  if (routePath === "/") {
    return "Design System";
  }
  return titleFromSegment(segments.at(-1) ?? "");
}

function extractSummary(source) {
  const h1Index = source.search(/<h1[^>]*>/);
  const slice = h1Index >= 0 ? source.slice(h1Index) : source;
  const matches = [...slice.matchAll(/<p className="(?:body|body-lg|caption)[^"]*"[^>]*>([\s\S]*?)<\/p>/g)];
  for (const match of matches) {
    const text = stripJsx(match[1]);
    if (text.length > 12) {
      return text;
    }
  }
  return "";
}

function extractPreviewBlocks(source) {
  const blocks = [];
  const blockRe = /<PreviewBlock([\s\S]*?)(?:>|\/>)/g;
  let match;

  while ((match = blockRe.exec(source)) !== null) {
    const attrs = match[1];
    const title = attrs.match(/title="([^"]+)"/)?.[1];
    const description = attrs.match(/description="([^"]+)"/)?.[1] ?? "";
    const codeVar = attrs.match(/code=\{(\w+)\}/)?.[1] ?? null;

    if (title) {
      blocks.push({ title, description, codeVar });
    }
  }

  return blocks;
}

function extractSectionLinks(source, prefix) {
  const links = [];
  const entryRe = /name:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"/g;
  let match;
  while ((match = entryRe.exec(source)) !== null) {
    links.push({
      label: match[1],
      href: `${prefix}${match[2]}`,
    });
  }
  for (const hrefMatch of source.matchAll(/href:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"/g)) {
    links.push({
      label: hrefMatch[2],
      href: hrefMatch[1],
    });
  }
  for (const hrefMatch of source.matchAll(/label:\s*"([^"]+)"[\s\S]*?href:\s*"([^"]+)"/g)) {
    links.push({
      label: hrefMatch[1],
      href: hrefMatch[2],
    });
  }
  return links;
}

function extractCodeExamples(source) {
  const examples = [];
  const codeObjectMatch = source.match(/const CODE = \{([\s\S]*?)\n\};/);

  if (codeObjectMatch) {
    const templateMatches = [...codeObjectMatch[1].matchAll(/:\s*`([\s\S]*?)`,?/g)];
    for (const match of templateMatches) {
      examples.push(match[1].trim());
    }
  }

  return examples;
}

function resolveRawImportExamples(source, pagePath) {
  const importMap = {};
  const rawImportRe = /^import\s+(\w+)\s+from\s+"@\/([^"]+)\?raw"/gm;
  let match;
  while ((match = rawImportRe.exec(source)) !== null) {
    importMap[match[1]] = match[2];
  }

  const blocks = extractPreviewBlocks(source);
  for (const block of blocks) {
    if (!block.codeVar || !importMap[block.codeVar]) {
      continue;
    }
    const fullPath = join(CATALOG_ROOT, "src", importMap[block.codeVar]) + ".tsx";
    if (!existsSync(fullPath)) {
      continue;
    }
    return readFileSync(fullPath, "utf8").trim();
  }

  return null;
}

function inferDocKind(routePath, previewBlocks) {
  const segments = routePath.split("/").filter(Boolean);
  const topLevel = segments[0] ?? "";

  if (segments.length <= 1) {
    return routePath === "/" ? "section" : "section";
  }

  if (["atoms", "molecules", "blocks", "designer"].includes(topLevel)) {
    return "component";
  }

  if (previewBlocks.length > 0) {
    return "collection";
  }

  return "collection";
}

function inferAccessibilityKind(routePath, title, summary) {
  const haystack = `${routePath} ${title} ${summary}`.toLowerCase();

  if (/(designer|blocks|shell|canvas|pane|frame)/.test(haystack)) {
    return "layout";
  }
  if (/(input|select|checkbox|radio|switch|combobox|calendar|date|field|form)/.test(haystack)) {
    return "form";
  }
  if (/(dialog|sheet|drawer|popover|tooltip|hover card|menu|overlay|command)/.test(haystack)) {
    return "overlay";
  }
  if (/(sidebar|navigation|breadcrumb|pagination|tabs|steps|header|navbar)/.test(haystack)) {
    return "navigation";
  }
  if (/(table|chart|data|stat|description list|grid list|stacked list|activity feed)/.test(haystack)) {
    return "data";
  }
  if (/(alert|notification|progress|spinner|toast|empty state|feedback)/.test(haystack)) {
    return "feedback";
  }
  if (/(layout|shell|page|media object|card heading|section heading|designer|blocks)/.test(haystack)) {
    return "layout";
  }
  return "generic";
}

function parseTopLevelKeys(source) {
  const matches = [...source.matchAll(/^\s{2}([a-zA-Z0-9-]+):\s*\{/gm)];
  return matches.map((match) => match[1]);
}

function parseVariantPropNames(source) {
  const variantsMatch = source.match(/variants:\s*\{([\s\S]*?)\n\s*\},\n\s*defaultVariants:/);
  if (!variantsMatch) {
    return [];
  }

  return [...variantsMatch[1].matchAll(/^\s+([a-zA-Z0-9-]+):\s*\{/gm)]
    .map((match) => match[1])
    .filter((key) => !["default", "destructive", "outline", "secondary", "brand", "ghost", "link", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"].includes(key));
}

function parseInterfaceProps(source) {
  const props = [];
  const interfaceMatches = [...source.matchAll(/interface\s+\w+Props[^{]*\{([\s\S]*?)\n\}/g)];
  for (const match of interfaceMatches) {
    const body = match[1];
    for (const line of body.split("\n")) {
      const propMatch = line.trim().match(/^([a-zA-Z0-9_]+)\??:/);
      if (propMatch) {
        props.push(propMatch[1]);
      }
    }
  }
  return [...new Set(props)];
}

function parseExportNames(source) {
  const exportSet = new Set();
  for (const match of source.matchAll(/export\s+\{([^}]+)\};/g)) {
    const names = match[1]
      .split(",")
      .map((part) => part.trim().split(/\s+as\s+/)[0]?.trim())
      .filter(Boolean);
    names.forEach((name) => exportSet.add(name));
  }
  for (const match of source.matchAll(/export\s+(?:const|function)\s+([A-ZA-Za-z0-9_]+)/g)) {
    exportSet.add(match[1]);
  }
  return [...exportSet];
}

function parseWorkspaceImportedSymbols(source) {
  const statements = source
    .split(/\n(?=import\s)/)
    .map((statement) => statement.trim())
    .filter((statement) => statement.startsWith("import "));

  const imports = [];
  for (const statement of statements) {
    const pkgMatch = statement.match(/from\s+"(@hilum\/[^"]+)"/);
    if (!pkgMatch) {
      continue;
    }
    const symbolMatch = statement.match(/import\s+\{([\s\S]*?)\}\s+from/);
    if (!symbolMatch) {
      continue;
    }
    imports.push(
      ...symbolMatch[1]
        .split(",")
        .map((part) => part.replace(/\btype\s+/g, "").trim())
        .filter(Boolean),
    );
  }

  return imports;
}

function buildApiItems(routePath, title, pageSource, previewBlocks) {
  const slug = routePath.split("/").filter(Boolean).at(-1);
  if (!slug) {
    return [];
  }

  const sourcePath = join(UI_COMPONENTS_DIR, `${slug}.tsx`);
  if (existsSync(sourcePath)) {
    const source = readFileSync(sourcePath, "utf8");
    const interfaceProps = parseInterfaceProps(source);
    const exportNames = parseExportNames(source);
    const variantProps = parseVariantPropNames(source);
    const items = [];

    if (interfaceProps.length > 0) {
      items.push({
        label: "Props",
        description: interfaceProps.slice(0, 6).join(", "),
      });
    }

    if (variantProps.length > 0) {
      items.push({
        label: "Variant props",
        description: variantProps.join(", "),
      });
    }

    if (exportNames.length > 1) {
      items.push({
        label: "Key exports",
        description: exportNames.slice(0, 6).join(", "),
      });
    }

    if (items.length === 0) {
      if (/input|textarea/.test(slug)) {
        items.push({
          label: "Common HTML props",
          description: "type, placeholder, value, defaultValue, disabled, required",
        });
      } else if (/button/.test(slug)) {
        items.push({
          label: "Common HTML props",
          description: "type, disabled, onClick, form, aria-label",
        });
      }
    }

    if (items.length === 0) {
      items.push({
        label: "Composition surface",
        description: `${title} keeps the native HTML or Radix API surface, then layers in design-system styling and composition defaults.`,
      });
    }

    return items.slice(0, 4);
  }

  const importedSymbols = parseWorkspaceImportedSymbols(pageSource);

  const pageItems = [];
  if (previewBlocks.length > 0) {
    pageItems.push({
      label: "Included examples",
      description: previewBlocks.slice(0, 4).map((block) => block.title).join(", "),
    });
  }
  if (importedSymbols.length > 0) {
    pageItems.push({
      label: "Key building blocks",
      description: importedSymbols.slice(0, 6).join(", "),
    });
  }
  if (pageItems.length === 0) {
    pageItems.push({
      label: "Implementation focus",
      description: `${title} is documented as a composed pattern, so the examples below are the primary API surface.`,
    });
  }

  if (pageItems.length === 1 && previewBlocks.length > 0) {
    pageItems.push({
      label: "Variation points",
      description: "Compare layout, content density, and emphasis across the included examples before copying an implementation.",
    });
  }

  return pageItems.slice(0, 4);
}

function trimCodeExample(code) {
  if (!code) {
    return null;
  }

  const lines = code.trim().split("\n");
  const trimmed = lines.slice(0, 18).join("\n");
  return lines.length > 18 ? `${trimmed}\n// ...trimmed for docs` : trimmed;
}

function buildWhenToUse(title, summary, routePath) {
  const section = getSectionTitle(routePath);
  const lower = `${title} ${summary}`.toLowerCase();

  if (routePath.includes("/designer/") || routePath.includes("/blocks/")) {
    return [
      `Use ${title} when you need a composed screen-level pattern and want the structural decisions made before you tune the visuals.`,
      "Start from the example whose layout and information hierarchy already match the workflow you are building.",
      "Review the examples below to compare density, framing, and emphasis before copying one into production code.",
    ];
  }

  if (lower.includes("button")) {
    return [
      "Use buttons for explicit user-triggered actions such as submit, save, continue, or open.",
      "Choose the variant and size that matches the action hierarchy in the surrounding view.",
      "Prefer this page when you need to compare action density, icon usage, and loading or disabled states side by side.",
    ];
  }

  if (lower.match(/input|select|checkbox|radio|switch|combobox|calendar|date/)) {
    return [
      `Use ${title} when the user needs to enter or choose information as part of a larger form or workflow.`,
      "Start from this pattern when you need the interaction, spacing, and state treatment to match the rest of the system.",
      "Use the examples below to choose the least complex control that still communicates the user’s next step clearly.",
    ];
  }

  if (lower.match(/dialog|sheet|drawer|popover|tooltip|menu|command/)) {
    return [
      `Use ${title} when content needs to appear in context without forcing a full page transition.`,
      "Match the overlay type to the weight of the task: lightweight guidance for hints, stronger containment for focused tasks.",
      "Review the examples below to compare trigger styles, content density, and dismissal expectations.",
    ];
  }

  if (lower.match(/list|table|chart|grid|stat|feed|description/)) {
    return [
      `Use ${title} when information needs to be scanned quickly and compared across multiple rows, cards, or values.`,
      "Choose the example that best matches whether the user is browsing, monitoring, or drilling into structured data.",
      "Lean on these patterns when you want consistent spacing and hierarchy before tuning the visual treatment.",
    ];
  }

  return [
    `Use ${title} when you need a reusable ${section.toLowerCase()} pattern instead of rebuilding the structure from primitives.`,
    "Start from the simplest example that fits the task, then add decoration only when it clarifies meaning or hierarchy.",
    "Review the examples below to understand the tradeoffs between density, emphasis, and behavior.",
  ];
}

function buildWhenNotToUse(title, summary, routePath) {
  const lower = `${title} ${summary}`.toLowerCase();

  if (routePath.includes("/designer/") || routePath.includes("/blocks/")) {
    return [
      `Do not use ${title} when the page structure is still exploratory; start with smaller primitives if the workflow is not stable yet.`,
      "Do not copy a full-screen pattern unchanged when only one fragment of the layout is relevant to the task.",
    ];
  }

  if (lower.includes("button")) {
    return [
      "Do not use a button when plain text, static status, or passive decoration would communicate the state just as well.",
      "Do not overload a single view with too many equally prominent buttons; reduce or demote secondary actions first.",
    ];
  }

  if (lower.match(/input|select|checkbox|radio|switch|combobox|calendar|date/)) {
    return [
      "Do not introduce a heavier or more customizable control when a simpler native-style field is sufficient.",
      "Do not hide required context, validation, or option meaning behind placeholder text alone.",
    ];
  }

  if (lower.match(/dialog|sheet|drawer|popover|tooltip|menu|command/)) {
    return [
      "Do not move a full workflow into an overlay if the user needs persistent navigation, rich context, or deep editing space.",
      "Do not rely on an overlay for critical messaging when it can be missed, dismissed accidentally, or blocked by focus issues.",
    ];
  }

  if (lower.match(/list|table|chart|grid|stat|feed|description/)) {
    return [
      "Do not use a dense data pattern when the primary task is storytelling, onboarding, or one-off explanation.",
      "Do not flatten nuanced data into a compact summary card if the user still needs the underlying structure to make a decision.",
    ];
  }

  return [
    `Do not use ${title} just because it already exists in the catalog; choose the pattern that matches the task, not the most decorative option.`,
    "Do not keep layering options onto the pattern when a simpler component or section would be easier to understand and maintain.",
  ];
}

function buildCollectionIntro(routePath, title, summary, previewBlocks) {
  const sectionTitle = getSectionTitle(routePath);
  const previewCount = previewBlocks.length;

  if (routePath in SECTION_INTRO_OVERRIDES) {
    return SECTION_INTRO_OVERRIDES[routePath];
  }

  return [
    `${title} sits inside the ${sectionTitle} part of the catalog and collects reusable examples that solve the same job in different ways.`,
    previewCount > 0
      ? `This page currently groups ${previewCount} examples so you can compare structure, emphasis, and density before choosing an implementation direction.`
      : `Use the links on this page to move into the most relevant examples without scanning the entire catalog first.`,
  ];
}

function buildCollectionGrouping(routePath, previewBlocks, importantLinks) {
  const sectionTitle = getSectionTitle(routePath);
  const segments = routePath.split("/").filter(Boolean);

  if (previewBlocks.length > 0) {
    return [
      `The examples are grouped as a single ${sectionTitle} reference page so you can compare variations without leaving the route.`,
      "Use the jump links to move straight to the most relevant example once you know which structure, layout, or emphasis pattern you need.",
    ];
  }

  if (segments.length <= 1) {
    return [
      `The top-level ${sectionTitle} page groups the catalog by subcategory, making it easier to choose a family of patterns before drilling into an implementation.`,
      "Use the highlighted links below to start with the highest-signal areas of the section.",
    ];
  }

  return [
    `This page groups related ${sectionTitle.toLowerCase()} examples so teams can compare approaches without context switching across unrelated routes.`,
    "Use the related links below to move to the most important examples in the same family.",
  ];
}

function slugifyAnchor(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildImportantLinks(routePath, previewBlocks, source) {
  const segments = routePath.split("/").filter(Boolean);

  if (previewBlocks.length > 0) {
    return previewBlocks.slice(0, 8).map((block) => ({
      label: block.title,
      href: `#${slugifyAnchor(block.title)}`,
      description: block.description || undefined,
    }));
  }

  if (segments.length <= 1) {
    const prefix = routePath === "/" ? "/" : `${routePath}`;
    const links = extractSectionLinks(source, prefix);
    return links.slice(0, 8).map((link) => ({
      ...link,
      description: undefined,
    }));
  }

  return [];
}

function collectPageFiles(dir) {
  const pageFiles = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      pageFiles.push(...collectPageFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name === "page.tsx") {
      pageFiles.push(fullPath);
    }
  }
  return pageFiles;
}

function buildDocsForPage(pagePath) {
  const source = readFileSync(pagePath, "utf8");
  const routePath = toRoutePath(pagePath);
  const title = extractTitle(source, routePath);
  const summary = extractSummary(source);
  const previewBlocks = extractPreviewBlocks(source);
  const kind = inferDocKind(routePath, previewBlocks);
  const importantLinks = buildImportantLinks(routePath, previewBlocks, source);

  if (kind === "component") {
    const exampleCode =
      trimCodeExample(extractCodeExamples(source)[0]) ??
      trimCodeExample(resolveRawImportExamples(source, pagePath));

    return {
      accessibility: ACCESSIBILITY_GUIDES[inferAccessibilityKind(routePath, title, summary)],
      api: buildApiItems(routePath, title, source, previewBlocks),
      exampleCode,
      kind,
      path: routePath,
      summary,
      title,
      whenNotToUse: buildWhenNotToUse(title, summary, routePath),
      whenToUse: buildWhenToUse(title, summary, routePath),
    };
  }

  return {
    grouping: buildCollectionGrouping(routePath, previewBlocks, importantLinks),
    importantLinks,
    intro: buildCollectionIntro(routePath, title, summary, previewBlocks),
    kind,
    path: routePath,
    summary,
    title,
  };
}

function buildDocs() {
  const docs = {};
  for (const pagePath of collectPageFiles(APP_DIR)) {
    const doc = buildDocsForPage(pagePath);
    docs[doc.path] = doc;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const fileContents = `import type { CatalogPageDoc } from "../lib/catalog-docs";\n\nexport const pageDocs: Record<string, CatalogPageDoc> = ${JSON.stringify(
    docs,
    null,
    2,
  )};\n`;
  writeFileSync(OUT_FILE, fileContents);
  console.log(`docs: wrote ${Object.keys(docs).length} pages → ${OUT_FILE}`);
}

buildDocs();
