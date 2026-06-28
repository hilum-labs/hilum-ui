import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

function DropdownPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <PageDocs path="/atoms/dropdown/" />
    </div>
  );
}

export const Route = createFileRoute("/atoms/dropdown/")({
  head: () => createCatalogPageHead("/atoms/dropdown/"),
  component: DropdownPage,
});
