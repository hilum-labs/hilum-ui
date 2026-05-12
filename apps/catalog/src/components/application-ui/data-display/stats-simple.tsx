
import { Users, TrendingUp, MousePointerClick } from "lucide-react";

const stats = [
  { label: "Total Subscribers", value: "71,897", change: "+12%", up: true },
  { label: "Avg. Open Rate", value: "58.16%", change: "+5.4%", up: true },
  { label: "Avg. Click Rate", value: "24.57%", change: "-3.2%", up: false },
] as const;

function changeClass(up: boolean) {
  return up ? "caption font-medium text-brand-primary" : "caption font-medium text-taupe-500";
}

export default function StatsSimple() {
  return (
    <dl className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-taupe-100 bg-white px-6 py-5"
        >
          <dt className="mb-1 caption text-taupe-500">{stat.label}</dt>
          <dd className="flex items-end justify-between gap-4">
            <span className="heading font-semibold text-taupe-900">
              {stat.value}
            </span>
            <span className={changeClass(stat.up)}>{stat.change}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
