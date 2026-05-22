import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  single: `import { ToggleGroup, ToggleGroupItem } from "@hilum/ui"
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react"

<ToggleGroup type="single" defaultValue="left">
  <ToggleGroupItem value="left">
    <AlignLeft className="mr-2 h-4 w-4" />
    Left
  </ToggleGroupItem>
  <ToggleGroupItem value="center">
    <AlignCenter className="mr-2 h-4 w-4" />
    Center
  </ToggleGroupItem>
  <ToggleGroupItem value="right">
    <AlignRight className="mr-2 h-4 w-4" />
    Right
  </ToggleGroupItem>
  <ToggleGroupItem value="justify">
    <AlignJustify className="mr-2 h-4 w-4" />
    Justify
  </ToggleGroupItem>
</ToggleGroup>`,
  multiple: `import { ToggleGroup, ToggleGroupItem } from "@hilum/ui"
import { Bold, Italic, Underline } from "lucide-react"

<ToggleGroup type="multiple">
  <ToggleGroupItem value="bold">
    <Bold className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="italic">
    <Italic className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="underline">
    <Underline className="h-4 w-4" />
  </ToggleGroupItem>
</ToggleGroup>`,
  icon: `import { ToggleGroup, ToggleGroupItem } from "@hilum/ui"
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react"

<ToggleGroup type="single" defaultValue="left">
  <ToggleGroupItem value="left" size="icon">
    <AlignLeft className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="center" size="icon">
    <AlignCenter className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="right" size="icon">
    <AlignRight className="h-4 w-4" />
  </ToggleGroupItem>
</ToggleGroup>`,
  outline: `<ToggleGroup type="multiple" variant="outline">
  <ToggleGroupItem value="bold">
    <Bold className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="italic">
    <Italic className="h-4 w-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="underline">
    <Underline className="h-4 w-4" />
  </ToggleGroupItem>
</ToggleGroup>`,
  brand: `<ToggleGroup type="single" variant="brand" defaultValue="md">
  <ToggleGroupItem value="sm">S</ToggleGroupItem>
  <ToggleGroupItem value="md">M</ToggleGroupItem>
  <ToggleGroupItem value="lg">L</ToggleGroupItem>
</ToggleGroup>`,
  sizes: `<ToggleGroup type="single" size="sm" defaultValue="day">
  <ToggleGroupItem value="day">Day</ToggleGroupItem>
  <ToggleGroupItem value="week">Week</ToggleGroupItem>
  <ToggleGroupItem value="month">Month</ToggleGroupItem>
</ToggleGroup>

<ToggleGroup type="single" defaultValue="day">
  <ToggleGroupItem value="day">Day</ToggleGroupItem>
  <ToggleGroupItem value="week">Week</ToggleGroupItem>
  <ToggleGroupItem value="month">Month</ToggleGroupItem>
</ToggleGroup>

<ToggleGroup type="single" size="lg" defaultValue="day">
  <ToggleGroupItem value="day">Day</ToggleGroupItem>
  <ToggleGroupItem value="week">Week</ToggleGroupItem>
  <ToggleGroupItem value="month">Month</ToggleGroupItem>
</ToggleGroup>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function ToggleGroupPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Toggle Group</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Toggle Group</h1>
        <p className="body max-w-lg text-ground-500">
          A set of two-state buttons where one or multiple can be active simultaneously — used for text formatting and view switching.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Variants" />

        <PreviewBlock
          title="Single selection"
          description="Text alignment with icon and label"
          code={CODE.single}
        >
          <ToggleGroup type="single" defaultValue="left">
            <ToggleGroupItem value="left">
              <AlignLeft className="mr-2 h-4 w-4" />
              Left
            </ToggleGroupItem>
            <ToggleGroupItem value="center">
              <AlignCenter className="mr-2 h-4 w-4" />
              Center
            </ToggleGroupItem>
            <ToggleGroupItem value="right">
              <AlignRight className="mr-2 h-4 w-4" />
              Right
            </ToggleGroupItem>
            <ToggleGroupItem value="justify">
              <AlignJustify className="mr-2 h-4 w-4" />
              Justify
            </ToggleGroupItem>
          </ToggleGroup>
        </PreviewBlock>

        <PreviewBlock
          title="Multiple selection"
          description="Text formatting options with icons"
          code={CODE.multiple}
        >
          <ToggleGroup type="multiple">
            <ToggleGroupItem value="bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </PreviewBlock>

        <PreviewBlock
          title="Icon only"
          description="Icon buttons for alignment selection"
          code={CODE.icon}
        >
          <ToggleGroup type="single" defaultValue="left">
            <ToggleGroupItem value="left" size="icon">
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" size="icon">
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" size="icon">
              <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </PreviewBlock>

        <PreviewBlock
          title="Outline variant"
          description="Text formatting with outline style"
          code={CODE.outline}
        >
          <ToggleGroup type="multiple" variant="outline">
            <ToggleGroupItem value="bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </PreviewBlock>

        <PreviewBlock
          title="Brand variant"
          description="Size selection with brand orange styling"
          code={CODE.brand}
        >
          <ToggleGroup type="single" variant="brand" defaultValue="md">
            <ToggleGroupItem value="sm">S</ToggleGroupItem>
            <ToggleGroupItem value="md">M</ToggleGroupItem>
            <ToggleGroupItem value="lg">L</ToggleGroupItem>
          </ToggleGroup>
        </PreviewBlock>

        <SectionHeading label="Sizes" />

        <PreviewBlock
          title="Size options"
          description="Small, default, and large sizes"
          code={CODE.sizes}
          previewClassName="flex-col gap-6"
        >
          <ToggleGroup type="single" size="sm" defaultValue="day">
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>

          <ToggleGroup type="single" defaultValue="day">
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>

          <ToggleGroup type="single" size="lg" defaultValue="day">
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/toggle-group/")({
  head: () => createCatalogPageHead("/atoms/toggle-group/"),
  component: ToggleGroupPage,
});
