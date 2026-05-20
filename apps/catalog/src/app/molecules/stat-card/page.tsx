
import { Users, ShoppingCart, TrendingUp, DollarSign, Activity } from "lucide-react";
import { StatCard } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

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

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function StatCardPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">Molecules</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Stat Card</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Stat Card</h1>
        <p className="body max-w-md text-ground-400">
          A metric display card. Composes a label, a large value, an optional trend indicator, and an optional icon.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Molecule</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Card · Badge · Icon</p>
        </div>
      </div>

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
          <PreviewBlock title="With trend" description="up · down · neutral directions" code={CODE.trend}>
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
          <PreviewBlock title="With icon" description="Lucide icon in top-right corner" code={CODE.icon}>
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
          <PreviewBlock title="Dashboard grid" description="Four cards in a 2×2 layout" code={CODE.grid} previewClassName="items-start">
            <div className="w-full max-w-lg">
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Total users" value="24,521" trend={{ value: "+8.1%", direction: "up" }} icon={<Users size={15} />} />
                <StatCard label="Revenue" value="$84,200" trend={{ value: "+12.5%", direction: "up" }} icon={<DollarSign size={15} />} />
                <StatCard label="Orders" value="1,204" trend={{ value: "-2.3%", direction: "down" }} icon={<ShoppingCart size={15} />} />
                <StatCard label="Uptime" value="99.9%" trend={{ value: "stable", direction: "neutral" }} icon={<Activity size={15} />} />
              </div>
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}
