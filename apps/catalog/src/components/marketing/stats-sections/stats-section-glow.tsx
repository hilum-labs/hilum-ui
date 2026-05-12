
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

export default function StatsSectionGlow() {
  return (
    <section className="relative w-full overflow-hidden bg-taupe-900 px-8 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,77,1,0.14)_0%,_rgba(255,77,1,0)_68%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_45%)]" />

      <div className="relative mx-auto max-w-6xl text-center">
        <h2 className="heading text-white">Trusted by teams worldwide</h2>
        <p className="body mx-auto mt-3 max-w-2xl text-taupe-400">
          A quieter, more atmospheric stat section for premium campaign
          pages and long-form product storytelling.
        </p>

        <dl className="mt-12 grid gap-10 md:grid-cols-4">
          <StatGrid
            valueClassName="display font-bold text-white"
            labelClassName="body mt-3 text-taupe-400"
          />
        </dl>
      </div>
    </section>
  );
}
