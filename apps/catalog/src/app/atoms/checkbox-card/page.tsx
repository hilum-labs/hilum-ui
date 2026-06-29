import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckboxCard } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const AUTOMATION_OPTIONS = [
  {
    id: "checkout",
    label: "Checkout recovery",
    description: "Send a reminder when a cart is abandoned before payment.",
  },
  {
    id: "lifecycle",
    label: "Lifecycle updates",
    description: "Notify customers when an order, fulfillment, or return changes state.",
  },
  {
    id: "restock",
    label: "Restock alerts",
    description: "Let shoppers know when a watched product becomes available again.",
  },
];

const CODE = `import { CheckboxCard } from "@hilum/ui"
import { useState } from "react"

function Example() {
  const [enabled, setEnabled] = useState(true)

  return (
    <CheckboxCard
      label="Checkout recovery"
      description="Send a reminder when a cart is abandoned before payment."
      checked={enabled}
      onCheckedChange={(value) => setEnabled(value === true)}
    />
  )
}`;

function CheckboxCardPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    checkout: true,
    lifecycle: true,
    restock: false,
  });

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Checkbox Card</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Checkbox Card</h1>
        <p className="body max-w-lg text-ground-500">
          Clickable card-style checkbox option for settings, filters, and compact binary choices.
        </p>
      </div>

      <PageDocs path="/atoms/checkbox-card/" />

      <PreviewBlock
        title="Settings options"
        description="Full-row target with label, description, and checkbox state"
        code={CODE}
        previewClassName="items-start"
      >
        <div className="grid w-full max-w-xl gap-2.5">
          {AUTOMATION_OPTIONS.map((option) => (
            <CheckboxCard
              key={option.id}
              label={option.label}
              description={option.description}
              checked={checked[option.id]}
              onCheckedChange={(value) =>
                setChecked((current) => ({ ...current, [option.id]: value === true }))
              }
            />
          ))}
        </div>
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/atoms/checkbox-card/")({
  head: () => createCatalogPageHead("/atoms/checkbox-card/"),
  component: CheckboxCardPage,
});
