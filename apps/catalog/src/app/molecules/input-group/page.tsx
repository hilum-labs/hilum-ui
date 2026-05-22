import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import {
  Search, Mail, AtSign, Globe, Lock, AlertCircle,
  SlidersHorizontal, Command, Keyboard,
} from "lucide-react";
import { InputGroup } from "@hilum/ui";
import { Field } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Kbd } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  leadingAddon: `<InputGroup leadingAddon="https://" placeholder="yoursite.com" />`,

  trailingAddon: `<InputGroup trailingAddon=".com" placeholder="yoursite" />`,

  leadingIcon: `<InputGroup leadingIcon={<Search size={15} />} placeholder="Search..." />
<InputGroup leadingIcon={<Mail size={15} />} type="email" placeholder="you@example.com" />`,

  trailingIcon: `<InputGroup trailingIcon={<Lock size={15} />} type="password" placeholder="Password" />`,

  combined: `<InputGroup leadingAddon="$" trailingAddon="USD" placeholder="0.00" />
<InputGroup leadingIcon={<Globe size={15} />} trailingAddon=".io" placeholder="yourapp" />`,

  validation: `<Field label="Email" error="This email is already registered.">
  <InputGroup
    error
    leadingIcon={<Mail size={15} />}
    type="email"
    defaultValue="invalid@"
    placeholder="you@example.com"
  />
</Field>`,

  pill: `<InputGroup pill leadingIcon={<Search size={15} />} placeholder="Search..." />`,

  cornerHint: `<Field label="Email" cornerHint="Optional">
  <InputGroup type="email" placeholder="you@example.com" />
</Field>`,

  trailingButton: `<InputGroup
  leadingIcon={<Search size={15} />}
  placeholder="Search..."
  trailingButton={
    <Button size="sm" className="rounded-l-none -ml-px h-9">
      Search
    </Button>
  }
/>`,

  keyboard: `// Keyboard shortcut displayed inside trailing area
<div className="relative">
  <InputGroup placeholder="Search..." leadingIcon={<Search size={15} />} className="pr-14" />
  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-0.5">
    <Kbd>⌘</Kbd><Kbd>K</Kbd>
  </div>
</div>`,

  sharedBorders: `// Card number + expiry + CVC with joined borders
<div className="flex flex-col">
  <InputGroup placeholder="Card number" className="rounded-b-none" />
  <div className="flex -mt-px">
    <InputGroup placeholder="MM / YY" className="rounded-none rounded-bl-lg flex-1" />
    <InputGroup placeholder="CVC" className="rounded-none rounded-br-lg flex-1 -ml-px" />
  </div>
</div>`,
};

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function InputGroupPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">Molecules</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Input Group</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Input Group</h1>
        <p className="body max-w-md text-ground-400">
          An input with optional leading/trailing addons, icons, buttons, validation state, pill shape, keyboard shortcuts, and shared-border card inputs.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Molecule</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Input · Field · Button · Kbd</p>
        </div>
      </div>

      <PageDocs path="/molecules/input-group/" />

      <div className="flex flex-col gap-10">

        <div>
          <Heading label="Input Group · Text addons" />
          <div className="flex flex-col gap-3">
            <PreviewBlock title="Leading addon" description="Text prefix attached to input left" code={CODE.leadingAddon}>
              <div className="w-72">
                <InputGroup leadingAddon="https://" placeholder="yoursite.com" />
              </div>
            </PreviewBlock>
            <PreviewBlock title="Trailing addon" description="Text suffix attached to input right" code={CODE.trailingAddon}>
              <div className="w-72">
                <InputGroup trailingAddon=".com" placeholder="yoursite" />
              </div>
            </PreviewBlock>
            <PreviewBlock title="Currency / amount" description="$ prefix + currency dropdown-style addon" code={CODE.combined}>
              <div className="flex flex-col gap-3 w-72">
                <InputGroup leadingAddon="$" trailingAddon="USD" placeholder="0.00" />
                <InputGroup leadingAddon="@" placeholder="username" />
                <InputGroup leadingIcon={<Globe size={15} />} trailingAddon=".io" placeholder="yourapp" />
              </div>
            </PreviewBlock>
          </div>
        </div>

        <div>
          <Heading label="Input Group · Icons" />
          <div className="flex flex-col gap-3">
            <PreviewBlock title="Leading icon" description="Icon positioned inside the input on the left" code={CODE.leadingIcon}>
              <div className="flex flex-col gap-3 w-72">
                <InputGroup leadingIcon={<Search size={15} />} placeholder="Search..." />
                <InputGroup leadingIcon={<Mail size={15} />} type="email" placeholder="you@example.com" />
              </div>
            </PreviewBlock>
            <PreviewBlock title="Trailing icon" description="Icon positioned inside the input on the right" code={CODE.trailingIcon}>
              <div className="w-72">
                <InputGroup trailingIcon={<Lock size={15} />} type="password" placeholder="Password" />
              </div>
            </PreviewBlock>
          </div>
        </div>

        <div>
          <Heading label="Input Group · Validation error" />
          <PreviewBlock title="Error state" description="Red border + error icon + message via Field" code={CODE.validation} previewClassName="items-start">
            <div className="flex flex-col gap-4 w-72">
              <Field label="Email" htmlFor="email-err" error="This email is already registered.">
                <InputGroup
                  id="email-err"
                  error
                  leadingIcon={<Mail size={15} />}
                  type="email"
                  defaultValue="invalid@"
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Website" htmlFor="url-err" error="Please enter a valid URL.">
                <InputGroup
                  id="url-err"
                  error
                  leadingAddon="https://"
                  defaultValue="not a url"
                />
              </Field>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Input Group · Pill shape" />
          <PreviewBlock title="Rounded-full variant" description="Use pill for search bars and chat-style inputs" code={CODE.pill}>
            <div className="flex flex-col gap-3 w-72">
              <InputGroup pill leadingIcon={<Search size={15} />} placeholder="Search..." />
              <InputGroup pill leadingAddon="@" placeholder="username" />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Input Group · Corner hint" />
          <PreviewBlock title="Optional / character count" description="cornerHint prop on Field renders text in the label row top-right" code={CODE.cornerHint} previewClassName="items-start">
            <div className="flex flex-col gap-4 w-72">
              <Field label="Email" htmlFor="email-opt" cornerHint="Optional">
                <InputGroup id="email-opt" type="email" placeholder="you@example.com" />
              </Field>
              <Field label="Bio" htmlFor="bio-hint" cornerHint="Max 200 chars">
                <InputGroup id="bio-hint" placeholder="A short bio..." />
              </Field>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Input Group · Keyboard shortcut" />
          <PreviewBlock title="Shortcut badge in trailing area" description="⌘K displayed inside the input" code={CODE.keyboard}>
            <div className="w-72 relative">
              <InputGroup
                placeholder="Search..."
                leadingIcon={<Search size={15} />}
                className="pr-16"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-0.5">
                <Kbd>⌘</Kbd><Kbd>K</Kbd>
              </div>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Input Group · With trailing button" />
          <PreviewBlock title="Search with attached button" description="Button shares border with input" code={CODE.trailingButton}>
            <div className="w-80">
              <InputGroup
                leadingIcon={<Search size={15} />}
                placeholder="Search documentation..."
                trailingButton={
                  <Button size="sm" className="rounded-l-none h-9 -ml-px border-l-0">
                    Search
                  </Button>
                }
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Input Group · Shared borders" />
          <PreviewBlock title="Card payment fields" description="Number, expiry, and CVC sharing borders" code={CODE.sharedBorders} previewClassName="items-start">
            <div className="w-72">
              <InputGroup placeholder="Card number" className="rounded-b-none" />
              <div className="flex -mt-px">
                <InputGroup placeholder="MM / YY" className="rounded-none rounded-bl-lg flex-1" />
                <InputGroup placeholder="CVC" className="rounded-none rounded-br-lg flex-1 -ml-px" />
              </div>
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/input-group/")({
  head: () => createCatalogPageHead("/molecules/input-group/"),
  component: InputGroupPage,
});
