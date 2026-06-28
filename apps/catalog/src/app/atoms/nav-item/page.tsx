import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban } from "lucide-react";
import { NavItem } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { NavItem } from "@hilum/ui"
import { FolderKanban } from "lucide-react"

<NavItem href="#" active icon={<FolderKanban />}>
  Projects
</NavItem>`;

function NavItemPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Nav Item</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Single navigation row with icon, active state, and trailing content.
      </p>
      <PageDocs path="/atoms/nav-item/" />
      <PreviewBlock title="Default" description="Product navigation row" code={CODE}>
        <div className="w-64">
          <NavItem href="#" active icon={<FolderKanban className="size-4" />}>
            Projects
          </NavItem>
        </div>
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/atoms/nav-item/")({
  head: () => createCatalogPageHead("/atoms/nav-item/"),
  component: NavItemPage,
});
