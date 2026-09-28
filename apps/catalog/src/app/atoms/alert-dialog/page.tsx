import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@hilum/ui";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { ConfirmDialog } from "@hilum/ui";

const CODE = {
  default: `import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogFooter, AlertDialogTitle,
  AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from "@hilum/ui"
import { Button } from "@hilum/ui"

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Open dialog</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently change your account settings.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,

  destructive: `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete account</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete your account and remove all your data.
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white">
        Delete account
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
};

const CONFIRM_CODE = `import { ConfirmDialog, Button, toast } from "@hilum/ui"

// One call replaces hand-built "Delete X" dialogs. Async onConfirm keeps the
// dialog open with a pending button until it settles.
<ConfirmDialog
  trigger={<Button variant="destructive">Delete product</Button>}
  title="Delete Linen shirt?"
  description="This permanently deletes the product and its variants."
  confirmLabel="Delete product"
  destructive
  onConfirm={() =>
    deleteProduct(id).then(() => toast.success("Product deleted"))
  }
/>`;

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function AlertDialogPage() {
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
          <span className="font-semibold text-foreground">Alert Dialog</span>
        </div>
        <h1 className="display mb-2 text-foreground">Alert Dialog</h1>
        <p className="body max-w-lg text-muted-foreground">
          A modal dialog that requires user acknowledgment before a critical or irreversible action
          proceeds.
        </p>
      </div>

      <PageDocs path="/atoms/alert-dialog/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Alert Dialog" />

        <PreviewBlock
          title="Default"
          description="Confirm action before proceeding"
          code={CODE.default}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently change your account settings.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </PreviewBlock>

        <PreviewBlock
          title="Destructive"
          description="Irreversible delete action — action button styled red"
          code={CODE.destructive}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete account</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and remove all your data. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white">
                  Delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </PreviewBlock>
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="label text-muted-foreground">Confirm Dialog</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <PreviewBlock
            title="One-call confirmation"
            description="Trigger, copy and an async-aware confirm handler."
            code={CONFIRM_CODE}
          >
            <ConfirmDialog
              trigger={<Button variant="destructive">Delete product</Button>}
              title="Delete Linen shirt?"
              description="This permanently deletes the product and its variants."
              confirmLabel="Delete product"
              destructive
              onConfirm={() => new Promise((resolve) => window.setTimeout(resolve, 800))}
            />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/alert-dialog/")({
  head: () => createCatalogPageHead("/atoms/alert-dialog/"),
  component: AlertDialogPage,
});
