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

export default function TwoColumns() {
  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10 lg:grid lg:grid-cols-2 lg:gap-12">
      <div>
        <p className="label mb-4 uppercase tracking-wide text-brand-primary">
          Perspective
        </p>
        <h3 className="heading text-taupe-900">
          A practical operating system for product teams
        </h3>
        <p className="body mt-4 max-w-xl text-taupe-600">
          Good systems turn recurring judgment calls into defaults that teams can
          trust. That means less friction in planning, cleaner collaboration, and a
          sharper product surface over time.
        </p>
      </div>
      <div className="mt-8 lg:mt-0">
        <p className="body text-taupe-600">
          The result is not just visual consistency. It is a better workflow for
          everyone touching the product, from designers shaping the interface to
          marketers adapting the story.
        </p>
        <div className="mt-8">
          <BulletList items={BULLETS} />
        </div>
      </div>
    </section>
  );
}
