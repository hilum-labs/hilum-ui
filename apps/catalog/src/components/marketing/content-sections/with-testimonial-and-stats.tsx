function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-ground-100 bg-white p-5">
      <p className="heading text-brand-primary">{value}</p>
      <p className="body mt-1 text-ground-600">{label}</p>
    </div>
  );
}

export default function WithTestimonialAndStats() {
  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10">
      <div className="max-w-2xl">
        <p className="label mb-4 uppercase tracking-wide text-brand-primary">
          Outcomes
        </p>
        <h3 className="heading text-ground-900">
          A system that helps teams align quickly
        </h3>
        <p className="body mt-4 text-ground-600">
          Pair qualitative proof with quantitative proof. This layout gives the
          customer story room to breathe while keeping the business impact visible.
        </p>
      </div>
      <div className="mt-10 lg:grid lg:grid-cols-[1fr_0.95fr] lg:gap-10">
        <aside className="rounded-2xl border border-ground-100 bg-ground-50 p-8">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-ground-200" />
            <div>
              <p className="subheading text-ground-900">Elena Park</p>
              <p className="body text-ground-500">Head of Design, Arcwell</p>
            </div>
          </div>
          <p className="heading mt-8 leading-tight text-ground-900">
            &ldquo;The library gave our team a common starting point, but the real
            win was how quickly product and marketing began speaking the same
            language.&rdquo;
          </p>
        </aside>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:mt-0">
          <Stat value="62%" label="faster campaign assembly" />
          <Stat value="18h" label="saved per launch sprint" />
          <Stat value="4x" label="increase in reuse across teams" />
          <Stat value="91%" label="stakeholder approval on first review" />
        </div>
      </div>
    </section>
  );
}
