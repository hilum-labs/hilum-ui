
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

export default function LogoCloudSimple() {
  return (
    <section className="w-full bg-white px-6 py-16 text-center sm:px-10">
      <p className="label text-taupe-400">Trusted by the world&apos;s best teams</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {COMPANIES.map((company) => (
          <LogoWordmark key={company} name={company} />
        ))}
      </div>
    </section>
  );
}
