const TESTIMONIALS = [
  {
    quote:
      "We replaced three disconnected landing page kits with one source of truth, and our conversion team now ships experiments without design debt piling up.",
    name: "Ava Lin",
    role: "Growth Lead, Orbit Commerce",
    initials: "AL",
  },
  {
    quote:
      "The quality bar is built into the components. Our brand still feels distinctive, but the production work is finally predictable.",
    name: "Marcus Reed",
    role: "Creative Director, Merge Health",
    initials: "MR",
  },
];

function Avatar({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-taupe-200 body font-semibold text-taupe-400 ${className ?? ""}`}
    >
      {initials}
    </div>
  );
}

export default function SideBySideOnBrand() {
  return (
    <section className="w-full bg-taupe-900 px-8 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
        <article className="space-y-6">
          <p className="body leading-7 text-white">
            {TESTIMONIALS[0].quote}
          </p>
          <div className="flex items-center gap-3">
            <Avatar
              initials={TESTIMONIALS[0].initials}
              className="size-10 text-sm"
            />
            <div>
              <p className="body font-semibold text-white">
                {TESTIMONIALS[0].name}
              </p>
              <p className="caption text-taupe-400">
                {TESTIMONIALS[0].role}
              </p>
            </div>
          </div>
          <div className="h-px bg-taupe-700 md:hidden" />
        </article>

        <div className="hidden h-full w-px bg-taupe-700 md:block" />

        <article className="space-y-6">
          <p className="body leading-7 text-white">
            {TESTIMONIALS[1].quote}
          </p>
          <div className="flex items-center gap-3">
            <Avatar
              initials={TESTIMONIALS[1].initials}
              className="size-10 text-sm"
            />
            <div>
              <p className="body font-semibold text-white">
                {TESTIMONIALS[1].name}
              </p>
              <p className="caption text-taupe-400">
                {TESTIMONIALS[1].role}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
