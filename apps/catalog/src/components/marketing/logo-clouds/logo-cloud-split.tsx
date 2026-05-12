
const COMPANIES = [
  "Vercel",
  "Linear",
  "Stripe",
  "Figma",
  "Notion",
  "Loom",
  "Intercom",
  "Segment",
];

function LogoWordmark({
  name,
  className = "text-taupe-300",
}: {
  name: string;
  className?: string;
}) {
  return <span className={`body font-bold tracking-tight ${className}`}>{name}</span>;
}

export default function LogoCloudSplit() {
  return (
    <section className="w-full overflow-hidden rounded-[28px] border border-taupe-100 lg:grid lg:grid-cols-3">
      <div className="flex items-center bg-white px-8 py-12 sm:px-10">
        <div className="max-w-xs">
          <p className="label mb-4 text-taupe-400">Social proof</p>
          <h3 className="heading text-taupe-900">Trusted by innovative teams</h3>
          <p className="body mt-4 text-taupe-500">
            Modern product organizations rely on Workflow to ship with more clarity.
          </p>
        </div>
      </div>
      <div className="bg-taupe-50 p-4 sm:p-6 lg:col-span-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {COMPANIES.map((company) => (
            <div
              key={company}
              className="flex aspect-square items-center justify-center rounded-2xl border border-white bg-white/80"
            >
              <LogoWordmark name={company} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
