import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { NativeSelect, NativeSelectOption, NativeSelectOptGroup } from "@hilum/ui";
import { Field } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { NativeSelect, NativeSelectOption } from "@hilum/ui"

<NativeSelect defaultValue="">
  <NativeSelectOption value="" disabled>Select a country...</NativeSelectOption>
  <NativeSelectOption value="us">United States</NativeSelectOption>
  <NativeSelectOption value="ca">Canada</NativeSelectOption>
  <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
  <NativeSelectOption value="au">Australia</NativeSelectOption>
</NativeSelect>`,

  grouped: `<NativeSelect defaultValue="">
  <NativeSelectOption value="" disabled>Select a city...</NativeSelectOption>
  <NativeSelectOptGroup label="North America">
    <NativeSelectOption value="sf">San Francisco</NativeSelectOption>
    <NativeSelectOption value="ny">New York</NativeSelectOption>
    <NativeSelectOption value="toronto">Toronto</NativeSelectOption>
  </NativeSelectOptGroup>
  <NativeSelectOptGroup label="Europe">
    <NativeSelectOption value="london">London</NativeSelectOption>
    <NativeSelectOption value="paris">Paris</NativeSelectOption>
  </NativeSelectOptGroup>
  <NativeSelectOptGroup label="Asia Pacific">
    <NativeSelectOption value="tokyo">Tokyo</NativeSelectOption>
    <NativeSelectOption value="sydney">Sydney</NativeSelectOption>
  </NativeSelectOptGroup>
</NativeSelect>`,

  states: `<NativeSelect defaultValue="us">...</NativeSelect>
<NativeSelect defaultValue="us" disabled>...</NativeSelect>
<NativeSelect aria-invalid="true" defaultValue="">...</NativeSelect>`,

  inField: `import { Field } from "@hilum/ui"

<Field label="Country" htmlFor="country" hint="Select your billing country.">
  <NativeSelect id="country" defaultValue="">
    <NativeSelectOption value="" disabled>Select...</NativeSelectOption>
    <NativeSelectOption value="us">United States</NativeSelectOption>
    <NativeSelectOption value="ca">Canada</NativeSelectOption>
    <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
  </NativeSelect>
</Field>`,

  withError: `<Field label="Country" htmlFor="country-err" error="Please select a country.">
  <NativeSelect id="country-err" aria-invalid="true" defaultValue="">
    <NativeSelectOption value="" disabled>Select...</NativeSelectOption>
    <NativeSelectOption value="us">United States</NativeSelectOption>
    <NativeSelectOption value="ca">Canada</NativeSelectOption>
  </NativeSelect>
</Field>`,
};

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function NativeSelectPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Native Select</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Native Select</h1>
        <p className="body max-w-lg text-ground-500">
          Styled native HTML select. No JavaScript overhead — uses the browser's built-in dropdown. Best for mobile forms and performance-sensitive contexts.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Atom</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Form · Input</p>
        </div>
      </div>

      <PageDocs path="/atoms/native-select/" />

      <div className="flex flex-col gap-10">

        <div>
          <Heading label="Native Select · Basic" />
          <PreviewBlock
            title="Single-value dropdown"
            description="Styled native select with a disabled placeholder option"
            code={CODE.basic}
          >
            <div className="w-64">
              <NativeSelect defaultValue="">
                <NativeSelectOption value="" disabled>Select a country...</NativeSelectOption>
                <NativeSelectOption value="us">United States</NativeSelectOption>
                <NativeSelectOption value="ca">Canada</NativeSelectOption>
                <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
                <NativeSelectOption value="au">Australia</NativeSelectOption>
              </NativeSelect>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Native Select · Grouped options" />
          <PreviewBlock
            title="Options grouped by category"
            description="Use NativeSelectOptGroup to organize options by region or category"
            code={CODE.grouped}
          >
            <div className="w-72">
              <NativeSelect defaultValue="">
                <NativeSelectOption value="" disabled>Select a city...</NativeSelectOption>
                <NativeSelectOptGroup label="North America">
                  <NativeSelectOption value="sf">San Francisco</NativeSelectOption>
                  <NativeSelectOption value="ny">New York</NativeSelectOption>
                  <NativeSelectOption value="toronto">Toronto</NativeSelectOption>
                </NativeSelectOptGroup>
                <NativeSelectOptGroup label="Europe">
                  <NativeSelectOption value="london">London</NativeSelectOption>
                  <NativeSelectOption value="paris">Paris</NativeSelectOption>
                </NativeSelectOptGroup>
                <NativeSelectOptGroup label="Asia Pacific">
                  <NativeSelectOption value="tokyo">Tokyo</NativeSelectOption>
                  <NativeSelectOption value="sydney">Sydney</NativeSelectOption>
                </NativeSelectOptGroup>
              </NativeSelect>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Native Select · States" />
          <PreviewBlock
            title="Default, disabled, and invalid"
            description="Visual states for interaction feedback"
            code={CODE.states}
            previewClassName="flex-col items-start"
          >
            <div className="flex w-64 flex-col gap-3">
              <div>
                <NativeSelect defaultValue="us">
                  <NativeSelectOption value="us">United States</NativeSelectOption>
                  <NativeSelectOption value="ca">Canada</NativeSelectOption>
                  <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
                </NativeSelect>
                <p className="caption mt-1 text-ground-400">Default</p>
              </div>
              <div>
                <NativeSelect defaultValue="us" disabled>
                  <NativeSelectOption value="us">United States</NativeSelectOption>
                  <NativeSelectOption value="ca">Canada</NativeSelectOption>
                  <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
                </NativeSelect>
                <p className="caption mt-1 text-ground-400">Disabled</p>
              </div>
              <div>
                <NativeSelect aria-invalid="true" defaultValue="">
                  <NativeSelectOption value="" disabled>Select a country...</NativeSelectOption>
                  <NativeSelectOption value="us">United States</NativeSelectOption>
                  <NativeSelectOption value="ca">Canada</NativeSelectOption>
                </NativeSelect>
                <p className="caption mt-1 text-ground-400">Invalid</p>
              </div>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Native Select · With Field wrapper" />
          <PreviewBlock
            title="With label and hint"
            description="Compose with Field for accessible form fields"
            code={CODE.inField}
            previewClassName="flex-col items-start"
          >
            <div className="w-72">
              <Field label="Country" htmlFor="country" hint="Select your billing country.">
                <NativeSelect id="country" defaultValue="">
                  <NativeSelectOption value="" disabled>Select...</NativeSelectOption>
                  <NativeSelectOption value="us">United States</NativeSelectOption>
                  <NativeSelectOption value="ca">Canada</NativeSelectOption>
                  <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
                  <NativeSelectOption value="au">Australia</NativeSelectOption>
                </NativeSelect>
              </Field>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Native Select · With error" />
          <PreviewBlock
            title="Validation error state"
            description="Field surfaces the error message; NativeSelect shows the invalid border"
            code={CODE.withError}
            previewClassName="flex-col items-start"
          >
            <div className="w-72">
              <Field label="Country" htmlFor="country-err" error="Please select a country.">
                <NativeSelect id="country-err" aria-invalid="true" defaultValue="">
                  <NativeSelectOption value="" disabled>Select...</NativeSelectOption>
                  <NativeSelectOption value="us">United States</NativeSelectOption>
                  <NativeSelectOption value="ca">Canada</NativeSelectOption>
                  <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
                </NativeSelect>
              </Field>
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/atoms/native-select/")({
  head: () => createCatalogPageHead("/atoms/native-select/"),
  component: NativeSelectPage,
});
