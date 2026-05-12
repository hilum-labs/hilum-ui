
import { useState } from "react";
import { Switch } from "@hilum/ui";
import { Label } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const NOTIFICATION_SETTINGS = [
  { id: "sw-comments", label: "Comments", description: "Get notified when someone comments on your posts." },
  { id: "sw-candidates", label: "Candidates", description: "Get notified when candidates apply for a role." },
  { id: "sw-offers", label: "Offers", description: "Get notified when a candidate accepts an offer." },
];

const CODE = {
  basic: `import { Switch } from "@hilum/ui"
import { Label } from "@hilum/ui"

<div className="flex items-center gap-3">
  <Switch id="lang" defaultChecked />
  <Label htmlFor="lang">Language override</Label>
</div>`,

  withLeftDescription: `{settings.map((s) => (
  <div key={s.id} className="flex items-center justify-between gap-4">
    <div>
      <Label htmlFor={s.id} className="body font-medium text-taupe-900">{s.label}</Label>
      <p className="caption text-taupe-400 mt-0.5">{s.description}</p>
    </div>
    <Switch id={s.id} />
  </div>
))}`,

  withRightLabel: `<div className="flex items-start gap-3">
  <Switch id="annual" defaultChecked className="mt-0.5" />
  <div>
    <Label htmlFor="annual" className="body font-medium text-taupe-900">Annual billing</Label>
    <p className="caption text-taupe-400 mt-0.5">Save 20% compared to monthly pricing.</p>
  </div>
</div>`,

  simpleList: `<div className="flex flex-col gap-3">
  {items.map((item) => (
    <div key={item.id} className="flex items-center gap-3">
      <Switch id={item.id} defaultChecked={item.on} />
      <Label htmlFor={item.id}>{item.label}</Label>
    </div>
  ))}
</div>`,
};

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function SwitchPage() {
  const [leftDesc, setLeftDesc] = useState<Record<string, boolean>>({
    "sw-comments": true,
    "sw-candidates": false,
    "sw-offers": true,
  });

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-taupe-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Switch</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Switch</h1>
        <p className="body max-w-lg text-taupe-500">
          Toggle between two states — on and off. Multiple label and description layout variants.
        </p>
      </div>

      <div className="flex flex-col gap-10">

        <div>
          <Heading label="Switch · Basic" />
          <PreviewBlock title="Simple toggle" description="Switch with a label" code={CODE.basic} previewClassName="flex-col items-start">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Switch id="lang-override" defaultChecked />
                <Label htmlFor="lang-override">Language override</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="speaker-boost" />
                <Label htmlFor="speaker-boost">Speaker boost</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="noise-reduction" />
                <Label htmlFor="noise-reduction">Noise reduction</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="sw-disabled" disabled />
                <Label htmlFor="sw-disabled" className="text-taupe-400">Disabled option</Label>
              </div>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Switch · Left label with description" />
          <PreviewBlock title="Label and description on left" description="Switch anchored to right, text on left. Common for notification settings." code={CODE.withLeftDescription} previewClassName="flex-col items-start">
            <div className="w-full max-w-lg flex flex-col gap-6">
              {NOTIFICATION_SETTINGS.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor={s.id} className="body font-medium text-taupe-900 cursor-pointer">
                      {s.label}
                    </Label>
                    <p className="caption text-taupe-400 mt-0.5">{s.description}</p>
                  </div>
                  <Switch
                    id={s.id}
                    checked={leftDesc[s.id]}
                    onCheckedChange={(v) => setLeftDesc((prev) => ({ ...prev, [s.id]: v }))}
                  />
                </div>
              ))}
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Switch · Right label with description" />
          <PreviewBlock title="Switch on left, label and description on right" description="Billing and preference toggles." code={CODE.withRightLabel} previewClassName="flex-col items-start">
            <div className="flex flex-col gap-5 max-w-md">
              <div className="flex items-start gap-3">
                <Switch id="annual-billing" defaultChecked className="mt-0.5" />
                <div>
                  <Label htmlFor="annual-billing" className="body font-medium text-taupe-900 cursor-pointer">
                    Annual billing
                  </Label>
                  <p className="caption text-taupe-400 mt-0.5">Save 20% compared to monthly pricing.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Switch id="marketing-emails" className="mt-0.5" />
                <div>
                  <Label htmlFor="marketing-emails" className="body font-medium text-taupe-900 cursor-pointer">
                    Marketing emails
                  </Label>
                  <p className="caption text-taupe-400 mt-0.5">Receive product updates, announcements, and offers.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Switch id="two-factor" defaultChecked className="mt-0.5" />
                <div>
                  <Label htmlFor="two-factor" className="body font-medium text-taupe-900 cursor-pointer">
                    Two-factor authentication
                  </Label>
                  <p className="caption text-taupe-400 mt-0.5">Add an extra layer of security to your account.</p>
                </div>
              </div>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Switch · List in a settings section" />
          <PreviewBlock title="Composed settings panel" description="Switches in a bordered card with dividers" code={CODE.simpleList} previewClassName="flex-col items-start">
            <div className="w-full max-w-md rounded-xl border border-taupe-100 bg-white shadow-natural divide-y divide-taupe-100">
              {[
                { id: "sw-2fa", label: "Two-factor auth", on: true },
                { id: "sw-sess", label: "Session alerts", on: true },
                { id: "sw-api", label: "API access", on: false },
                { id: "sw-pub", label: "Public profile", on: false },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <Label htmlFor={item.id} className="body text-taupe-700 cursor-pointer">{item.label}</Label>
                  <Switch id={item.id} defaultChecked={item.on} />
                </div>
              ))}
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}
