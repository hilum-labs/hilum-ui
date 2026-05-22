import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import { PreviewBlock } from "@/components/catalog/preview-block";
import SidebarShell from "@/components/blocks/app-shell-sidebar/sidebar-shell";
import sidebarShellSource from "@/components/blocks/app-shell-sidebar/sidebar-shell?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function AppShellSidebarPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/blocks" className="hover:text-ground-700">Blocks</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">App Shell · Sidebar</span>
        </div>
        <h1 className="display mb-2 text-ground-900">App Shell · Sidebar</h1>
        <p className="body max-w-md text-ground-400">
          A sidebar navigation shell with logo, nav links, and a user menu at the bottom. Responsive — sidebar collapses off-canvas on mobile.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Block</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Avatar · Badge · Dropdown Menu · Button</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="App Shell · Sidebar navigation" />
          <PreviewBlock
            title="Sidebar with user menu"
            description="Fixed left sidebar, collapsible on mobile, with a user dropdown"
            code={sidebarShellSource}
            previewClassName="p-0 bg-ground-50"
          >
            <SidebarShell />
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
