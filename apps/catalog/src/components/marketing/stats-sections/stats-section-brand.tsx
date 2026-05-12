
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

export default function StatsSectionBrand() {
  return (
    <section className="w-full bg-brand-primary px-8 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <h2 className="heading text-white">Trusted by teams worldwide</h2>
        <p className="subheading mt-3 max-w-2xl text-white/80">
          Strong numbers, minimal framing, and enough space to let the
          brand color do the work.
        </p>

        <dl className="mt-10 grid gap-8 md:grid-cols-4">
          <StatGrid
            valueClassName="display font-bold text-white"
            labelClassName="body mt-2 text-white/70"
          />
        </dl>
      </div>
    </section>
  );
}
