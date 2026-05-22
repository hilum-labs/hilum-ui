import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@hilum/ui";
import { Label } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { cn } from "@hilum/ui";

const MEMORY_OPTIONS = [
  { value: "4gb", label: "4 GB" },
  { value: "8gb", label: "8 GB" },
  { value: "16gb", label: "16 GB" },
  { value: "32gb", label: "32 GB" },
  { value: "64gb", label: "64 GB" },
  { value: "128gb", label: "128 GB" },
];

const PLAN_OPTIONS = [
  { value: "hobby", label: "Hobby", description: "For personal projects and experiments." },
  { value: "freelancer", label: "Freelancer", description: "For client work and solo professionals." },
  { value: "startup", label: "Startup", description: "For early-stage companies with growing teams." },
  { value: "enterprise", label: "Enterprise", description: "Custom contracts and dedicated support." },
];

const TRANSFER_OPTIONS = [
  { value: "bank", label: "Bank transfer", description: "SEPA, SWIFT, and local bank transfers." },
  { value: "paypal", label: "PayPal", description: "Send money using your PayPal balance." },
  { value: "stripe", label: "Credit card", description: "Visa, Mastercard, Amex, and more." },
];

const COLORS = [
  { value: "pink", label: "Pink", hex: "#ec4899" },
  { value: "purple", label: "Purple", hex: "#a855f7" },
  { value: "blue", label: "Blue", hex: "#3b82f6" },
  { value: "green", label: "Green", hex: "#22c55e" },
  { value: "yellow", label: "Yellow", hex: "#eab308" },
  { value: "orange", label: "Orange", hex: "#f97316" },
];

const PRICING_ROWS = [
  { value: "starter", label: "Starter", users: "Up to 5 users", storage: "10 GB", price: "$9/mo" },
  { value: "pro", label: "Professional", users: "Up to 25 users", storage: "50 GB", price: "$29/mo" },
  { value: "business", label: "Business", users: "Up to 100 users", storage: "250 GB", price: "$79/mo" },
];

const CODE = {
  basic: `<RadioGroup defaultValue="mp3">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="mp3" id="fmt-mp3" />
    <Label htmlFor="fmt-mp3">MP3 — 128 kbps</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="wav" id="fmt-wav" />
    <Label htmlFor="fmt-wav">WAV — lossless</Label>
  </div>
</RadioGroup>`,

  inline: `<RadioGroup defaultValue="monthly" className="flex gap-6">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="monthly" id="monthly" />
    <Label htmlFor="monthly">Monthly</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="annual" id="annual" />
    <Label htmlFor="annual">Annual (save 20%)</Label>
  </div>
</RadioGroup>`,

  withDescription: `{plans.map((plan) => (
  <div key={plan.value} className="flex gap-3">
    <RadioGroupItem value={plan.value} id={plan.value} className="mt-0.5" />
    <div>
      <Label htmlFor={plan.value}>{plan.label}</Label>
      <p className="caption text-ground-400 mt-0.5">{plan.description}</p>
    </div>
  </div>
))}`,

  rightSide: `{options.map((opt) => (
  <div key={opt.value} className="flex items-center justify-between gap-4 py-4">
    <div>
      <Label htmlFor={opt.value}>{opt.label}</Label>
      <p className="caption text-ground-400 mt-0.5">{opt.description}</p>
    </div>
    <RadioGroupItem value={opt.value} id={opt.value} />
  </div>
))}`,

  colorPicker: `{colors.map((c) => (
  <button
    key={c.value}
    type="button"
    aria-label={c.label}
    className={cn(
      "relative size-8 rounded-full ring-offset-2 transition-all",
      selected === c.value && "ring-2 ring-ground-900"
    )}
    style={{ backgroundColor: c.hex }}
    onClick={() => setSelected(c.value)}
  />
))}`,

  inPanel: `<RadioGroup value={value} onValueChange={setValue}>
  {plans.map((plan) => (
    <div
      key={plan.value}
      className={cn(
        "flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors",
        value === plan.value
          ? "border-ground-900 bg-ground-50"
          : "border-ground-100 hover:bg-ground-50"
      )}
      onClick={() => setValue(plan.value)}
    >
      <RadioGroupItem value={plan.value} id={plan.value} />
      <div>
        <Label htmlFor={plan.value} className="cursor-pointer">{plan.label}</Label>
        <p className="caption text-ground-400 mt-0.5">{plan.description}</p>
      </div>
    </div>
  ))}
</RadioGroup>`,

  smallCards: `<RadioGroup value={value} onValueChange={setValue} className="grid grid-cols-3 gap-2">
  {options.map((opt) => (
    <label
      key={opt.value}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 caption font-medium transition-colors",
        value === opt.value
          ? "border-ground-900 bg-ground-900 text-white"
          : "border-ground-200 bg-white text-ground-700 hover:bg-ground-50"
      )}
    >
      <RadioGroupItem value={opt.value} className="sr-only" />
      {opt.label}
    </label>
  ))}
</RadioGroup>`,

  table: `<RadioGroup value={value} onValueChange={setValue}>
  <table className="w-full">
    <thead>
      <tr className="border-b border-ground-100">
        <th className="pb-3 text-left caption text-ground-500 font-medium">Plan</th>
        <th className="pb-3 text-left caption text-ground-500 font-medium">Users</th>
        <th className="pb-3 text-left caption text-ground-500 font-medium">Storage</th>
        <th className="pb-3 text-right caption text-ground-500 font-medium">Price</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-ground-50">
      {rows.map((row) => (
        <tr key={row.value} className="cursor-pointer hover:bg-ground-50" onClick={() => setValue(row.value)}>
          <td className="py-3 flex items-center gap-2.5">
            <RadioGroupItem value={row.value} id={row.value} />
            <Label htmlFor={row.value} className="cursor-pointer">{row.label}</Label>
          </td>
          <td className="py-3 caption text-ground-500">{row.users}</td>
          <td className="py-3 caption text-ground-500">{row.storage}</td>
          <td className="py-3 caption text-ground-900 font-medium text-right">{row.price}</td>
        </tr>
      ))}
    </tbody>
  </table>
</RadioGroup>`,
};

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function RadioGroupPage() {
  const [inPanel, setInPanel] = useState("freelancer");
  const [smallCard, setSmallCard] = useState("8gb");
  const [tableVal, setTableVal] = useState("pro");
  const [colorVal, setColorVal] = useState("blue");

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Radio Group</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Radio Group</h1>
        <p className="body max-w-lg text-ground-500">
          Single selection from a set of mutually exclusive options. Multiple layout and visual variants.
        </p>
      </div>

      <PageDocs path="/atoms/radio-group/" />

      <div className="flex flex-col gap-10">

        <div>
          <Heading label="Radio Group · Basic" />
          <PreviewBlock title="Stacked list" description="Vertical list of radio options" code={CODE.basic} previewClassName="flex-col items-start">
            <RadioGroup defaultValue="mp3">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="mp3" id="fmt-mp3" />
                <Label htmlFor="fmt-mp3">MP3 — 128 kbps</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="wav" id="fmt-wav" />
                <Label htmlFor="fmt-wav">WAV — lossless</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="flac" id="fmt-flac" />
                <Label htmlFor="fmt-flac">FLAC — lossless compressed</Label>
              </div>
            </RadioGroup>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Radio Group · Inline" />
          <PreviewBlock title="Horizontal list" description="Options side by side" code={CODE.inline} previewClassName="flex-col items-start">
            <RadioGroup defaultValue="monthly" className="flex gap-6">
              {["Monthly", "Quarterly", "Annual (save 20%)"].map((label, i) => {
                const value = ["monthly", "quarterly", "annual"][i];
                return (
                  <div key={value} className="flex items-center gap-2">
                    <RadioGroupItem value={value} id={`billing-${value}`} />
                    <Label htmlFor={`billing-${value}`}>{label}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Radio Group · With description" />
          <PreviewBlock title="Description below label" description="Each option includes supporting text" code={CODE.withDescription} previewClassName="flex-col items-start">
            <div className="w-full max-w-md">
              <RadioGroup defaultValue="freelancer">
                <div className="flex flex-col gap-4">
                  {PLAN_OPTIONS.map((plan) => (
                    <div key={plan.value} className="flex gap-3">
                      <RadioGroupItem value={plan.value} id={`plan-${plan.value}`} className="mt-0.5" />
                      <div>
                        <Label htmlFor={`plan-${plan.value}`}>{plan.label}</Label>
                        <p className="caption text-ground-400 mt-0.5">{plan.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Radio Group · Radio on right" />
          <PreviewBlock title="Label left, radio right" description="Common for payment method selection" code={CODE.rightSide} previewClassName="flex-col items-start">
            <div className="w-full max-w-md">
              <RadioGroup defaultValue="bank">
                <div className="divide-y divide-ground-100 border-y border-ground-100">
                  {TRANSFER_OPTIONS.map((opt) => (
                    <div key={opt.value} className="flex items-center justify-between gap-4 py-4">
                      <div>
                        <Label htmlFor={`tf-${opt.value}`}>{opt.label}</Label>
                        <p className="caption text-ground-400 mt-0.5">{opt.description}</p>
                      </div>
                      <RadioGroupItem value={opt.value} id={`tf-${opt.value}`} />
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Radio Group · Color picker" />
          <PreviewBlock title="Color swatch selection" description="Visual circles with ring indicator on select" code={CODE.colorPicker} previewClassName="flex-col items-start">
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  aria-label={c.label}
                  className={cn(
                    "relative size-8 rounded-full ring-offset-2 transition-all",
                    colorVal === c.value && "ring-2 ring-ground-900"
                  )}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setColorVal(c.value)}
                />
              ))}
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Radio Group · In panel cards" />
          <PreviewBlock title="Panel with click-to-select" description="Bordered card highlights on selection" code={CODE.inPanel} previewClassName="flex-col items-start">
            <div className="w-full max-w-md">
              <RadioGroup value={inPanel} onValueChange={setInPanel}>
                <div className="flex flex-col gap-2">
                  {PLAN_OPTIONS.slice(0, 3).map((plan) => (
                    <div
                      key={plan.value}
                      className={cn(
                        "flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors",
                        inPanel === plan.value
                          ? "border-ground-900 bg-ground-50"
                          : "border-ground-100 hover:bg-ground-50"
                      )}
                      onClick={() => setInPanel(plan.value)}
                    >
                      <RadioGroupItem value={plan.value} id={`panel-${plan.value}`} />
                      <div>
                        <Label htmlFor={`panel-${plan.value}`} className="cursor-pointer">{plan.label}</Label>
                        <p className="caption text-ground-400 mt-0.5">{plan.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Radio Group · Small cards" />
          <PreviewBlock title="Compact grid cards" description="Used for memory, size, or tier selection" code={CODE.smallCards} previewClassName="flex-col items-start">
            <div className="w-full max-w-sm">
              <RadioGroup value={smallCard} onValueChange={setSmallCard} className="grid grid-cols-3 gap-2">
                {MEMORY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 caption font-medium transition-colors select-none",
                      smallCard === opt.value
                        ? "border-ground-900 bg-ground-900 text-white"
                        : "border-ground-200 bg-white text-ground-700 hover:bg-ground-50"
                    )}
                  >
                    <RadioGroupItem value={opt.value} className="sr-only" />
                    {opt.label}
                  </label>
                ))}
              </RadioGroup>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Radio Group · Table" />
          <PreviewBlock title="Pricing table" description="Plan comparison with radio in first column" code={CODE.table} previewClassName="flex-col items-start">
            <div className="w-full max-w-lg">
              <RadioGroup value={tableVal} onValueChange={setTableVal}>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-ground-100">
                      <th className="pb-3 text-left caption text-ground-500 font-medium">Plan</th>
                      <th className="pb-3 text-left caption text-ground-500 font-medium">Users</th>
                      <th className="pb-3 text-left caption text-ground-500 font-medium">Storage</th>
                      <th className="pb-3 text-right caption text-ground-500 font-medium">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ground-50">
                    {PRICING_ROWS.map((row) => (
                      <tr
                        key={row.value}
                        className="cursor-pointer hover:bg-ground-50 transition-colors"
                        onClick={() => setTableVal(row.value)}
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <RadioGroupItem value={row.value} id={`tbl-${row.value}`} />
                            <Label htmlFor={`tbl-${row.value}`} className="cursor-pointer">{row.label}</Label>
                          </div>
                        </td>
                        <td className="py-3 caption text-ground-500">{row.users}</td>
                        <td className="py-3 caption text-ground-500">{row.storage}</td>
                        <td className="py-3 caption font-medium text-ground-900 text-right">{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </RadioGroup>
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/atoms/radio-group/")({
  head: () => createCatalogPageHead("/atoms/radio-group/"),
  component: RadioGroupPage,
});
