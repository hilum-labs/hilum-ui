import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TabsSubtle, TabsSubtleItem, TabsSubtlePanel } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { TabsSubtle, TabsSubtleItem, TabsSubtlePanel } from "@hilum/ui"

<TabsSubtle selectedIndex={selectedIndex} onSelect={setSelectedIndex}>
  <TabsSubtleItem index={0} label="Overview" />
  <TabsSubtleItem index={1} label="Activity" />
</TabsSubtle>`;

function TabsSubtlePage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const idPrefix = "tabs-subtle-demo";

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Tabs Subtle</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Quiet segmented tab navigation for compact product panels.
      </p>
      <PageDocs path="/atoms/tabs-subtle/" />
      <PreviewBlock title="Default" description="Subtle segmented tabs" code={CODE}>
        <TabsSubtle
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          idPrefix={idPrefix}
          className="w-fit"
        >
          <TabsSubtleItem index={0} label="Overview" />
          <TabsSubtleItem index={1} label="Activity" />
        </TabsSubtle>
        <div className="mt-4 w-80 rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <TabsSubtlePanel index={0} selectedIndex={selectedIndex} idPrefix={idPrefix}>
            Overview panel
          </TabsSubtlePanel>
          <TabsSubtlePanel index={1} selectedIndex={selectedIndex} idPrefix={idPrefix}>
            Activity panel
          </TabsSubtlePanel>
        </div>
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/atoms/tabs-subtle/")({
  head: () => createCatalogPageHead("/atoms/tabs-subtle/"),
  component: TabsSubtlePage,
});
