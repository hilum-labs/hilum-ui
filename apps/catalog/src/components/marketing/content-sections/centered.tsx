export default function Centered() {
  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="label uppercase tracking-wide text-brand-primary">Editorial</p>
        <h3 className="display mt-4 text-ground-900">
          A point of view that helps teams ship better work
        </h3>
        <p className="body mt-6 text-ground-600">
          Strong systems do more than standardize surfaces. They create a shared
          language for decisions, so product, design, and marketing can move in the
          same direction without losing speed.
        </p>
        <p className="body mt-4 text-ground-600">
          That clarity compounds over time. The best teams turn interface choices
          into operating leverage, making quality easier to repeat under real-world
          pressure.
        </p>
        <hr className="my-10 border-ground-100" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="display text-brand-primary">84%</p>
            <p className="body mt-1 text-ground-600">faster page assembly</p>
          </div>
          <div>
            <p className="display text-brand-primary">3x</p>
            <p className="body mt-1 text-ground-600">more reusable patterns</p>
          </div>
          <div>
            <p className="display text-brand-primary">12d</p>
            <p className="body mt-1 text-ground-600">saved each quarter</p>
          </div>
        </div>
      </div>
    </section>
  );
}
