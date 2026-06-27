import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Download, RefreshCw, Upload } from "lucide-react";
import { Badge, DataTransferControls } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const scopeOptions = [
  { value: "visible", label: "Visible rows" },
  { value: "selected", label: "Selected rows" },
  { value: "all", label: "All records" },
];

const CODE = {
  controls: `import { DataTransferControls } from "@hilum/ui"
import { Download, Upload } from "lucide-react"

<DataTransferControls
  scopeValue={scope}
  onScopeChange={setScope}
  scopeOptions={[
    { value: "visible", label: "Visible rows" },
    { value: "selected", label: "Selected rows" },
    { value: "all", label: "All records" },
  ]}
  actions={[
    { label: "Import CSV", shortLabel: "Import", icon: <Upload />, onSelect: importCsv },
    { label: "Export CSV", shortLabel: "Export", icon: <Download />, onSelect: exportCsv },
  ]}
/>`,

  compact: `<DataTransferControls
  compact
  scopeValue={scope}
  onScopeChange={setScope}
  scopeOptions={scopeOptions}
  actions={actions}
/>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function DataTransferControlsPage() {
  const [scope, setScope] = React.useState("visible");
  const [lastAction, setLastAction] = React.useState("No action selected");
  const actions = [
    {
      label: "Import CSV",
      shortLabel: "Import",
      icon: <Upload aria-hidden="true" />,
      onSelect: () => setLastAction("Import CSV"),
    },
    {
      label: "Export CSV",
      shortLabel: "Export",
      icon: <Download aria-hidden="true" />,
      onSelect: () => setLastAction("Export CSV"),
    },
    {
      label: "Sync source",
      shortLabel: "Sync",
      icon: <RefreshCw aria-hidden="true" />,
      onSelect: () => setLastAction("Sync source"),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Data Transfer Controls</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Data Transfer Controls</h1>
        <p className="body max-w-lg text-ground-500">
          Import and export control cluster with optional scope selector and compact menu mode.
        </p>
      </div>

      <PageDocs path="/molecules/data-transfer-controls/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Toolbar" />
          <PreviewBlock
            title="Scoped actions"
            description="Pair import/export actions with a clear data scope."
            code={CODE.controls}
            previewClassName="flex-col items-stretch"
          >
            <div className="flex w-full flex-col gap-3">
              <DataTransferControls
                scopeValue={scope}
                onScopeChange={setScope}
                scopeOptions={scopeOptions}
                actions={actions}
              />
              <Badge variant="secondary" className="w-fit">
                {lastAction}
              </Badge>
            </div>
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Compact" />
          <PreviewBlock
            title="Compact menu"
            description="Collapse actions behind a menu when horizontal space is tight."
            code={CODE.compact}
            previewClassName="flex-col items-stretch"
          >
            <DataTransferControls
              compact
              scopeValue={scope}
              onScopeChange={setScope}
              scopeOptions={scopeOptions}
              actions={actions}
            />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/data-transfer-controls/")({
  head: () => createCatalogPageHead("/molecules/data-transfer-controls/"),
  component: DataTransferControlsPage,
});
