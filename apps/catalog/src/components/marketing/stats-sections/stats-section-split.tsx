
import { Badge } from "@hilum/ui";

const STATS = [
  { label: "Customers worldwide", value: "8,000+" },
  { label: "Revenue generated", value: "M+" },
  { label: "Uptime SLA", value: "99.9%" },
  { label: "Support response time", value: "< 1hr" },
];

function StatGrid({
  valueClassName,
  labelClassName,
}: {
  valueClassName: string;
  labelClassName: string;
}) {
  return (
    <>
      {STATS.map((stat) => (
        <div key={stat.label}>
          <dd className={valueClassName}>{stat.value}</dd>
          <dt className={labelClassName}>{stat.label}</dt>
        </div>
      ))}
    </>
  );
}

export default function StatsSectionSplit() {
  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="grid md:grid-cols-2">
        <div className="flex min-h-[340px] items-center justify-center bg-ground-100 p-10">
          <div className="aspect-video w-full max-w-xl rounded-2xl bg-ground-200 shadow-natural" />
        </div>

        <div className="px-8 py-16 md:px-12">
          <Badge variant="outline">Performance snapshot</Badge>
          <h2 className="heading mt-4 text-ground-900">Trusted by teams worldwide</h2>
          <p className="body mt-3 max-w-lg text-ground-500">
            Use this split when the story needs both product imagery and a
            few decisive proof points in the same section.
          </p>

          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            <StatGrid
              valueClassName="display font-bold text-brand-primary"
              labelClassName="body mt-2 text-ground-500"
            />
          </dl>
        </div>
      </div>
    </section>
  );
}
