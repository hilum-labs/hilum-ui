import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Field, MultiCombobox, type ComboboxOption } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const COLLECTIONS: ComboboxOption[] = [
  { value: "summer", label: "Summer essentials", description: "24 products" },
  { value: "sale", label: "Sale", description: "112 products" },
  { value: "new", label: "New arrivals", description: "18 products" },
  { value: "gifts", label: "Gifts under $50", description: "36 products" },
  { value: "kitchen", label: "Kitchen", description: "41 products" },
  { value: "home", label: "Home decor", description: "57 products" },
];

const COUNTRIES: ComboboxOption[] = [
  "Argentina",
  "Bolivia",
  "Brazil",
  "Chile",
  "Colombia",
  "Ecuador",
  "Mexico",
  "Paraguay",
  "Peru",
  "Uruguay",
].map((name) => ({ value: name.toLowerCase(), label: name }));

const CODE = {
  basic: `import { Field, MultiCombobox } from "@hilum/ui"

const [ids, setIds] = useState(["summer"])

<Field label="Collections" hint="The product appears in every collection you pick.">
  <MultiCombobox
    options={collections}          // { value, label, description? }[]
    value={ids}
    onValueChange={setIds}
    placeholder="Search collections"
    emptyText="No collections found"
  />
</Field>`,
  async: `const [query, setQuery] = useState("")
const { data, isFetching } = useCountries(query)

<Field label="Countries">
  <MultiCombobox
    options={data ?? []}
    value={codes}
    onValueChange={setCodes}
    onSearchChange={setQuery}      // server-side search; no client filtering
    loading={isFetching}
    maxSelected={5}
    clearable
  />
</Field>`,
  error: `<Field label="Eligible collections" error="Pick at least one collection" required>
  <MultiCombobox options={collections} value={[]} onValueChange={setIds} />
</Field>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function BasicDemo() {
  const [ids, setIds] = useState(["summer"]);
  return (
    <div className="w-full max-w-md">
      <Field label="Collections" hint="The product appears in every collection you pick.">
        <MultiCombobox
          options={COLLECTIONS}
          value={ids}
          onValueChange={setIds}
          placeholder="Search collections"
          emptyText="No collections found"
        />
      </Field>
    </div>
  );
}

function AsyncDemo() {
  const [codes, setCodes] = useState<string[]>(["peru"]);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<ComboboxOption[]>(COUNTRIES);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      const needle = query.trim().toLowerCase();
      setOptions(COUNTRIES.filter((country) => country.label.toLowerCase().includes(needle)));
      setLoading(false);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [query]);
  return (
    <div className="w-full max-w-md">
      <Field label="Countries" hint="Up to 5 countries.">
        <MultiCombobox
          options={options}
          value={codes}
          onValueChange={setCodes}
          onSearchChange={setQuery}
          loading={loading}
          maxSelected={5}
          clearable
          placeholder="Search countries"
          emptyText="No countries found"
        />
      </Field>
    </div>
  );
}

function ErrorDemo() {
  const [ids, setIds] = useState<string[]>([]);
  return (
    <div className="w-full max-w-md">
      <Field
        label="Eligible collections"
        error={ids.length === 0 ? "Pick at least one collection" : undefined}
        required
      >
        <MultiCombobox options={COLLECTIONS} value={ids} onValueChange={setIds} />
      </Field>
    </div>
  );
}

function MultiComboboxPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-foreground">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Multi Combobox</span>
        </div>
        <h1 className="display mb-2 text-foreground">Multi Combobox</h1>
        <p className="body max-w-lg text-muted-foreground">
          Pick several options from a searchable list. The selection shows as removable chips in the
          field; search can run on the server, and Backspace removes the last chip.
        </p>
      </div>

      <PageDocs path="/atoms/multi-combobox/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Basic" />
          <PreviewBlock
            title="Collections"
            description="The list stays open while picking; click a selected option or its chip's × to remove it."
            code={CODE.basic}
          >
            <BasicDemo />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Server-side search" />
          <PreviewBlock
            title="Async options"
            description="onSearchChange reports the query and loading shows a spinner row. Chips keep their labels when the results change. maxSelected disables the rest once reached."
            code={CODE.async}
          >
            <AsyncDemo />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Error" />
          <PreviewBlock
            title="Required"
            description="Field wires the label, error and required state."
            code={CODE.error}
          >
            <ErrorDemo />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/multi-combobox/")({
  head: () => createCatalogPageHead("/atoms/multi-combobox/"),
  component: MultiComboboxPage,
});
