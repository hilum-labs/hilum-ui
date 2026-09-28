import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { AlertTriangle, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { StatusBadge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { STATUS_TONE_BADGE, type StatusTone } from "@hilum/ui";

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

const TONE_CODE = `import { StatusBadge } from "@hilum/ui"

// Built-in commerce convention — don't hand-roll status → colour maps.
<StatusBadge status="paid" />                 // success
<StatusBadge status="processing" />           // info
<StatusBadge status="partially_fulfilled" />  // attention
<StatusBadge status="pending" />              // warning
<StatusBadge status="failed" />               // critical
<StatusBadge status="refunded" />             // neutral

// App-specific statuses: map to a tone, never to a colour.
<StatusBadge status="awaiting_pickup" toneMap={{ awaiting_pickup: "info" }} />
<StatusBadge status="custom" tone="attention" label="Needs review" />`;

const TONE_GUIDANCE: Array<[StatusTone, string, string[]]> = [
  ["success", "Finished and healthy", ["paid", "fulfilled", "active", "delivered"]],
  ["info", "In motion — nothing to do yet", ["processing", "shipped", "scheduled", "open"]],
  ["attention", "Merchant action needed soon", ["unfulfilled", "partially_fulfilled", "on_hold"]],
  ["warning", "At risk or waiting on someone else", ["pending", "past_due", "expiring"]],
  ["critical", "Failed or blocked", ["failed", "canceled", "suspended", "declined"]],
  ["neutral", "Inactive, or terminal but fine", ["draft", "archived", "refunded", "closed"]],
];

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function StatusBadgePage() {
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
          <span className="font-semibold text-foreground">Status Badge</span>
        </div>
        <h1 className="display mb-2 text-foreground">Status Badge</h1>
        <p className="body max-w-lg text-muted-foreground">
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
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="label text-muted-foreground">Semantic Tones</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <PreviewBlock
            title="Status → tone convention"
            description="Six tones cover every commerce state. Use tone or toneMap instead of picking colours."
            code={TONE_CODE}
          >
            <div className="flex w-full flex-col gap-3">
              {TONE_GUIDANCE.map(([tone, meaning, examples]) => (
                <div key={tone} className="flex flex-wrap items-center gap-2">
                  <span className="caption w-20 font-medium text-foreground">{tone}</span>
                  <span className="caption w-56 text-muted-foreground">{meaning}</span>
                  {examples.map((status) => (
                    <StatusBadge key={status} status={status} showDot />
                  ))}
                  <span className="sr-only">{STATUS_TONE_BADGE[tone].variant}</span>
                </div>
              ))}
            </div>
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
