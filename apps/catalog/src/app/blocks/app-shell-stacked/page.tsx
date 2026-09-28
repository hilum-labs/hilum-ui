import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { PreviewBlock } from "@/components/catalog/preview-block";
import StackedShell from "@/components/blocks/app-shell-stacked/stacked-shell";
import stackedShellSource from "@/components/blocks/app-shell-stacked/stacked-shell?raw";
import AppFrameStacked from "@/components/blocks/app-shell-stacked/app-frame-stacked";
import appFrameStackedSource from "@/components/blocks/app-shell-stacked/app-frame-stacked?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function AppShellStackedPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/blocks" className="hover:text-foreground">
            Blocks
          </a>
          <span>/</span>
          <span className="body font-semibold text-foreground">App Shell · Stacked</span>
        </div>
        <h1 className="display mb-2 text-foreground">App Shell · Stacked</h1>
        <p className="body max-w-md text-muted-foreground">
          A top-navigation shell with logo, nav links, notification bell, and a user menu. Collapses
          to a hamburger on mobile.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-border pt-5">
          <p className="caption text-muted-foreground">Block</p>
          <div className="h-3 w-px bg-border" />
          <p className="caption text-muted-foreground">Avatar · Badge · Dropdown Menu · Button</p>
        </div>
      </div>

      <PageDocs path="/blocks/app-shell-stacked/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="App Shell · Stacked navigation" />
          <PreviewBlock
            title="Top navbar with user menu"
            description="Horizontal nav with responsive mobile collapse"
            code={stackedShellSource}
            previewClassName="p-0 bg-muted"
          >
            <StackedShell />
          </PreviewBlock>
        </div>
        <div>
          <SectionHeading label="@hilum/app-shell · Stacked frame" />
          <PreviewBlock
            title="AppShellStacked with mobile menu"
            description="Navbar links collapse into a menu sheet below md; search slot, skip link and <main> come from the frame"
            code={appFrameStackedSource}
            previewClassName="p-0 bg-muted"
          >
            <AppFrameStacked />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/blocks/app-shell-stacked/")({
  head: () => createCatalogPageHead("/blocks/app-shell-stacked/"),
  component: AppShellStackedPage,
});
