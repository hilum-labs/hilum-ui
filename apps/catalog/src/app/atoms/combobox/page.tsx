
import { useState } from "react";
import { Combobox } from "@hilum/ui";
import { Field } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const FRAMEWORKS = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "gatsby", label: "Gatsby" },
];

const PEOPLE = [
  { value: "leslie", label: "Leslie Alexander", description: "Frontend Engineer" },
  { value: "michael", label: "Michael Foster", description: "Product Manager" },
  { value: "dries", label: "Dries Vincent", description: "Designer" },
  { value: "lindsay", label: "Lindsay Walton", description: "Backend Engineer" },
  { value: "courtney", label: "Courtney Henry", description: "Marketing" },
  { value: "tom", label: "Tom Cook", description: "DevOps" },
];

const PEOPLE_WITH_AVATARS = [
  { value: "leslie", label: "Leslie Alexander", description: "@leslie", avatar: "LA" },
  { value: "michael", label: "Michael Foster", description: "@michael", avatar: "MF" },
  { value: "dries", label: "Dries Vincent", description: "@dries", avatar: "DV" },
  { value: "lindsay", label: "Lindsay Walton", description: "@lindsay", avatar: "LW" },
  { value: "courtney", label: "Courtney Henry", description: "@courtney", avatar: "CH" },
  { value: "tom", label: "Tom Cook", description: "@tom", avatar: "TC" },
];

const PEOPLE_WITH_STATUS = [
  { value: "leslie", label: "Leslie Alexander", description: "Online", statusColor: "#22c55e" },
  { value: "michael", label: "Michael Foster", description: "Busy", statusColor: "#ef4444" },
  { value: "dries", label: "Dries Vincent", description: "Away", statusColor: "#eab308" },
  { value: "lindsay", label: "Lindsay Walton", description: "Online", statusColor: "#22c55e" },
  { value: "courtney", label: "Courtney Henry", description: "Offline", statusColor: "#9ca3af" },
  { value: "tom", label: "Tom Cook", description: "Online", statusColor: "#22c55e" },
];

const CODE = {
  basic: `import { Combobox } from "@hilum/ui"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

function Example() {
  const [value, setValue] = useState("")
  return (
    <Combobox
      options={frameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select framework..."
    />
  )
}`,

  withDescription: `const people = [
  { value: "leslie", label: "Leslie Alexander", description: "Frontend Engineer" },
  { value: "michael", label: "Michael Foster", description: "Product Manager" },
]

<Combobox options={people} value={value} onValueChange={setValue} placeholder="Assign to..." />`,

  withAvatar: `const people = [
  { value: "leslie", label: "Leslie Alexander", description: "@leslie", avatar: "LA" },
  { value: "michael", label: "Michael Foster", description: "@michael", avatar: "MF" },
]

<Combobox options={people} value={value} onValueChange={setValue} placeholder="Select person..." />`,

  withStatus: `const people = [
  { value: "leslie", label: "Leslie Alexander", description: "Online", statusColor: "#22c55e" },
  { value: "michael", label: "Michael Foster", description: "Busy", statusColor: "#ef4444" },
  { value: "dries", label: "Dries Vincent", description: "Away", statusColor: "#eab308" },
]

<Combobox options={people} value={value} onValueChange={setValue} placeholder="Select user..." />`,

  inField: `<Field label="Assigned to" hint="Type to search team members.">
  <Combobox options={people} value={value} onValueChange={setValue} placeholder="Select person..." />
</Field>`,
};

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function ComboboxPage() {
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [v3, setV3] = useState("");
  const [v4, setV4] = useState("");
  const [v5, setV5] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-taupe-700">Atoms</a>
          <span>/</span>
          <span className="body font-semibold text-taupe-900">Combobox</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Combobox</h1>
        <p className="body max-w-md text-taupe-400">
          A searchable select input. Users can type to filter the option list. Supports descriptions, avatars, status indicators, and composing inside a Field.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-taupe-100 pt-5">
          <p className="caption text-taupe-400">Atom</p>
          <div className="h-3 w-px bg-taupe-100" />
          <p className="caption text-taupe-400">Input · Select</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">

        <div>
          <Heading label="Combobox · Basic" />
          <PreviewBlock title="Simple" description="Select from a filtered list" code={CODE.basic}>
            <div className="w-72">
              <Combobox options={FRAMEWORKS} value={v1} onValueChange={setV1} placeholder="Select framework..." />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Combobox · With descriptions" />
          <PreviewBlock title="Options with sub-labels" description="Each item has a secondary description" code={CODE.withDescription}>
            <div className="w-72">
              <Combobox options={PEOPLE} value={v2} onValueChange={setV2} placeholder="Assign to..." />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Combobox · With avatars" />
          <PreviewBlock title="Person picker with initials" description="Avatar initials shown in trigger and dropdown" code={CODE.withAvatar}>
            <div className="w-72">
              <Combobox options={PEOPLE_WITH_AVATARS} value={v3} onValueChange={setV3} placeholder="Select person..." />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Combobox · With status indicator" />
          <PreviewBlock title="Status dot per option" description="Colored dot shows online/busy/away/offline" code={CODE.withStatus}>
            <div className="w-72">
              <Combobox options={PEOPLE_WITH_STATUS} value={v4} onValueChange={setV4} placeholder="Select user..." />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Combobox · In a Field" />
          <PreviewBlock title="Composed with Field" description="Works with label, hint, and error" code={CODE.inField}>
            <div className="w-72">
              <Field label="Assigned to" htmlFor="combobox-field" hint="Type to filter team members.">
                <Combobox options={PEOPLE} value={v5} onValueChange={setV5} placeholder="Select person..." />
              </Field>
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}
