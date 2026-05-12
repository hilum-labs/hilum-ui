export default function TwoColumnsWithTestimonial() {
  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10 lg:grid lg:grid-cols-[1fr_0.9fr] lg:gap-12">
      <div className="max-w-xl">
        <p className="label mb-4 uppercase tracking-wide text-brand-primary">
          Customer voice
        </p>
        <h3 className="heading text-taupe-900">
          The narrative matters as much as the component
        </h3>
        <p className="body mt-4 text-taupe-600">
          A strong content section gives teams a way to explain the system, not just
          browse it. That context helps people understand intent, tradeoffs, and the
          right way to apply a pattern.
        </p>
        <p className="body mt-4 text-taupe-600">
          When the narrative is clear, adoption becomes much easier because the
          system feels opinionated instead of ambiguous.
        </p>
      </div>
      <aside className="mt-8 rounded-2xl border border-taupe-100 bg-taupe-50 p-8 lg:mt-0">
        <p className="heading leading-tight text-taupe-900">
          &ldquo;It gave us a way to talk about quality without slowing down.
          Suddenly the system felt like an advantage, not a constraint.&rdquo;
        </p>
        <div className="mt-8">
          <p className="subheading text-taupe-900">Morgan Lee</p>
          <p className="body text-taupe-500">VP Product, Northstar</p>
        </div>
      </aside>
    </section>
  );
}
