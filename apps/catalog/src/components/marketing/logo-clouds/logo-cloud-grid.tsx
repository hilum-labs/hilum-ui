
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

export default function LogoCloudGrid() {
  return (
    <section className="w-full bg-ground-50 px-6 py-16 sm:px-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {COMPANIES.map((company) => (
          <div
            key={company}
            className="flex aspect-square items-center justify-center border border-ground-100 bg-white"
          >
            <LogoWordmark name={company} />
          </div>
        ))}
      </div>
    </section>
  );
}
