import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { ArrowRight, Loader, Plus, Search } from "lucide-react";
import { Button, ShapeProvider } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  buttonVariants: `import { Button } from "@hilum/ui"

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="ghost">Ghost</Button>
`,

  buttonSizes: `import { Button } from "@hilum/ui"
import { Plus } from "lucide-react"

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon-sm"><Plus /></Button>
<Button size="icon"><Plus /></Button>
<Button size="icon-lg"><Plus /></Button>`,

  buttonRadius: `import { Button, ShapeProvider } from "@hilum/ui"

{/* rounded is the default */}
<Button>Rounded</Button>

<ShapeProvider defaultShape="pill">
  <Button>Pill</Button>
</ShapeProvider>`,

  buttonIcons: `import { Button } from "@hilum/ui"
import { ArrowRight, Plus, Search } from "lucide-react"

<Button leadingIcon={Plus}>Create</Button>
<Button variant="secondary" trailingIcon={ArrowRight}>Next</Button>
<Button variant="tertiary" leadingIcon={Search} trailingIcon={ArrowRight}>
  Search
</Button>`,

  buttonStates: `import { Button } from "@hilum/ui"
import { Loader } from "lucide-react"

<Button loading>Loading</Button>
<Button variant="secondary" loading leadingIcon={Loader}>Saving</Button>
<Button disabled>Disabled</Button>
`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function ButtonPage() {
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
          <span className="font-semibold text-ground-900">Button</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Button</h1>
        <p className="body max-w-lg text-ground-500">
          Triggers actions. Supports multiple variants, sizes, and icon compositions.
        </p>
      </div>

      <PageDocs path="/atoms/button/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Button" />

        <PreviewBlock title="Variants" description="Fluid visual styles" code={CODE.buttonVariants}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="ghost">Ghost</Button>
        </PreviewBlock>

        <PreviewBlock title="Sizes" description="sm · md · lg · icon sizes" code={CODE.buttonSizes}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon-sm">
            <Plus />
          </Button>
          <Button size="icon">
            <Plus />
          </Button>
          <Button size="icon-lg">
            <Plus />
          </Button>
        </PreviewBlock>

        <PreviewBlock
          title="Radius modes"
          description="Rounded by default, pill via ShapeProvider"
          code={CODE.buttonRadius}
        >
          <Button>Rounded</Button>
          <ShapeProvider defaultShape="pill">
            <Button>Pill</Button>
          </ShapeProvider>
        </PreviewBlock>

        <PreviewBlock
          title="With icons"
          description="Leading and trailing icon slots"
          code={CODE.buttonIcons}
        >
          <Button leadingIcon={Plus}>Create</Button>
          <Button variant="secondary" trailingIcon={ArrowRight}>
            Next
          </Button>
          <Button variant="tertiary" leadingIcon={Search} trailingIcon={ArrowRight}>
            Search
          </Button>
        </PreviewBlock>

        <PreviewBlock
          title="Loading & Disabled"
          description="Built-in loading state"
          code={CODE.buttonStates}
        >
          <Button loading>Loading</Button>
          <Button variant="secondary" loading leadingIcon={Loader}>
            Saving
          </Button>
          <Button disabled>Disabled</Button>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/button/")({
  head: () => createCatalogPageHead("/atoms/button/"),
  component: ButtonPage,
});
