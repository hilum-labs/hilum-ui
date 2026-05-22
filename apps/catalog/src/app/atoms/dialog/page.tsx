import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@hilum/ui";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  dialog: `import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogFooter, DialogTitle, DialogDescription,
} from "@hilum/ui"
import { Button } from "@hilum/ui"

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Delete voice</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete voice clone?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. The voice clone "Roger" will be
        permanently removed from your library.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function DialogPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Dialog</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Dialog</h1>
        <p className="body max-w-lg text-ground-500">
          Modal overlay for focused tasks and confirmations.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Dialog" />

        <PreviewBlock
          title="Confirmation dialog"
          description="Modal overlay with title, description, and action buttons"
          code={CODE.dialog}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Delete voice</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete voice clone?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. The voice clone &ldquo;Roger&rdquo; will
                  be permanently removed from your library.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost">Cancel</Button>
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/dialog/")({
  head: () => createCatalogPageHead("/atoms/dialog/"),
  component: DialogPage,
});
