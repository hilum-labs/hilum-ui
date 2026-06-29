import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { useState } from "react";
import { Mail, Search } from "lucide-react";
import { InputField, InputGroup } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { InputField, InputGroup } from "@hilum/ui";
import { Search } from "lucide-react";
import { useState } from "react";

const [value, setValue] = useState("");

<InputGroup>
  <InputField
    index={0}
    label="Search"
    placeholder="Search teamspaces..."
    icon={Search}
    value={value}
    onChange={setValue}
  />
</InputGroup>`,

  multiple: `import { InputField, InputGroup } from "@hilum/ui";
import { Mail } from "lucide-react";

<InputGroup>
  <InputField
    index={0}
    label="Name"
    placeholder="Your name"
    value={name}
    onChange={setName}
  />
  <InputField
    index={1}
    label="Email"
    placeholder="you@example.com"
    icon={Mail}
    value={email}
    onChange={setEmail}
  />
</InputGroup>`,

  error: `<InputGroup>
  <InputField
    index={0}
    label="Email"
    placeholder="you@example.com"
    icon={Mail}
    value={email}
    onChange={setEmail}
    error="Please enter a valid email address."
  />
</InputGroup>`,
};

function InputGroupPage() {
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("bad@");

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Input Group</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Input field group with proximity hover and validation.
      </p>

      <PageDocs path="/molecules/input-group/" />

      <div className="flex flex-col gap-3">
        <PreviewBlock title="Basic" code={CODE.basic}>
          <InputGroup>
            <InputField
              index={0}
              label="Search"
              placeholder="Search teamspaces..."
              icon={Search}
              value={search}
              onChange={setSearch}
            />
          </InputGroup>
        </PreviewBlock>

        <PreviewBlock title="Multiple Fields" code={CODE.multiple}>
          <InputGroup>
            <InputField
              index={0}
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={setName}
            />
            <InputField
              index={1}
              label="Email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={setEmail}
            />
          </InputGroup>
        </PreviewBlock>

        <PreviewBlock title="Error State" code={CODE.error}>
          <InputGroup>
            <InputField
              index={0}
              label="Email"
              placeholder="you@example.com"
              icon={Mail}
              value={errorEmail}
              onChange={setErrorEmail}
              error="Please enter a valid email address."
            />
          </InputGroup>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/input-group/")({
  head: () => createCatalogPageHead("/molecules/input-group/"),
  component: InputGroupPage,
});
