
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
  className = "text-ground-300",
}: {
  name: string;
  className?: string;
}) {
  return <span className={`body font-bold tracking-tight ${className}`}>{name}</span>;
}

export default function LogoCloudSplit() {
  return (
    <section className="w-full overflow-hidden rounded-[28px] border border-ground-100 lg:grid lg:grid-cols-3">
      <div className="flex items-center bg-white px-8 py-12 sm:px-10">
        <div className="max-w-xs">
          <p className="label mb-4 text-ground-400">Social proof</p>
          <h3 className="heading text-ground-900">Trusted by innovative teams</h3>
          <p className="body mt-4 text-ground-500">
            Modern product organizations rely on Workflow to ship with more clarity.
          </p>
        </div>
      </div>
      <div className="bg-ground-50 p-4 sm:p-6 lg:col-span-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {COMPANIES.map((company) => (
            <div
              key={company}
              className="flex aspect-square items-center justify-center rounded-2xl bg-white/80 ring-1 ring-inset ring-white/[0.035]"
            >
              <LogoWordmark name={company} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
