import type { ReactNode } from "react";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "@hilum/ui";
import { Sidebar } from "@/components/catalog/sidebar";
import appCss from "../styles/globals.css?url";

const SITE_URL = "https://ui.hilum.dev";
const ORGANIZATION_NAME = "Hilum Labs";
const REPOSITORY_URL = "https://github.com/hilum-labs/hilum-ui";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Hilum UI",
      url: SITE_URL,
      description: "Hilum UI design system documentation, component catalog, and theming reference.",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: ORGANIZATION_NAME,
      url: SITE_URL,
      sameAs: [REPOSITORY_URL],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Hilum UI",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      description: "Hilum UI design system documentation, component catalog, and theming reference.",
      url: SITE_URL,
      codeRepository: REPOSITORY_URL,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  ],
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "application-name", content: "Hilum UI" },
      { name: "author", content: ORGANIZATION_NAME },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:site_name", content: "Hilum UI" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(structuredData),
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="flex min-h-screen bg-white text-ground-900 antialiased">
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
          <Toaster />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
