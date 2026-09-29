import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Users, ShoppingCart, DollarSign, Activity } from "lucide-react";
import { StatCard } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { StatGrid } from "@hilum/ui";

const CODE = {
  basic: `import { StatCard } from "@hilum/ui"

<StatCard label="Total users" value="24,521" />`,

  trend: `import { StatCard } from "@hilum/ui"

<StatCard
  label="Monthly revenue"
  value="$48,200"
  trend={{ value: "+12.5% vs last month", direction: "up" }}
/>
<StatCard
  label="Churn rate"
  value="3.2%"
  trend={{ value: "-0.4% vs last month", direction: "down" }}
/>`,

  icon: `import { StatCard } from "@hilum/ui"
import { Users, ShoppingCart } from "lucide-react"

<StatCard
  label="Active users"
  value="8,340"
  trend={{ value: "+5.1% this week", direction: "up" }}
  icon={<Users size={15} />}
/>
<StatCard
  label="Orders"
  value="1,204"
  trend={{ value: "-2.3% this week", direction: "down" }}
  icon={<ShoppingCart size={15} />}
/>`,

  grid: `import { StatCard } from "@hilum/ui"
import { Users, DollarSign, ShoppingCart, Activity } from "lucide-react"

<div className="grid grid-cols-2 gap-3">
  <StatCard label="Total users" value="24,521"
    trend={{ value: "+8.1%", direction: "up" }} icon={<Users size={15} />} />
  <StatCard label="Revenue" value="$84,200"
    trend={{ value: "+12.5%", direction: "up" }} icon={<DollarSign size={15} />} />
  <StatCard label="Orders" value="1,204"
    trend={{ value: "-2.3%", direction: "down" }} icon={<ShoppingCart size={15} />} />
  <StatCard label="Uptime" value="99.9%"
    trend={{ value: "stable", direction: "neutral" }} icon={<Activity size={15} />} />
</div>`,
};

const GRID_CODE = `import { StatCard, StatGrid } from "@hilum/ui"

// One stat design for every dashboard: label, value, trend, description.
<StatGrid columns={4}>
  <StatCard label="Total sales" value="$12,480" trend={{ value: "+8.1%", direction: "up" }}
    description="Last 30 days" href="/analytics/sales" />
  <StatCard label="Orders" value="312" description="24 to fulfil" />
  <StatCard label="Refunds" value="$640" trend={{ value: "+2.4%", direction: "up", tone: "negative" }}
    description="Up is bad here" />
  <StatCard label="Conversion" loading />
</StatGrid>`;

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function StatCardPage() {
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
          <span className="body font-semibold text-foreground">Stat Card</span>
        </div>
        <h1 className="display mb-2 text-foreground">Stat Card</h1>
        <p className="body max-w-md text-muted-foreground">
          A metric display card. Composes a label, a large value, an optional trend indicator, and
          an optional icon.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-border pt-5">
          <p className="caption text-muted-foreground">Molecule</p>
          <div className="h-3 w-px bg-border" />
          <p className="caption text-muted-foreground">Card · Badge · Icon</p>
        </div>
      </div>

      <PageDocs path="/molecules/stat-card/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Stat Card · Basic" />
          <PreviewBlock title="Default" description="Label and value only" code={CODE.basic}>
            <div className="w-56">
              <StatCard label="Total users" value="24,521" />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Stat Card · Trend" />
          <PreviewBlock
            title="With trend"
            description="up · down · neutral directions"
            code={CODE.trend}
          >
            <div className="w-56">
              <StatCard
                label="Monthly revenue"
                value="$48,200"
                trend={{ value: "+12.5% vs last month", direction: "up" }}
              />
            </div>
            <div className="w-56">
              <StatCard
                label="Churn rate"
                value="3.2%"
                trend={{ value: "-0.4% vs last month", direction: "down" }}
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Stat Card · Icon" />
          <PreviewBlock
            title="With icon"
            description="Lucide icon in top-right corner"
            code={CODE.icon}
          >
            <div className="w-56">
              <StatCard
                label="Active users"
                value="8,340"
                trend={{ value: "+5.1% this week", direction: "up" }}
                icon={<Users size={15} />}
              />
            </div>
            <div className="w-56">
              <StatCard
                label="Orders"
                value="1,204"
                trend={{ value: "-2.3% this week", direction: "down" }}
                icon={<ShoppingCart size={15} />}
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Stat Card · Grid" />
          <PreviewBlock
            title="Dashboard grid"
            description="Four cards in a 2×2 layout"
            code={CODE.grid}
            previewClassName="items-start"
          >
            <div className="w-full max-w-lg">
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Total users"
                  value="24,521"
                  trend={{ value: "+8.1%", direction: "up" }}
                  icon={<Users size={15} />}
                />
                <StatCard
                  label="Revenue"
                  value="$84,200"
                  trend={{ value: "+12.5%", direction: "up" }}
                  icon={<DollarSign size={15} />}
                />
                <StatCard
                  label="Orders"
                  value="1,204"
                  trend={{ value: "-2.3%", direction: "down" }}
                  icon={<ShoppingCart size={15} />}
                />
                <StatCard
                  label="Uptime"
                  value="99.9%"
                  trend={{ value: "stable", direction: "neutral" }}
                  icon={<Activity size={15} />}
                />
              </div>
            </div>
          </PreviewBlock>
        </div>
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="label text-muted-foreground">Stat Grid</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <PreviewBlock
            title="Responsive stat grid"
            description="columns preset, description line, tone-aware trends, loading skeletons and drill-in links."
            code={GRID_CODE}
          >
            <div className="w-full">
              <StatGrid columns={4}>
                <StatCard
                  label="Total sales"
                  value="$12,480"
                  trend={{ value: "+8.1%", direction: "up" }}
                  description="Last 30 days"
                  href="#"
                />
                <StatCard label="Orders" value="312" description="24 to fulfil" />
                <StatCard
                  label="Refunds"
                  value="$640"
                  trend={{ value: "+2.4%", direction: "up", tone: "negative" }}
                  description="Up is bad here"
                />
                <StatCard label="Conversion" loading />
              </StatGrid>
            </div>
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Stat Card · Narrow cells" />
          <PreviewBlock
            title="Long labels and values on a phone"
            description="Values scale with the card's own width in any grid (30px down to 16px), sized so the longest number fits on one line: they wrap between the currency and the amount, never inside the number. Labels wrap between words over two lines at most, with tighter tracking in a StatGrid. The second grid is 320px wide, a small phone."
            code={`<StatGrid columns={2}>
  <StatCard label="Total merchants" value="1,284" />
  <StatCard label="Gross merchandise volume" value="S/ 12,345,678.90" />
</StatGrid>`}
          >
            <div className="flex w-full flex-col gap-4">
              <div className="w-full max-w-[22rem]">
                <StatGrid columns={2}>
                  <StatCard label="Total merchants" value="1,284" />
                  <StatCard label="Gross merchandise volume" value="S/ 12,345,678.90" />
                </StatGrid>
              </div>
              <div className="w-full max-w-[18rem]">
                <StatGrid columns={2}>
                  <StatCard label="Total merchants" value="1,284" />
                  <StatCard label="Gross merchandise volume" value="S/ 1,234,567.89" />
                </StatGrid>
              </div>
            </div>
          </PreviewBlock>
        </section>
      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/stat-card/")({
  head: () => createCatalogPageHead("/molecules/stat-card/"),
  component: StatCardPage,
});
