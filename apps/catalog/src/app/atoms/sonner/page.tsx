import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { toast } from "sonner";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  default: `import { toast } from "sonner"

// Toaster is already in the root layout
toast("Event has been created")`,

  withDescription: `toast("Event has been created", {
  description: "Monday, January 3rd at 6:00pm",
})`,

  success: `toast.success("Changes saved successfully")`,

  error: `toast.error("Something went wrong")`,

  warning: `toast.warning("You are approaching the rate limit")`,

  withAction: `toast("File deleted", {
  action: {
    label: "Undo",
    onClick: () => toast("Restored"),
  },
})`,

  promise: `const promise = new Promise((resolve) =>
  setTimeout(resolve, 2000)
)

toast.promise(promise, {
  loading: "Saving changes...",
  success: "Changes saved!",
  error: "Failed to save",
})`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function ToastPage() {
  const handlePromise = () => {
    const promise = new Promise((resolve) => setTimeout(resolve, 2000));
    toast.promise(promise, {
      loading: "Saving changes...",
      success: "Changes saved!",
      error: "Failed to save",
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Toast</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Toast</h1>
        <p className="body max-w-lg text-ground-500">
          Non-blocking notification messages that appear briefly and dismiss automatically.
        </p>
      </div>

      <PageDocs path="/atoms/sonner/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Toast" />

        <PreviewBlock
          title="Default"
          description="Basic toast — Toaster is configured once in the root layout"
          code={CODE.default}
        >
          <Button onClick={() => toast("Event has been created")}>
            Show toast
          </Button>
        </PreviewBlock>

        <PreviewBlock
          title="With description"
          description="Supporting text below the title"
          code={CODE.withDescription}
        >
          <Button
            onClick={() =>
              toast("Event has been created", {
                description: "Monday, January 3rd at 6:00pm",
              })
            }
          >
            Show toast
          </Button>
        </PreviewBlock>

        <PreviewBlock
          title="Success"
          description="Positive confirmation"
          code={CODE.success}
        >
          <Button onClick={() => toast.success("Changes saved successfully")}>
            Show success
          </Button>
        </PreviewBlock>

        <PreviewBlock
          title="Error"
          description="Error or failure state"
          code={CODE.error}
        >
          <Button onClick={() => toast.error("Something went wrong")}>
            Show error
          </Button>
        </PreviewBlock>

        <PreviewBlock
          title="Warning"
          description="Cautionary message"
          code={CODE.warning}
        >
          <Button
            onClick={() => toast.warning("You are approaching the rate limit")}
          >
            Show warning
          </Button>
        </PreviewBlock>

        <PreviewBlock
          title="With action"
          description="Inline action button — e.g. undo"
          code={CODE.withAction}
        >
          <Button
            onClick={() =>
              toast("File deleted", {
                action: {
                  label: "Undo",
                  onClick: () => toast("Restored"),
                },
              })
            }
          >
            Show toast
          </Button>
        </PreviewBlock>

        <PreviewBlock
          title="Promise"
          description="Automatically transitions through loading → success / error"
          code={CODE.promise}
        >
          <Button onClick={handlePromise}>Show promise</Button>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/sonner/")({
  head: () => createCatalogPageHead("/atoms/sonner/"),
  component: ToastPage,
});
