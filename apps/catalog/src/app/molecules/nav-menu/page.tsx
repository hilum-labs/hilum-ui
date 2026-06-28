import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban, Settings } from "lucide-react";
import { NavMenu } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { NavMenu } from "@hilum/ui"

<NavMenu items={[{ href: "#", label: "Projects", active: true }]} />`;

function NavMenuPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Nav Menu</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Vertical navigation list with proximity-aware row activation.
      </p>
      <PageDocs path="/molecules/nav-menu/" />
      <PreviewBlock title="Default" description="Vertical product navigation" code={CODE}>
        <div className="w-64">
          <NavMenu
            items={[
              {
                href: "#",
                label: "Projects",
                active: true,
                icon: <FolderKanban className="size-4" />,
              },
              { href: "#", label: "Settings", icon: <Settings className="size-4" /> },
            ]}
          />
        </div>
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/molecules/nav-menu/")({
  head: () => createCatalogPageHead("/molecules/nav-menu/"),
  component: NavMenuPage,
});
