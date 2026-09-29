import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Field, Tag, TagInput } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { Field, TagInput } from "@hilum/ui"

const [tags, setTags] = useState(["summer", "sale"])

<Field label="Tags" hint="Press Enter or type a comma to add a tag.">
  <TagInput value={tags} onChange={setTags} placeholder="Add a tag" />
</Field>`,
  suggestions: `<Field label="Tags">
  <TagInput
    value={tags}
    onChange={setTags}
    suggestions={existingTags}   // offered while typing
    maxTags={10}
    maxLength={40}
  />
</Field>`,
  error: `<Field label="Market handles" error="Add at least one market" required>
  <TagInput value={[]} onChange={setMarkets} normalize={(tag: string) => tag.toLowerCase()} />
</Field>`,
  tag: `import { Tag } from "@hilum/ui"

<Tag>Wholesale</Tag>
<Tag onRemove={() => removeFilter("vip")}>VIP</Tag>`,
};

const EXISTING = ["summer", "sale", "new arrival", "gift", "limited edition", "bestseller"];

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function BasicDemo() {
  const [tags, setTags] = useState(["summer", "sale"]);
  return (
    <div className="w-full max-w-md">
      <Field label="Tags" hint="Press Enter or type a comma to add a tag.">
        <TagInput value={tags} onChange={setTags} placeholder="Add a tag" />
      </Field>
    </div>
  );
}

function SuggestionsDemo() {
  const [tags, setTags] = useState<string[]>(["gift"]);
  return (
    <div className="w-full max-w-md">
      <Field label="Tags" hint="Up to 10 tags of 40 characters.">
        <TagInput
          value={tags}
          onChange={setTags}
          suggestions={EXISTING}
          maxTags={10}
          maxLength={40}
          placeholder="Search or add tags"
        />
      </Field>
    </div>
  );
}

function ErrorDemo() {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <div className="w-full max-w-md">
      <Field
        label="Market handles"
        error={tags.length === 0 ? "Add at least one market" : undefined}
        required
      >
        <TagInput
          value={tags}
          onChange={setTags}
          normalize={(tag: string) => tag.toLowerCase()}
          placeholder="pe, us, mx"
        />
      </Field>
    </div>
  );
}

function TagDemo() {
  const [filters, setFilters] = useState(["VIP", "Wholesale", "Returning"]);
  return (
    <div className="flex flex-wrap gap-2">
      <Tag>Read only</Tag>
      {filters.map((filter) => (
        <Tag
          key={filter}
          onRemove={() => setFilters((current) => current.filter((item) => item !== filter))}
        >
          {filter}
        </Tag>
      ))}
    </div>
  );
}

function TagInputPage() {
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
          <span className="font-semibold text-foreground">Tag Input</span>
        </div>
        <h1 className="display mb-2 text-foreground">Tag Input</h1>
        <p className="body max-w-lg text-muted-foreground">
          Free-text tags: Enter or a comma adds a tag, Backspace removes the last one, pasted text
          is split on commas and new lines, and duplicates are dropped. Optional suggestions, limits
          and a Field-wired label, hint and error.
        </p>
      </div>

      <PageDocs path="/atoms/tag-input/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Basic" />
          <PreviewBlock
            title="Product tags"
            description="Controlled value; the Field label, hint and error are wired to the text input."
            code={CODE.basic}
          >
            <BasicDemo />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Suggestions and limits" />
          <PreviewBlock
            title="Existing tags"
            description="Type to filter suggestions; arrow keys and Enter pick one. maxTags and maxLength cap the input and announce the limit."
            code={CODE.suggestions}
          >
            <SuggestionsDemo />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Error" />
          <PreviewBlock
            title="Required"
            description="A Field error turns the border destructive and describes the input."
            code={CODE.error}
          >
            <ErrorDemo />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Tag" />
          <PreviewBlock
            title="Standalone chips"
            description="The chip TagInput and MultiCombobox use, for filters and read-only labels."
            code={CODE.tag}
          >
            <TagDemo />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/tag-input/")({
  head: () => createCatalogPageHead("/atoms/tag-input/"),
  component: TagInputPage,
});
