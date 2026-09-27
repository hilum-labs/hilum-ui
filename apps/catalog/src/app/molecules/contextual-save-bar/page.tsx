import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { ContextualSaveBar, Field, Input, useUnsavedChangesWarning } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { ContextualSaveBar, useUnsavedChangesWarning } from "@hilum/ui"

const [saved, setSaved] = useState("Linen shirt")
const [title, setTitle] = useState(saved)
const dirty = title !== saved
useUnsavedChangesWarning(dirty)

<Input value={title} onChange={(e) => setTitle(e.target.value)} />
<ContextualSaveBar
  open={dirty}
  position="sticky"
  onDiscard={() => setTitle(saved)}
  onSave={() => setSaved(title)}
/>`,

  form: `// Wire Save to a <form> so native validation still runs.
<form id="product-form" onSubmit={handleSubmit}>…</form>
<ContextualSaveBar open={isDirty} formId="product-form" saving={isSubmitting} onDiscard={reset} />

// Full-page edit screens: position="fixed" (default) pins it to the top on
// desktop and to the bottom on mobile for thumb reach. ⌘S / Ctrl+S saves.`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function Demo() {
  const [saved, setSaved] = useState("Linen shirt");
  const [title, setTitle] = useState(saved);
  const [saving, setSaving] = useState(false);
  const dirty = title !== saved;
  useUnsavedChangesWarning(dirty);

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <ContextualSaveBar
        open={dirty}
        position="sticky"
        saving={saving}
        onDiscard={() => setTitle(saved)}
        onSave={() => {
          setSaving(true);
          window.setTimeout(() => {
            setSaved(title);
            setSaving(false);
          }, 600);
        }}
      />
      <Field label="Product title">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} />
      </Field>
    </div>
  );
}

function ContextualSaveBarPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-foreground">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Contextual Save Bar</span>
        </div>
        <h1 className="display mb-2 text-foreground">Contextual Save Bar</h1>
        <p className="body max-w-lg text-muted-foreground">
          Unsaved-changes strip with Save and Discard for edit screens. Replaces per-card save
          buttons, binds ⌘S / Ctrl+S, and pairs with useUnsavedChangesWarning to guard reloads.
        </p>
      </div>

      <PageDocs path="/molecules/contextual-save-bar/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Dirty tracking" />
          <PreviewBlock
            title="Edit to reveal the bar"
            description="The bar appears only while the form differs from its saved state."
            code={CODE.basic}
          >
            <Demo />
          </PreviewBlock>
        </section>
        <section>
          <SectionHeading label="Forms and placement" />
          <PreviewBlock
            title="Submit a form by id"
            description="Use formId for react-hook-form / native forms; fixed placement for full-page editors."
            code={CODE.form}
          >
            <p className="body text-muted-foreground">See code.</p>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/contextual-save-bar/")({
  head: () => createCatalogPageHead("/molecules/contextual-save-bar/"),
  component: ContextualSaveBarPage,
});
