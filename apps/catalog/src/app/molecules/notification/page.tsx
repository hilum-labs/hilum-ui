import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { useState } from "react";
import { Notification } from "@hilum/ui";
import { Bell } from "lucide-react";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { Notification } from "@hilum/ui"

<Notification
  title="Successfully saved!"
  description="Anyone with a link can now view this file."
/>`,

  variants: `import { Notification } from "@hilum/ui"

<Notification variant="success" title="Payment received" description="Your invoice has been paid." />
<Notification variant="error" title="Upload failed" description="The file exceeds the 10MB limit." />
<Notification variant="warning" title="Storage almost full" description="You've used 90% of your 100GB quota." />
<Notification variant="info" title="New release available" description="Version 2.4.0 is now available." />`,

  withClose: `import { Notification } from "@hilum/ui"

<Notification
  variant="success"
  title="Saved successfully"
  description="Your changes have been published."
  onClose={() => setVisible(false)}
/>`,

  withActions: `import { Notification } from "@hilum/ui"

<Notification
  title="New comment on your post"
  description="Marcus replied to your comment."
  actions={[
    { label: "View", onClick: () => {} },
    { label: "Dismiss", onClick: () => {}, variant: "ghost" },
  ]}
/>`,

  customIcon: `import { Notification } from "@hilum/ui"
import { Bell } from "lucide-react"

<Notification
  title="You have a new message"
  description="Sofia sent you a direct message."
  icon={<Bell size={20} />}
  onClose={() => {}}
/>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function NotificationPage() {
  const [show, setShow] = useState(true);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">Molecules</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Notification</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Notification</h1>
        <p className="body max-w-md text-ground-400">
          A toast-style notification panel for displaying transient feedback. Supports success, error, warning, and info variants with optional actions and close button.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Molecule</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Icon · Button</p>
        </div>
      </div>

      <PageDocs path="/molecules/notification/" />

      <div className="flex flex-col gap-10">

        <div>
          <SectionHeading label="Notification · Basic" />
          <PreviewBlock title="Default" description="Title + description, no icon variant" code={CODE.basic} previewClassName="items-start">
            <Notification
              title="Successfully saved!"
              description="Anyone with a link can now view this file."
            />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Notification · Variants" />
          <PreviewBlock title="success · error · warning · info" description="Semantic icon colors for each state" code={CODE.variants} previewClassName="items-start">
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <Notification variant="success" title="Payment received" description="Your invoice has been paid." />
              <Notification variant="error" title="Upload failed" description="The file exceeds the 10MB limit." />
              <Notification variant="warning" title="Storage almost full" description="You've used 90% of your 100GB quota." />
              <Notification variant="info" title="New release available" description="Version 2.4.0 is now available." />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Notification · Interactive" />
          <div className="flex flex-col gap-3">
            <PreviewBlock title="With close button" description="Dismissible notification" code={CODE.withClose} previewClassName="items-start">
              <div className="w-full max-w-sm">
                {show ? (
                  <Notification
                    variant="success"
                    title="Saved successfully"
                    description="Your changes have been published."
                    onClose={() => setShow(false)}
                  />
                ) : (
                  <button
                    onClick={() => setShow(true)}
                    className="caption text-ground-400 hover:text-ground-700"
                  >
                    Show again →
                  </button>
                )}
              </div>
            </PreviewBlock>
            <PreviewBlock title="With actions" description="Inline action buttons" code={CODE.withActions} previewClassName="items-start">
              <Notification
                title="New comment on your post"
                description={'Marcus replied: "Looks great, ship it!"'}
                actions={[
                  { label: "View", onClick: () => {} },
                  { label: "Dismiss", onClick: () => {}, variant: "ghost" },
                ]}
              />
            </PreviewBlock>
            <PreviewBlock title="Custom icon" description="Any Lucide icon" code={CODE.customIcon} previewClassName="items-start">
              <Notification
                title="You have a new message"
                description="Sofia sent you a direct message."
                icon={<Bell size={20} />}
                onClose={() => {}}
              />
            </PreviewBlock>
          </div>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/notification/")({
  head: () => createCatalogPageHead("/molecules/notification/"),
  component: NotificationPage,
});
