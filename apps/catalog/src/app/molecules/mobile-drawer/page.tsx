import { createFileRoute } from "@tanstack/react-router";
import { MobileDrawer, NavItem } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { MobileDrawer, NavItem } from "@hilum/ui"

<MobileDrawer title="Menu">
  <NavItem href="#">Dashboard</NavItem>
</MobileDrawer>`;

function MobileDrawerPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Mobile Drawer</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Mobile navigation drawer wrapper with trigger, sheet content, and title.
      </p>
      <PageDocs path="/molecules/mobile-drawer/" />
      <PreviewBlock title="Default" description="Off-canvas mobile menu" code={CODE}>
        <MobileDrawer title="Menu" description="Navigation">
          <div className="grid gap-1">
            <NavItem href="#">Dashboard</NavItem>
            <NavItem href="#">Settings</NavItem>
          </div>
        </MobileDrawer>
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/molecules/mobile-drawer/")({
  head: () => createCatalogPageHead("/molecules/mobile-drawer/"),
  component: MobileDrawerPage,
});
