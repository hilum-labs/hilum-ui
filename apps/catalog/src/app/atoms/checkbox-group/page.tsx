import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckboxGroup, CheckboxItem } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { CheckboxGroup, CheckboxItem } from "@hilum/ui"
import { useState } from "react"

const items = ["Apples", "Bananas", "Cherries", "Dates"]
const [checked, setChecked] = useState<Set<number>>(new Set([0]))

<CheckboxGroup checkedIndices={checked}>
  {items.map((label, index) => (
    <CheckboxItem
      key={label}
      index={index}
      label={label}
      checked={checked.has(index)}
      onToggle={() => {
        setChecked((prev) => {
          const next = new Set(prev)
          if (next.has(index)) next.delete(index)
          else next.add(index)
          return next
        })
      }}
    />
  ))}
</CheckboxGroup>`;

function CheckboxGroupPage() {
  const items = ["Apples", "Bananas", "Cherries", "Dates"];
  const [checked, setChecked] = useState<Set<number>>(new Set([0]));

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Checkbox Group</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Checkbox group with merged backgrounds for contiguous selections.
      </p>
      <PageDocs path="/atoms/checkbox-group/" />
      <PreviewBlock title="Basic" description="Merged backgrounds across checked rows" code={CODE}>
        <CheckboxGroup className="w-80" checkedIndices={checked}>
          {items.map((label, index) => (
            <CheckboxItem
              key={label}
              index={index}
              label={label}
              checked={checked.has(index)}
              onToggle={() => {
                setChecked((prev) => {
                  const next = new Set(prev);
                  if (next.has(index)) next.delete(index);
                  else next.add(index);
                  return next;
                });
              }}
            />
          ))}
        </CheckboxGroup>
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/atoms/checkbox-group/")({
  head: () => createCatalogPageHead("/atoms/checkbox-group/"),
  component: CheckboxGroupPage,
});
