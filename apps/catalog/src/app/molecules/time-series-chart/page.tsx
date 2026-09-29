import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { TimeSeriesChart } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const SALES = [1240, 980, 1510, 1320, 2380, 1930, 2140, 1760, 1880, 2410, 2650, 2290, 2530, 2870];
const PREVIOUS = [
  910, 1020, 1160, 1080, 1610, 1540, 1790, 1420, 1500, 1720, 1810, 1690, 1840, 1950,
];
const DATA = SALES.map((sales, i) => ({
  date: `2026-09-${String(i + 1).padStart(2, "0")}`,
  sales,
  previous: PREVIOUS[i],
}));

const CODE = {
  sales: `import { TimeSeriesChart } from "@hilum/ui"

<TimeSeriesChart
  aria-label="Total sales over time"
  data={points}               // [{ date: "2026-09-01", sales: 1240, previous: 910 }, …]
  series={[
    { key: "sales", label: "Total sales" },
    { key: "previous", label: "Previous period", dashed: true },
  ]}
  valueFormat="currency"      // currency from FormatProvider, or currency="PEN"
  loading={isLoading}
/>`,
  line: `<TimeSeriesChart
  variant="line"
  aria-label="Orders per day"
  data={points}
  series={[{ key: "orders", label: "Orders" }]}
  height={180}
/>`,
  states: `<TimeSeriesChart aria-label="Sales" data={[]} series={series} loading />
<TimeSeriesChart aria-label="Sales" data={[]} series={series} />`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function TimeSeriesChartPage() {
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
          <span className="font-semibold text-foreground">Time Series Chart</span>
        </div>
        <h1 className="display mb-2 text-foreground">Time Series Chart</h1>
        <p className="body max-w-lg text-muted-foreground">
          Dashboard chart of values over dates with formatted axes and tooltip, loading and empty
          states. Apps pass data and series; no chart primitives needed.
        </p>
      </div>

      <PageDocs path="/molecules/time-series-chart/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Sales over time" />
          <PreviewBlock
            title="Area with a comparison period"
            description="Money on the y-axis (compact) and in the tooltip (full), dates on the x-axis, the previous period dashed."
            code={CODE.sales}
            previewClassName="flex-col items-stretch"
          >
            <TimeSeriesChart
              aria-label="Total sales over time"
              data={DATA}
              series={[
                { key: "sales", label: "Total sales" },
                { key: "previous", label: "Previous period", dashed: true },
              ]}
              valueFormat="currency"
            />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Line" />
          <PreviewBlock
            title="Single series"
            code={CODE.line}
            previewClassName="flex-col items-stretch"
          >
            <TimeSeriesChart
              variant="line"
              aria-label="Orders per day"
              data={DATA.map(({ date, sales }) => ({ date, orders: Math.round(sales / 60) }))}
              series={[{ key: "orders", label: "Orders" }]}
              height={180}
            />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="States" />
          <PreviewBlock
            title="Loading and empty"
            code={CODE.states}
            previewClassName="flex-col items-stretch gap-4"
          >
            <TimeSeriesChart
              aria-label="Sales"
              data={[]}
              series={[{ key: "sales", label: "Sales" }]}
              loading
              height={140}
            />
            <TimeSeriesChart
              aria-label="Sales"
              data={[]}
              series={[{ key: "sales", label: "Sales" }]}
              height={140}
            />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/time-series-chart/")({
  head: () => createCatalogPageHead("/molecules/time-series-chart/"),
  component: TimeSeriesChartPage,
});
