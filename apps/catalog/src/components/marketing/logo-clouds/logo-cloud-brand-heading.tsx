
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

export default function LogoCloudBrandHeading() {
  return (
    <section className="w-full bg-brand-primary px-6 py-16 sm:px-10 lg:grid lg:grid-cols-2 lg:gap-12">
      <div className="max-w-md">
        <p className="label mb-4 text-white/70">Trusted worldwide</p>
        <h3 className="heading text-white">
          The world&apos;s most innovative companies use Workflow
        </h3>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-0 lg:content-center">
        {COMPANIES.slice(0, 6).map((company) => (
          <div
            key={company}
            className="flex min-h-20 items-center rounded-2xl border border-white/20 bg-white/5 px-5"
          >
            <LogoWordmark name={company} className="text-white" />
          </div>
        ))}
      </div>
    </section>
  );
}
