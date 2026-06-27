import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { AlertTriangle, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { StatusBadge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  mapped: `import { StatusBadge } from "@hilum/ui"

<StatusBadge status="active" showDot />
<StatusBadge status="pending" showDot />
<StatusBadge status="draft" showDot />
<StatusBadge status="failed" showDot />`,

  custom: `import { StatusBadge } from "@hilum/ui"
import { CheckCircle2, Clock3 } from "lucide-react"

<StatusBadge
  status="queued"
  variantMap={{ queued: "warning" }}
  labelMap={{ queued: "Queued for sync" }}
  iconMap={{ queued: Clock3 }}
/>
<StatusBadge status="verified" icon={CheckCircle2} />`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function StatusBadgePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Status Badge</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Status Badge</h1>
        <p className="body max-w-lg text-ground-500">
          Semantic badge that maps status values to labels, variants, icons, and dots.
        </p>
      </div>

      <PageDocs path="/atoms/status-badge/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Mapped Status" />
          <PreviewBlock
            title="Default mappings"
            description="Common product states map to success, warning, secondary, and destructive variants."
            code={CODE.mapped}
          >
            <StatusBadge status="active" showDot />
            <StatusBadge status="pending" showDot />
            <StatusBadge status="draft" showDot />
            <StatusBadge status="failed" showDot />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Custom Mapping" />
          <PreviewBlock
            title="Custom labels and icons"
            description="Override labels, variants, or icons without rebuilding badge markup."
            code={CODE.custom}
          >
            <StatusBadge
              status="queued"
              variantMap={{ queued: "warning" }}
              labelMap={{ queued: "Queued for sync" }}
              iconMap={{ queued: Clock3 }}
            />
            <StatusBadge status="verified" icon={CheckCircle2} />
            <StatusBadge status="flagged" icon={AlertTriangle} />
            <StatusBadge status="failed" icon={XCircle} />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/status-badge/")({
  head: () => createCatalogPageHead("/atoms/status-badge/"),
  component: StatusBadgePage,
});
