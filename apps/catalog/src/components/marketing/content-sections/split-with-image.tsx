import { Check } from "lucide-react";

const BULLETS = [
  "Move faster with a shared visual language",
  "Turn patterns into repeatable operating leverage",
  "Reduce drift across product, design, and marketing",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary/10">
            <Check className="h-3.5 w-3.5 text-brand-primary" />
          </span>
          <span className="body text-taupe-600">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SplitWithImage() {
  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-taupe-100">
        <span className="subheading text-taupe-400">Image Placeholder</span>
      </div>
      <div className="mt-8 lg:mt-0">
        <p className="label mb-4 uppercase tracking-wide text-brand-primary">
          System thinking
        </p>
        <h3 className="heading text-taupe-900">
          From fragments to a system people can trust
        </h3>
        <p className="body mt-4 text-taupe-600">
          Most teams do not fail because they lack components. They fail because the
          surrounding decisions, naming, and governance are inconsistent. Trust comes
          from coherence, not volume.
        </p>
        <p className="body mt-4 text-taupe-600">
          When the system is close to the work, it becomes easier to scale quality
          across product launches, website campaigns, and internal tools.
        </p>
        <div className="mt-8">
          <BulletList items={BULLETS} />
        </div>
      </div>
    </section>
  );
}
