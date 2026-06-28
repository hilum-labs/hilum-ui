import { createFileRoute } from "@tanstack/react-router";
import { CheckboxGroup } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { CheckboxGroup } from "@hilum/ui"

<CheckboxGroup
  options={[
    { value: "analytics", label: "Analytics" },
    { value: "exports", label: "Exports" },
    { value: "automations", label: "Automations" },
  ]}
  defaultValue={["analytics"]}
/>`;

function CheckboxGroupPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Checkbox Group</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Grouped multi-select options with product-style row highlighting.
      </p>
      <PageDocs path="/atoms/checkbox-group/" />
      <PreviewBlock title="Default" description="Grouped multi-select rows" code={CODE}>
        <CheckboxGroup
          className="w-80"
          options={[
            { value: "analytics", label: "Analytics" },
            { value: "exports", label: "Exports" },
            { value: "automations", label: "Automations" },
          ]}
          defaultValue={["analytics"]}
        />
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/atoms/checkbox-group/")({
  head: () => createCatalogPageHead("/atoms/checkbox-group/"),
  component: CheckboxGroupPage,
});
