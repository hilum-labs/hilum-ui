import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { PreviewBlock } from "@/components/catalog/preview-block";
import SidebarShell from "@/components/blocks/app-shell-sidebar/sidebar-shell";
import sidebarShellSource from "@/components/blocks/app-shell-sidebar/sidebar-shell?raw";
import AppFrameShell from "@/components/blocks/app-shell-sidebar/app-frame-shell";
import appFrameShellSource from "@/components/blocks/app-shell-sidebar/app-frame-shell?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function AppShellSidebarPage() {
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
          <span className="body font-semibold text-foreground">App Shell · Sidebar</span>
        </div>
        <h1 className="display mb-2 text-foreground">App Shell · Sidebar</h1>
        <p className="body max-w-md text-muted-foreground">
          A sidebar navigation shell with logo, nav links, and a user menu at the bottom. Responsive
          — sidebar collapses off-canvas on mobile.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-border pt-5">
          <p className="caption text-muted-foreground">Block</p>
          <div className="h-3 w-px bg-border" />
          <p className="caption text-muted-foreground">Avatar · Badge · Dropdown Menu · Button</p>
        </div>
      </div>

      <PageDocs path="/blocks/app-shell-sidebar/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="App Shell · Sidebar navigation" />
          <PreviewBlock
            title="Sidebar with user menu"
            description="Fixed left sidebar, collapsible on mobile, with a user dropdown"
            code={sidebarShellSource}
            previewClassName="p-0 bg-muted"
          >
            <SidebarShell />
          </PreviewBlock>
        </div>
        <div>
          <SectionHeading label="@hilum/app-shell · App frame" />
          <PreviewBlock
            title="AppShell with nested navigation"
            description="Skip link, <main> landmark, collapsible nested sidebar items, header search slot, global loading bar, mobile drawer navigation, and a page header whose secondary actions overflow into “More actions”"
            code={appFrameShellSource}
            previewClassName="p-0 bg-muted"
          >
            <AppFrameShell />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/blocks/app-shell-sidebar/")({
  head: () => createCatalogPageHead("/blocks/app-shell-sidebar/"),
  component: AppShellSidebarPage,
});
