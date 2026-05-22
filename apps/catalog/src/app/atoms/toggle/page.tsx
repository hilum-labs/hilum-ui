import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import { Bold, Italic, Underline } from "lucide-react";
import { Toggle } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  default: `import { Toggle } from "@hilum/ui"

<Toggle>Bold</Toggle>
<Toggle>Italic</Toggle>
<Toggle defaultPressed>Underline</Toggle>`,

  outline: `<Toggle variant="outline">Bold</Toggle>
<Toggle variant="outline">Italic</Toggle>
<Toggle variant="outline">Underline</Toggle>`,

  brand: `<Toggle variant="brand">Bold</Toggle>
<Toggle variant="brand">Italic</Toggle>
<Toggle variant="brand">Underline</Toggle>`,

  withIcons: `import { Bold, Italic, Underline } from "lucide-react"

{/* Default icon toggles */}
<Toggle size="icon"><Bold size={16} /></Toggle>
<Toggle size="icon"><Italic size={16} /></Toggle>
<Toggle size="icon"><Underline size={16} /></Toggle>

{/* Outline icon toggles */}
<Toggle variant="outline" size="icon"><Bold size={16} /></Toggle>
<Toggle variant="outline" size="icon"><Italic size={16} /></Toggle>
<Toggle variant="outline" size="icon"><Underline size={16} /></Toggle>`,

  sizes: `<Toggle size="sm">Format</Toggle>
<Toggle>Format</Toggle>
<Toggle size="lg">Format</Toggle>`,

  disabled: `<Toggle disabled>Bold</Toggle>
<Toggle disabled defaultPressed>Underline</Toggle>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function TogglePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Toggle</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Toggle</h1>
        <p className="body max-w-lg text-ground-500">
          A two-state button that switches between pressed and unpressed — used in toolbars and filter controls.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Toggle" />

        <PreviewBlock
          title="Default"
          description="Standard toggle with text label"
          code={CODE.default}
        >
          <Toggle>Bold</Toggle>
          <Toggle>Italic</Toggle>
          <Toggle defaultPressed>Underline</Toggle>
        </PreviewBlock>

        <PreviewBlock
          title="Outline"
          description="With border and background"
          code={CODE.outline}
        >
          <Toggle variant="outline">Bold</Toggle>
          <Toggle variant="outline">Italic</Toggle>
          <Toggle variant="outline">Underline</Toggle>
        </PreviewBlock>

        <PreviewBlock
          title="Brand"
          description="Active state uses brand-primary fill"
          code={CODE.brand}
        >
          <Toggle variant="brand">Bold</Toggle>
          <Toggle variant="brand">Italic</Toggle>
          <Toggle variant="brand" defaultPressed>Underline</Toggle>
        </PreviewBlock>

        <PreviewBlock
          title="With icons"
          description="Icon-only · default and outline"
          code={CODE.withIcons}
        >
          <Toggle size="icon"><Bold size={16} /></Toggle>
          <Toggle size="icon"><Italic size={16} /></Toggle>
          <Toggle size="icon" defaultPressed><Underline size={16} /></Toggle>
          <Toggle variant="outline" size="icon"><Bold size={16} /></Toggle>
          <Toggle variant="outline" size="icon"><Italic size={16} /></Toggle>
          <Toggle variant="outline" size="icon"><Underline size={16} /></Toggle>
        </PreviewBlock>

        <PreviewBlock
          title="Sizes"
          description="sm · default · lg"
          code={CODE.sizes}
        >
          <Toggle size="sm">Format</Toggle>
          <Toggle>Format</Toggle>
          <Toggle size="lg">Format</Toggle>
        </PreviewBlock>

        <PreviewBlock
          title="Disabled"
          description="Disabled unpressed and pressed states"
          code={CODE.disabled}
        >
          <Toggle disabled>Bold</Toggle>
          <Toggle disabled defaultPressed>Underline</Toggle>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/toggle/")({
  head: () => createCatalogPageHead("/atoms/toggle/"),
  component: TogglePage,
});
