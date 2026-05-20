
import { Users, TrendingUp, MousePointerClick } from "lucide-react";

const stats = [
  { label: "Total Subscribers", value: "71,897", change: "+12%", up: true },
  { label: "Avg. Open Rate", value: "58.16%", change: "+5.4%", up: true },
  { label: "Avg. Click Rate", value: "24.57%", change: "-3.2%", up: false },
] as const;

function changeClass(up: boolean) {
  return up ? "caption font-medium text-brand-primary" : "caption font-medium text-ground-500";
}

export default function StatsIcons() {
  return (
    <dl className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="rounded-xl border border-ground-100 bg-white px-6 py-5"
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <dt className="caption text-ground-500">{stat.label}</dt>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
              {index === 0 && <Users className="size-5 text-brand-primary" />}
              {index === 1 && (
                <TrendingUp className="size-5 text-brand-primary" />
              )}
              {index === 2 && (
                <MousePointerClick className="size-5 text-brand-primary" />
              )}
            </div>
          </div>
          <dd className="flex items-end justify-between gap-4">
            <span className="heading font-semibold text-ground-900">
              {stat.value}
            </span>
            <span className={changeClass(stat.up)}>{stat.change}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
