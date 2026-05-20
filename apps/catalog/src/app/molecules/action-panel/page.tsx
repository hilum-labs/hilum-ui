
import { useState } from "react";
import { ActionPanel } from "@hilum/ui";
import { Switch } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { ActionPanel } from "@hilum/ui"

<ActionPanel
  title="Delete your account"
  description="Once you delete your account, you will lose all data."
  action={{ label: "Delete account", variant: "destructive" }}
/>`,

  inline: `<ActionPanel
  title="Export data"
  description="Download all your data as a .zip file."
  action={{ label: "Export" }}
  layout="inline"
/>`,

  muted: `<ActionPanel
  title="Upgrade your plan"
  description="Get access to unlimited projects and team members."
  action={{ label: "View plans" }}
  variant="muted"
/>`,

  withToggle: `import { Switch } from "@hilum/ui"

<ActionPanel
  title="Enable two-factor auth"
  description="Add an extra layer of security to your account."
  layout="inline"
>
  <Switch checked={enabled} onCheckedChange={setEnabled} />
</ActionPanel>`,

  withInput: `<ActionPanel
  title="Email notifications"
  description="Enter the email address where you'd like to receive notifications."
>
  <div className="flex gap-2">
    <Input type="email" placeholder="you@example.com" className="max-w-xs" />
    <Button size="sm">Save</Button>
  </div>
</ActionPanel>`,

  withLink: `<ActionPanel
  title="Privacy policy"
  description="Read our privacy policy to understand how we use your data."
  link={{ label: "Read policy", href: "#" }}
  variant="muted"
/>`,

  topRight: `// Button at top right — use layout="inline" with a short description
<ActionPanel
  title="Custom domain"
  description="yoursite.com"
  action={{ label: "Update", variant: "outline" }}
  layout="inline"
  variant="muted"
/>`,

  withWell: `// Panel with a nested well for displaying current state
<ActionPanel
  title="Payment method"
  description="Manage your billing information."
>
  <div className="rounded-lg bg-ground-50 border border-ground-100 px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="size-8 rounded bg-ground-200 flex items-center justify-center caption font-bold text-ground-600">VI</div>
      <div>
        <p className="caption font-medium text-ground-900">Visa ending in 4242</p>
        <p className="caption-xs text-ground-400">Expires 12/2026</p>
      </div>
    </div>
    <Button variant="ghost" size="sm">Edit</Button>
  </div>
</ActionPanel>`,
};

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function ActionPanelPage() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">Molecules</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Action Panel</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Action Panel</h1>
        <p className="body max-w-md text-ground-400">
          A bordered card that communicates a single, focused action. Variants for toggle, input, link, well, and button placement.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Molecule</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Button · Card · Switch · Input</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">

        <div>
          <Heading label="Action Panel · Basic" />
          <PreviewBlock title="Stacked layout" description="Title, description, and action stacked" code={CODE.basic} previewClassName="items-start">
            <div className="w-full max-w-lg">
              <ActionPanel
                title="Delete your account"
                description="Once you delete your account, you will lose all data associated with it."
                action={{ label: "Delete account", variant: "destructive" }}
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Action Panel · Inline" />
          <PreviewBlock title="Side-by-side layout" description="Text and action on the same row" code={CODE.inline} previewClassName="items-start">
            <div className="w-full max-w-lg">
              <ActionPanel
                title="Export data"
                description="Download all your data as a .zip file."
                action={{ label: "Export" }}
                layout="inline"
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Action Panel · With toggle" />
          <PreviewBlock title="Toggle switch as action" description="Switch replaces the button — inline layout" code={CODE.withToggle} previewClassName="items-start">
            <div className="w-full max-w-lg flex flex-col gap-3">
              <ActionPanel
                title="Enable two-factor authentication"
                description="Add an extra layer of security to your account."
                layout="inline"
              >
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              </ActionPanel>
              <ActionPanel
                title="Marketing emails"
                description="Receive product updates, promotions, and announcements."
                layout="inline"
              >
                <Switch checked={marketing} onCheckedChange={setMarketing} />
              </ActionPanel>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Action Panel · With input" />
          <PreviewBlock title="Input inside panel" description="Panel with inline form" code={CODE.withInput} previewClassName="items-start">
            <div className="w-full max-w-lg">
              <ActionPanel
                title="Email notifications"
                description="Enter the email address where you'd like to receive notifications."
              >
                <div className="flex gap-2">
                  <Input type="email" placeholder="you@example.com" className="max-w-xs" />
                  <Button size="sm">Save</Button>
                </div>
              </ActionPanel>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Action Panel · With link" />
          <PreviewBlock title="Text link instead of button" description="Lower-emphasis action using a text link" code={CODE.withLink} previewClassName="items-start">
            <div className="w-full max-w-lg flex flex-col gap-3">
              <ActionPanel
                title="Privacy policy"
                description="Read our privacy policy to understand how we use your data."
                link={{ label: "Read policy", href: "#" }}
                variant="muted"
              />
              <ActionPanel
                title="Terms of service"
                description="Review the terms governing your use of this platform."
                link={{ label: "View terms", href: "#" }}
                variant="muted"
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Action Panel · Button at top right" />
          <PreviewBlock title="Inline with short meta" description="Current state on left, action on right" code={CODE.topRight} previewClassName="items-start">
            <div className="w-full max-w-lg flex flex-col gap-3">
              <ActionPanel
                title="Custom domain"
                description="yoursite.com"
                action={{ label: "Update", variant: "outline" }}
                layout="inline"
                variant="muted"
              />
              <ActionPanel
                title="API key"
                description="sk-••••••••••••4a2f"
                action={{ label: "Rotate", variant: "outline" }}
                layout="inline"
                variant="muted"
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Action Panel · With well" />
          <PreviewBlock title="Nested content panel" description="Gray well inside for current state display" code={CODE.withWell} previewClassName="items-start">
            <div className="w-full max-w-lg flex flex-col gap-3">
              <ActionPanel
                title="Payment method"
                description="Manage the card used for billing."
              >
                <div className="rounded-lg bg-ground-50 border border-ground-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded bg-ground-200 caption font-bold text-ground-600">VI</div>
                    <div>
                      <p className="caption font-medium text-ground-900">Visa ending in 4242</p>
                      <p className="caption-xs text-ground-400">Expires 12/2026</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </ActionPanel>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Action Panel · Settings page composition" />
          <PreviewBlock title="Stacked settings panels" description="Multiple panels in a danger zone section" code={CODE.basic} previewClassName="items-start">
            <div className="w-full max-w-lg flex flex-col gap-3">
              <ActionPanel
                title="Export data"
                description="Download a copy of your data in JSON or CSV format."
                action={{ label: "Export", variant: "outline" }}
                layout="inline"
              />
              <ActionPanel
                title="Transfer ownership"
                description="Transfer your account and all its data to another user."
                action={{ label: "Transfer", variant: "outline" }}
                layout="inline"
              />
              <ActionPanel
                title="Delete account"
                description="Permanently delete your account. This cannot be undone."
                action={{ label: "Delete account", variant: "destructive" }}
                layout="inline"
              />
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}
