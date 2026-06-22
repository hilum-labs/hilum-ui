import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { useState } from "react";
import {
  DesignerPane,
  DesignerPaneTitle,
  DesignerPaneContent,
  DesignerPanel,
  ShellProvider,
} from "@hilum/designer";
import { Badge, Button, Card, CardContent, Input } from "@hilum/ui";

const KINDS = [
  { id: "text-1", kind: "text", label: "Text" },
  { id: "image-1", kind: "image", label: "Image" },
  { id: "shape-1", kind: "shape", label: "Shape" },
  { id: "group-1", kind: "group", label: "Group" },
];

function PaneVisibilityDemo() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Build a kind resolver from the local KINDS table.
  const resolveKind = (id: string) => KINDS.find((k) => k.id === id)?.kind;

  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <div className="mb-10">
        <h1 className="display text-ground-900">DesignerPane.showFor</h1>
        <p className="body-lg text-ground-500 mt-3 max-w-2xl">
          Click below to "select" different kinds. The properties panel on the right rerenders only
          the panes whose{" "}
          <code className="font-mono caption bg-ground-50 px-1.5 py-0.5 rounded">showFor</code>{" "}
          predicate matches. The shell itself doesn't know about layer kinds — apps wire a{" "}
          <code className="font-mono caption bg-ground-50 px-1.5 py-0.5 rounded">resolveKind</code>{" "}
          function on <code className="font-mono caption">ShellContext</code>.
        </p>
      </div>

      <PageDocs path="/designer/pane-visibility/" />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-3">
          <p className="caption-xs uppercase tracking-wider font-semibold text-ground-400">
            Click to select
          </p>
          <div className="grid grid-cols-2 gap-2">
            {KINDS.map((k) => {
              const selected = selectedIds.includes(k.id);
              return (
                <button
                  key={k.id}
                  onClick={() =>
                    setSelectedIds((prev) =>
                      prev.includes(k.id) ? prev.filter((id) => id !== k.id) : [...prev, k.id],
                    )
                  }
                  className={`flex items-center justify-between rounded-md border px-3 py-2 caption transition-colors ${
                    selected
                      ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                      : "border-ground-200 text-ground-700 hover:bg-ground-50"
                  }`}
                >
                  <span className="font-medium">{k.label}</span>
                  <Badge
                    variant={selected ? "default" : "secondary"}
                    className="caption-xs font-mono"
                  >
                    {k.kind}
                  </Badge>
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setSelectedIds([])}>
              Clear selection
            </Button>
          </div>
        </div>

        <div className="col-span-1">
          <Card>
            <CardContent className="p-0">
              <ShellProvider value={{ selectedIds, setSelectedIds, resolveKind }}>
                <DesignerPanel
                  side="right"
                  width={undefined as unknown as number}
                  bordered={false}
                  className="w-full"
                >
                  <DesignerPane showFor={["text"]} collapsible>
                    <DesignerPaneTitle>Typography</DesignerPaneTitle>
                    <DesignerPaneContent>
                      <Input placeholder="Font family" />
                    </DesignerPaneContent>
                  </DesignerPane>

                  <DesignerPane showFor={["image"]} collapsible>
                    <DesignerPaneTitle>Image</DesignerPaneTitle>
                    <DesignerPaneContent>
                      <Input placeholder="Image URL" />
                    </DesignerPaneContent>
                  </DesignerPane>

                  <DesignerPane showFor={["shape", "image"]} collapsible>
                    <DesignerPaneTitle>Fill</DesignerPaneTitle>
                    <DesignerPaneContent>
                      <Input placeholder="Color" />
                    </DesignerPaneContent>
                  </DesignerPane>

                  <DesignerPane showFor={["group"]} collapsible>
                    <DesignerPaneTitle>Group</DesignerPaneTitle>
                    <DesignerPaneContent>
                      <p className="caption text-ground-500">{selectedIds.length} item(s)</p>
                    </DesignerPaneContent>
                  </DesignerPane>

                  <DesignerPane collapsible>
                    <DesignerPaneTitle>Always</DesignerPaneTitle>
                    <DesignerPaneContent>
                      <p className="caption text-ground-500">No showFor — visible regardless.</p>
                    </DesignerPaneContent>
                  </DesignerPane>
                </DesignerPanel>
              </ShellProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/designer/pane-visibility/")({
  head: () => createCatalogPageHead("/designer/pane-visibility/"),
  component: PaneVisibilityDemo,
});
