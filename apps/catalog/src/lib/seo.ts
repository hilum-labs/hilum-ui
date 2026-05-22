const SITE_URL = "https://ui.hilum.dev";
const SITE_NAME = "Hilum UI";
const SITE_DESCRIPTION = "Hilum UI design system documentation, component catalog, and theming reference.";
const ORGANIZATION_NAME = "Hilum Labs";

const SECTION_METADATA: Record<string, { title: string; description: string; type: string }> = {
  "application-ui": {
    title: "Application UI",
    description: "Application UI patterns for shells, forms, navigation, lists, overlays, and page layouts in Hilum UI.",
    type: "CollectionPage",
  },
  atoms: {
    title: "Atoms",
    description: "Primitive Hilum UI components including buttons, inputs, dialogs, tables, charts, and navigation elements.",
    type: "CollectionPage",
  },
  blocks: {
    title: "Blocks",
    description: "Reusable Hilum UI application blocks for sign-in flows, app shells, form layouts, and full-screen patterns.",
    type: "CollectionPage",
  },
  designer: {
    title: "Designer",
    description: "Designer workflows and canvas primitives for composing interfaces with the Hilum UI system.",
    type: "CollectionPage",
  },
  ecommerce: {
    title: "Ecommerce",
    description: "Ecommerce storefront, merchandising, checkout, and order-management patterns built with Hilum UI.",
    type: "CollectionPage",
  },
  foundations: {
    title: "Foundations",
    description: "Hilum UI foundations covering color, typography, spacing, radius, and elevation tokens.",
    type: "CollectionPage",
  },
  marketing: {
    title: "Marketing",
    description: "Marketing sections for landing pages, pricing, testimonials, FAQs, headers, and footers in Hilum UI.",
    type: "CollectionPage",
  },
  molecules: {
    title: "Molecules",
    description: "Composed Hilum UI patterns including fields, input groups, lists, notifications, and command surfaces.",
    type: "CollectionPage",
  },
  theming: {
    title: "Theming",
    description: "Hilum UI theming reference for brand tokens, generated palettes, and per-product customization.",
    type: "CollectionPage",
  },
};

function normalizePath(path: string) {
  if (path === "/") {
    return "/";
  }

  return path.endsWith("/") ? path : `${path}/`;
}

function titleFromSegment(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bUi\b/g, "UI");
}

function getSegments(path: string) {
  return normalizePath(path).split("/").filter(Boolean);
}

function getSectionKey(path: string) {
  return getSegments(path)[0] ?? "";
}

function getSectionMetadata(path: string) {
  const sectionKey = getSectionKey(path);
  return SECTION_METADATA[sectionKey];
}

function getPageTitle(path: string) {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === "/") {
    return `Design System | ${SITE_NAME}`;
  }

  const segments = getSegments(normalizedPath);
  const section = getSectionMetadata(normalizedPath);

  if (segments.length === 1 && section) {
    return `${section.title} | ${SITE_NAME}`;
  }

  const pageTitle = titleFromSegment(segments.at(-1) ?? "");
  const sectionTitle = section?.title ?? titleFromSegment(segments[0] ?? "");

  return `${pageTitle} | ${sectionTitle} | ${SITE_NAME}`;
}

function getPageDescription(path: string) {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === "/") {
    return SITE_DESCRIPTION;
  }

  const segments = getSegments(normalizedPath);
  const section = getSectionMetadata(normalizedPath);
  const sectionTitle = section?.title ?? titleFromSegment(segments[0] ?? "");

  if (segments.length === 1 && section) {
    return section.description;
  }

  const pageTitle = titleFromSegment(segments.at(-1) ?? "");

  switch (segments[0]) {
    case "atoms":
      return `${pageTitle} component examples, usage patterns, and implementation guidance in the ${sectionTitle} section of ${SITE_NAME}.`;
    case "molecules":
      return `${pageTitle} composed pattern examples, layout guidance, and UI behavior reference in ${SITE_NAME} ${sectionTitle}.`;
    case "blocks":
      return `${pageTitle} application block examples and reusable layout patterns in the ${SITE_NAME} ${sectionTitle} catalog.`;
    case "marketing":
      return `${pageTitle} landing-page section examples and reusable marketing layouts in the ${SITE_NAME} ${sectionTitle} library.`;
    case "ecommerce":
      return `${pageTitle} ecommerce UI examples and storefront workflow patterns in the ${SITE_NAME} ${sectionTitle} catalog.`;
    case "application-ui":
      return `${pageTitle} application interface patterns and implementation examples in the ${SITE_NAME} ${sectionTitle} reference.`;
    case "designer":
      return `${pageTitle} designer workflow reference and interface composition guidance in ${SITE_NAME}.`;
    default:
      return `${pageTitle} reference documentation in the ${sectionTitle} section of ${SITE_NAME}.`;
  }
}

function getCanonicalUrl(path: string) {
  const normalizedPath = normalizePath(path);
  return new URL(normalizedPath, SITE_URL).toString();
}

function getStructuredPageType(path: string) {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === "/") {
    return "WebPage";
  }

  return getSegments(normalizedPath).length === 1 ? "CollectionPage" : "TechArticle";
}

function getBreadcrumbItems(path: string) {
  const normalizedPath = normalizePath(path);
  const segments = getSegments(normalizedPath);

  if (segments.length === 0) {
    return [];
  }

  return [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    ...segments.map((segment, index) => {
      const pathSegments = segments.slice(0, index + 1);
      const currentPath = `/${pathSegments.join("/")}/`;
      const isTopLevel = index === 0;
      const name = isTopLevel
        ? (SECTION_METADATA[segment]?.title ?? titleFromSegment(segment))
        : titleFromSegment(segment);

      return {
        "@type": "ListItem",
        position: index + 2,
        name,
        item: getCanonicalUrl(currentPath),
      };
    }),
  ];
}

function getStructuredData(path: string) {
  const normalizedPath = normalizePath(path);
  const title = getPageTitle(normalizedPath);
  const description = getPageDescription(normalizedPath);
  const canonicalUrl = getCanonicalUrl(normalizedPath);
  const pageType = getStructuredPageType(normalizedPath);
  const breadcrumbs = getBreadcrumbItems(normalizedPath);

  const pageObject = {
    "@context": "https://schema.org",
    "@type": pageType,
    name: title,
    headline: title,
    description,
    url: canonicalUrl,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      url: SITE_URL,
    },
  };

  if (breadcrumbs.length === 0) {
    return [pageObject];
  }

  return [
    pageObject,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs,
    },
  ];
}

export function createCatalogPageHead(path: string) {
  const normalizedPath = normalizePath(path);
  const title = getPageTitle(normalizedPath);
  const description = getPageDescription(normalizedPath);
  const canonicalUrl = getCanonicalUrl(normalizedPath);
  const pageType = getStructuredPageType(normalizedPath);
  const section = getSectionMetadata(normalizedPath);
  const isLeafPage = getSegments(normalizedPath).length > 1;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonicalUrl },
      { property: "og:type", content: isLeafPage ? "article" : "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(section && isLeafPage ? [{ property: "article:section", content: section.title }] : []),
      { name: "docsearch:page:type", content: pageType },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(getStructuredData(normalizedPath)),
      },
    ],
  };
}
