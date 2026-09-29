import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { SetupGuide, type SetupGuideTask } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  guide: `import { SetupGuide } from "@hilum/ui"

const [tasks, setTasks] = useState(initialTasks)

<SetupGuide
  title="Setup guide"
  description="Use this personalized guide to get your store up and running."
  groups={[
    { id: "required", title: "Required to sell" },
    { id: "recommended", title: "Recommended" },
  ]}
  tasks={tasks}
  onTaskCompleteChange={(id, complete) =>
    setTasks((all) => all.map((t) => (t.id === id ? { ...t, complete } : t)))
  }
  onDismiss={() => hideGuide()}
/>

// A task:
{
  id: "domain",
  title: "Add a custom domain",
  description: "Your current domain is shop.hilum.store. Add a domain you own.",
  complete: false,
  group: "recommended",
  action: { label: "Add domain", href: "/settings/domains" },
  secondaryAction: { label: "Buy a domain", href: "https://…", external: true },
}`,
};

const INITIAL_TASKS: SetupGuideTask[] = [
  {
    id: "product",
    title: "Add your first product",
    description:
      "Write a description, add photos, and set pricing for the products you plan to sell.",
    complete: true,
    group: "required",
    action: { label: "Add product", href: "#add-product" },
  },
  {
    id: "payments",
    title: "Set up payments",
    description: "Choose a payment provider so customers can pay at checkout.",
    complete: false,
    group: "required",
    action: { label: "Set up payments", href: "#payments" },
    secondaryAction: { label: "Compare providers", href: "#providers" },
  },
  {
    id: "shipping",
    title: "Review your shipping rates",
    description: "Choose where you ship and how much you charge.",
    complete: false,
    group: "required",
    action: { label: "Review shipping", href: "#shipping" },
  },
  {
    id: "theme",
    title: "Customize your online store",
    description: "Choose a theme and add your logo, colors, and images.",
    complete: false,
    group: "recommended",
    action: { label: "Customize theme", href: "#theme" },
  },
  {
    id: "domain",
    title: "Add a custom domain",
    description: "Your current domain is shop.hilum.store. Add a domain you own.",
    complete: false,
    group: "recommended",
    action: { label: "Add domain", href: "#domain" },
  },
];

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SetupGuideDemo() {
  const [tasks, setTasks] = React.useState(INITIAL_TASKS);
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) {
    return (
      <button
        type="button"
        className="body text-muted-foreground underline"
        onClick={() => setDismissed(false)}
      >
        Show the setup guide again
      </button>
    );
  }
  return (
    <SetupGuide
      title="Setup guide"
      description="Use this personalized guide to get your store up and running."
      groups={[
        { id: "required", title: "Required to sell" },
        { id: "recommended", title: "Recommended" },
      ]}
      tasks={tasks}
      onTaskCompleteChange={(id, complete) =>
        setTasks((all) => all.map((task) => (task.id === id ? { ...task, complete } : task)))
      }
      onDismiss={() => setDismissed(true)}
      className="w-full max-w-2xl"
    />
  );
}

function SetupGuidePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-foreground">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Setup Guide</span>
        </div>
        <h1 className="display mb-2 text-foreground">Setup Guide</h1>
        <p className="body max-w-lg text-muted-foreground">
          Onboarding checklist card with progress, grouped tasks and one expanded task at a time,
          each with a visible call to action.
        </p>
      </div>

      <PageDocs path="/molecules/setup-guide/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Onboarding" />
          <PreviewBlock
            title="Store setup guide"
            description="The first incomplete task opens by default. Tick tasks off with the status circle; collapse or dismiss the whole guide from its header."
            code={CODE.guide}
            previewClassName="flex-col items-stretch"
          >
            <SetupGuideDemo />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/setup-guide/")({
  head: () => createCatalogPageHead("/molecules/setup-guide/"),
  component: SetupGuidePage,
});
