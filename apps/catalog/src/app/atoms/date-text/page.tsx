import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import {
  DateText,
  FormatProvider,
  RelativeTime,
  formatCurrency,
  formatNumber,
  pluralize,
} from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  dates: `import { DateText } from "@hilum/ui"

<DateText value={order.createdAt} />                  // Sep 26, 2026
<DateText value={order.createdAt} format="datetime" /> // Sep 26, 2026, 3:04 PM
<DateText value={order.createdAt} format="monthDay" /> // Sep 26
<DateText value={order.processedAt} fallback="Not processed" />`,

  relative: `import { RelativeTime } from "@hilum/ui"

// "5 minutes ago" — refreshes every minute, absolute date after 7 days
<RelativeTime value={event.createdAt} />`,

  helpers: `import { FormatProvider, useFormatter, formatCurrency, pluralize } from "@hilum/ui"

// Once, at the app root:
<FormatProvider locale={store.locale} currency={store.currency} timeZone={store.timeZone}>
  <App />
</FormatProvider>

// Anywhere:
const fmt = useFormatter()
fmt.currency(order.totalCents, { minorUnits: true }) // S/ 48.20
fmt.pluralize(order.lineItems.length, "item")        // 1 item · 3 items
fmt.dateRange(from, to)                              // Sep 1 – 26, 2026

// Or standalone:
formatCurrency(4820, { currency: "USD", minorUnits: true }) // $48.20
pluralize(1, "item")                                        // 1 item`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

const SAMPLE = new Date(2026, 8, 26, 15, 4);

function DateTextPage() {
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
          <span className="font-semibold text-foreground">Date Text</span>
        </div>
        <h1 className="display mb-2 text-foreground">Date Text</h1>
        <p className="body max-w-lg text-muted-foreground">
          Locale-aware dates, relative times, money and counts. DateText renders a semantic time
          element; the Intl-based helpers keep every screen on one format convention.
        </p>
      </div>

      <PageDocs path="/atoms/date-text/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Dates" />
          <PreviewBlock
            title="One format convention"
            description="Medium dates everywhere; hover for the full date and time. Never raw ISO strings."
            code={CODE.dates}
          >
            <div className="body flex flex-col gap-1 text-foreground">
              <DateText value={SAMPLE} />
              <DateText value={SAMPLE} format="datetime" />
              <DateText value={SAMPLE} format="monthDay" />
              <DateText value={null} fallback="Not processed" />
            </div>
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Relative time" />
          <PreviewBlock
            title="Activity timestamps"
            description="Self-refreshing; switches to an absolute date after a week."
            code={CODE.relative}
          >
            <div className="body flex flex-col gap-1 text-foreground">
              <RelativeTime value={new Date(Date.now() - 5 * 60 * 1000)} />
              <RelativeTime value={new Date(Date.now() - 26 * 60 * 60 * 1000)} />
            </div>
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Money, numbers and plurals" />
          <PreviewBlock
            title="FormatProvider + helpers"
            description="Set locale, currency and time zone once; no hard-coded $ or '1 items'."
            code={CODE.helpers}
          >
            <FormatProvider locale="es-PE" currency="PEN">
              <div className="body flex flex-col gap-1 text-foreground">
                <span>
                  {formatCurrency(4820, { locale: "es-PE", currency: "PEN", minorUnits: true })}
                </span>
                <span>{formatNumber(1204.5, { locale: "es-PE" })}</span>
                <DateText value={SAMPLE} />
              </div>
            </FormatProvider>
            <div className="body flex flex-col gap-1 text-foreground">
              <span>{pluralize(1, "item")}</span>
              <span>{pluralize(3, "item")}</span>
              <span>{formatCurrency(4820, { currency: "USD", minorUnits: true })}</span>
            </div>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/date-text/")({
  head: () => createCatalogPageHead("/atoms/date-text/"),
  component: DateTextPage,
});
