import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download } from "lucide-react";
import { MenuItem } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { MenuItem } from "@hilum/ui"
import { Copy } from "lucide-react"

<MenuItem icon={<Copy />}>Copy link</MenuItem>`;

function MenuItemPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Menu Item</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Reusable command row for menus, lists, and product navigation.
      </p>
      <PageDocs path="/atoms/menu-item/" />
      <PreviewBlock title="Default" description="Action rows with icons" code={CODE}>
        <div className="w-64 rounded-xl border border-border bg-card p-1 shadow-natural">
          <MenuItem icon={<Copy className="size-4" />}>Copy link</MenuItem>
          <MenuItem icon={<Download className="size-4" />} trailing="D">
            Download
          </MenuItem>
        </div>
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/atoms/menu-item/")({
  head: () => createCatalogPageHead("/atoms/menu-item/"),
  component: MenuItemPage,
});
