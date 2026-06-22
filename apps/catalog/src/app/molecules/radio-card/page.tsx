import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { useState } from "react";
import { Zap, Shield, Globe } from "lucide-react";
import { RadioCards } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const MAILING_LISTS = [
  {
    value: "newsletter",
    label: "Newsletter",
    description: "Last sent an hour ago",
    meta: "621 subscribers",
  },
  {
    value: "customers",
    label: "Existing Customers",
    description: "Last sent 2 weeks ago",
    meta: "1,200 subscribers",
  },
  {
    value: "trial",
    label: "Trial Users",
    description: "Last sent 4 days ago",
    meta: "2,740 subscribers",
  },
];

const PLANS = [
  {
    value: "starter",
    label: "Starter",
    description: "Perfect for small projects",
    meta: "$9 / month",
    icon: <Zap size={18} />,
  },
  {
    value: "pro",
    label: "Pro",
    description: "For growing teams",
    meta: "$29 / month",
    icon: <Shield size={18} />,
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Unlimited everything",
    meta: "$99 / month",
    icon: <Globe size={18} />,
  },
];

const CODE = {
  basic: `import { RadioCards } from "@hilum/ui"

const options = [
  { value: "newsletter", label: "Newsletter", description: "Last sent an hour ago", meta: "621 subscribers" },
  { value: "customers", label: "Existing Customers", description: "Last sent 2 weeks ago", meta: "1,200 subscribers" },
  { value: "trial", label: "Trial Users", description: "Last sent 4 days ago", meta: "2,740 subscribers" },
]

function Example() {
  const [value, setValue] = useState("newsletter")
  return <RadioCards options={options} value={value} onValueChange={setValue} />
}`,

  withIcons: `import { RadioCards } from "@hilum/ui"
import { Zap, Shield, Globe } from "lucide-react"

const plans = [
  { value: "starter", label: "Starter", description: "Perfect for small projects", meta: "$9/mo", icon: <Zap size={18} /> },
  { value: "pro", label: "Pro", description: "For growing teams", meta: "$29/mo", icon: <Shield size={18} /> },
  { value: "enterprise", label: "Enterprise", description: "Unlimited", meta: "$99/mo", icon: <Globe size={18} /> },
]

<RadioCards options={plans} value={value} onValueChange={setValue} />`,

  twoCol: `<RadioCards options={options} value={value} onValueChange={setValue} columns={2} />`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function RadioCardPage() {
  const [v1, setV1] = useState("newsletter");
  const [v2, setV2] = useState("pro");
  const [v3, setV3] = useState("customers");

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
          <span className="body font-semibold text-ground-900">Radio Cards</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Radio Cards</h1>
        <p className="body max-w-md text-ground-400">
          Card-style single-selection. Each option is a bordered card that highlights when selected.
          Richer than a radio group, clearer than a select.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Molecule</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Radio Group · Card</p>
        </div>
      </div>

      <PageDocs path="/molecules/radio-card/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Radio Cards · Basic" />
          <PreviewBlock
            title="3-column default"
            description="Label, description, and meta per card"
            code={CODE.basic}
            previewClassName="items-start"
          >
            <div className="w-full max-w-2xl">
              <RadioCards options={MAILING_LISTS} value={v1} onValueChange={setV1} />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Radio Cards · With icons" />
          <PreviewBlock
            title="Icon + plan details"
            description="Good for pricing/tier selection"
            code={CODE.withIcons}
            previewClassName="items-start"
          >
            <div className="w-full max-w-2xl">
              <RadioCards options={PLANS} value={v2} onValueChange={setV2} />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Radio Cards · Two columns" />
          <PreviewBlock
            title="2-column layout"
            description="Use columns={2} for wider cards"
            code={CODE.twoCol}
            previewClassName="items-start"
          >
            <div className="w-full max-w-lg">
              <RadioCards options={MAILING_LISTS} value={v3} onValueChange={setV3} columns={2} />
            </div>
          </PreviewBlock>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/radio-card/")({
  head: () => createCatalogPageHead("/molecules/radio-card/"),
  component: RadioCardPage,
});
