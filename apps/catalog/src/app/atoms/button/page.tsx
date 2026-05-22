import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import {
  ArrowRight,
  Loader2,
  Mail,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  buttonVariants: `import { Button } from "@hilum/ui"

<Button>Default</Button>
<Button variant="brand">Brand</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>`,

  buttonSizes: `import { Button } from "@hilum/ui"

<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>`,

  buttonPill: `import { Button } from "@hilum/ui"

// Add rounded-full to get pill-shaped buttons
<Button className="rounded-full">Get started</Button>
<Button variant="outline" className="rounded-full">Contact sales</Button>
<Button variant="brand" className="rounded-full">Explore</Button>`,

  buttonIcons: `import { Button } from "@hilum/ui"
import { ArrowRight, Mail, Plus, Search, Settings } from "lucide-react"

<Button><Mail size={15} /> Send email</Button>
<Button variant="outline"><Search size={15} /> Search</Button>
<Button>Explore <ArrowRight size={15} /></Button>
<Button size="icon"><Plus /></Button>
<Button size="icon" variant="outline"><Settings /></Button>`,

  buttonStates: `import { Button } from "@hilum/ui"
import { Loader2 } from "lucide-react"

<Button disabled>Disabled</Button>
<Button variant="outline" disabled>Disabled outline</Button>

{/* Loading state */}
<Button>
  <Loader2 size={15} className="animate-spin" />
  Saving...
</Button>`,
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
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Button</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Button</h1>
        <p className="body max-w-lg text-ground-500">
          Triggers actions. Supports multiple variants, sizes, and icon compositions.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Button" />

        <PreviewBlock
          title="Variants"
          description="All available visual styles"
          code={CODE.buttonVariants}
        >
          <Button>Default</Button>
          <Button variant="brand">Brand</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </PreviewBlock>

        <PreviewBlock
          title="Sizes"
          description="xs · sm · default · lg"
          code={CODE.buttonSizes}
        >
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </PreviewBlock>

        <PreviewBlock
          title="Pill shape"
          description="rounded-full — the primary CTA style"
          code={CODE.buttonPill}
        >
          <Button className="rounded-full">Get started</Button>
          <Button variant="outline" className="rounded-full">
            Contact sales
          </Button>
          <Button variant="brand" className="rounded-full">
            Explore
          </Button>
        </PreviewBlock>

        <PreviewBlock
          title="With icons"
          description="Leading icons, trailing icons, icon-only"
          code={CODE.buttonIcons}
        >
          <Button>
            <Mail size={15} />
            Send email
          </Button>
          <Button variant="outline">
            <Search size={15} />
            Search
          </Button>
          <Button>
            Explore <ArrowRight size={15} />
          </Button>
          <Button size="icon">
            <Plus />
          </Button>
          <Button size="icon" variant="outline">
            <Settings />
          </Button>
        </PreviewBlock>

        <PreviewBlock
          title="States"
          description="Disabled, loading"
          code={CODE.buttonStates}
        >
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled outline
          </Button>
          <Button>
            <Loader2 size={15} className="animate-spin" />
            Saving...
          </Button>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/button/")({
  head: () => createCatalogPageHead("/atoms/button/"),
  component: ButtonPage,
});
