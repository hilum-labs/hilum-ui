import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { useState } from "react";
import { Checkbox } from "@hilum/ui";
import { Label } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const NOTIFICATION_TYPES = [
  {
    id: "comments",
    label: "Comments",
    description: "Get notified when someone posts a comment on your content.",
  },
  {
    id: "candidates",
    label: "Candidates",
    description: "Get notified when a candidate applies for a job.",
  },
  {
    id: "offers",
    label: "Offers",
    description: "Get notified when a candidate receives or accepts an offer.",
  },
];

const MAILING_LISTS = [
  { id: "newsletter", label: "Newsletter", description: "Last message sent an hour ago" },
  { id: "offers", label: "Existing Customers", description: "Last message sent 2 weeks ago" },
  { id: "trial", label: "Trial Users", description: "Last message sent 4 days ago" },
];

const CODE = {
  basic: `import { Checkbox } from "@hilum/ui"
import { Label } from "@hilum/ui"

<div className="flex items-center gap-2">
  <Checkbox id="mp3" defaultChecked />
  <Label htmlFor="mp3">MP3 output</Label>
</div>
<div className="flex items-center gap-2">
  <Checkbox id="normalize" />
  <Label htmlFor="normalize">Normalize audio</Label>
</div>`,

  withDescription: `<fieldset>
  <legend className="body font-semibold text-ground-900">Notifications</legend>
  <div className="mt-3 flex flex-col gap-4">
    {items.map((item) => (
      <div key={item.id} className="flex gap-3">
        <Checkbox id={item.id} className="mt-0.5" />
        <div>
          <Label htmlFor={item.id}>{item.label}</Label>
          <p className="caption text-ground-400 mt-0.5">{item.description}</p>
        </div>
      </div>
    ))}
  </div>
</fieldset>`,

  withInlineDescription: `<fieldset>
  <legend className="body font-semibold text-ground-900">By email</legend>
  <div className="mt-3 flex flex-col gap-3">
    {items.map((item) => (
      <div key={item.id} className="flex items-start gap-3">
        <Checkbox id={item.id} className="mt-0.5" />
        <Label htmlFor={item.id}>
          {item.label}{" "}
          <span className="font-normal text-ground-400">{item.description}</span>
        </Label>
      </div>
    ))}
  </div>
</fieldset>`,

  rightSide: `<fieldset>
  <legend className="body font-semibold text-ground-900">Mailing lists</legend>
  <div className="mt-3 divide-y divide-ground-100 border-y border-ground-100">
    {items.map((item) => (
      <div key={item.id} className="flex items-center justify-between gap-4 py-4">
        <div>
          <Label htmlFor={item.id}>{item.label}</Label>
          <p className="caption text-ground-400 mt-0.5">{item.description}</p>
        </div>
        <Checkbox id={item.id} />
      </div>
    ))}
  </div>
</fieldset>`,

  simpleHeading: `<fieldset>
  <legend className="body font-semibold text-ground-900">Export options</legend>
  <div className="mt-3 flex flex-col gap-2.5">
    {options.map((opt) => (
      <div key={opt.id} className="flex items-center justify-between gap-3 py-1">
        <Label htmlFor={opt.id}>{opt.label}</Label>
        <Checkbox id={opt.id} defaultChecked={opt.checked} />
      </div>
    ))}
  </div>
</fieldset>`,
};

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function CheckboxPage() {
  const [rightSide, setRightSide] = useState<Record<string, boolean>>({
    newsletter: false,
    offers: true,
    trial: false,
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
          <span className="font-semibold text-ground-900">Checkbox</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Checkbox</h1>
        <p className="body max-w-lg text-ground-500">
          Binary selection control with label, description, and group layout variants.
        </p>
      </div>

      <PageDocs path="/atoms/checkbox/" />

      <div className="flex flex-col gap-10">
        <div>
          <Heading label="Checkbox · Basic" />
          <PreviewBlock
            title="Default"
            description="Simple checkbox with label"
            code={CODE.basic}
            previewClassName="flex-col items-start"
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <Checkbox id="mp3-out" defaultChecked />
                <Label htmlFor="mp3-out">MP3 output</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="normalize-audio" />
                <Label htmlFor="normalize-audio">Normalize audio</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="timestamps" />
                <Label htmlFor="timestamps">Include timestamps</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="disabled-cb" disabled />
                <Label htmlFor="disabled-cb" className="text-ground-400">
                  Unavailable option
                </Label>
              </div>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Checkbox · List with description" />
          <PreviewBlock
            title="Description below label"
            description="Each option has descriptive text below the label"
            code={CODE.withDescription}
            previewClassName="flex-col items-start"
          >
            <div className="w-full max-w-lg">
              <fieldset>
                <legend className="body font-semibold text-ground-900">Notifications</legend>
                <div className="mt-3 flex flex-col gap-4">
                  {NOTIFICATION_TYPES.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <Checkbox id={`desc-${item.id}`} className="mt-0.5" />
                      <div>
                        <Label htmlFor={`desc-${item.id}`}>{item.label}</Label>
                        <p className="caption text-ground-400 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Checkbox · List with inline description" />
          <PreviewBlock
            title="Inline description"
            description="Description text inline with label, de-emphasized"
            code={CODE.withInlineDescription}
            previewClassName="flex-col items-start"
          >
            <div className="w-full max-w-lg">
              <fieldset>
                <legend className="body font-semibold text-ground-900">By email</legend>
                <div className="mt-3 flex flex-col gap-3">
                  {NOTIFICATION_TYPES.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <Checkbox id={`inline-${item.id}`} className="mt-0.5" />
                      <Label htmlFor={`inline-${item.id}`} className="leading-snug">
                        {item.label}{" "}
                        <span className="font-normal text-ground-400">{item.description}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Checkbox · Checkbox on right" />
          <PreviewBlock
            title="Right-aligned checkboxes"
            description="Labels on left, checkboxes on right with dividers"
            code={CODE.rightSide}
            previewClassName="flex-col items-start"
          >
            <div className="w-full max-w-lg">
              <fieldset>
                <legend className="body font-semibold text-ground-900 mb-3">Mailing lists</legend>
                <div className="divide-y divide-ground-100 border-y border-ground-100">
                  {MAILING_LISTS.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 py-4">
                      <div>
                        <Label htmlFor={`right-${item.id}`}>{item.label}</Label>
                        <p className="caption text-ground-400 mt-0.5">{item.description}</p>
                      </div>
                      <Checkbox
                        id={`right-${item.id}`}
                        checked={rightSide[item.id]}
                        onCheckedChange={(v) =>
                          setRightSide((prev) => ({ ...prev, [item.id]: !!v }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Checkbox · Simple list with heading" />
          <PreviewBlock
            title="Fieldset with heading"
            description="Legend above, checkboxes to the right of each label"
            code={CODE.simpleHeading}
            previewClassName="flex-col items-start"
          >
            <div className="w-full max-w-sm">
              <fieldset>
                <legend className="body font-semibold text-ground-900">Export options</legend>
                <div className="mt-3 flex flex-col gap-1">
                  {[
                    { id: "pdf", label: "PDF document", checked: true },
                    { id: "csv", label: "CSV spreadsheet", checked: false },
                    { id: "json", label: "JSON data", checked: true },
                    { id: "xml", label: "XML data", checked: false },
                  ].map((opt) => (
                    <div key={opt.id} className="flex items-center justify-between gap-3 py-2">
                      <Label htmlFor={`sh-${opt.id}`} className="cursor-pointer">
                        {opt.label}
                      </Label>
                      <Checkbox id={`sh-${opt.id}`} defaultChecked={opt.checked} />
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/atoms/checkbox/")({
  head: () => createCatalogPageHead("/atoms/checkbox/"),
  component: CheckboxPage,
});
