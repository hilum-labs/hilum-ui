
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

export default function StatsSectionCard() {
  return (
    <section className="w-full bg-white px-8 py-16 text-center">
      <div className="mx-auto max-w-5xl">
        <h2 className="heading text-ground-900">Trusted by teams worldwide</h2>
        <p className="body mx-auto mt-3 max-w-2xl text-ground-500">
          A clean metrics block for product pages where the proof needs to
          feel polished without overpowering the surrounding content.
        </p>

        <div className="shadow-elevated mt-10 overflow-hidden rounded-xl bg-white">
          <dl className="grid divide-y divide-ground-100 md:grid-cols-4 md:divide-x md:divide-y-0">
            <StatGrid
              valueClassName="display px-6 pt-8 font-bold text-brand-primary"
              labelClassName="body px-6 pb-8 pt-2 text-ground-500"
            />
          </dl>
        </div>
      </div>
    </section>
  );
}
