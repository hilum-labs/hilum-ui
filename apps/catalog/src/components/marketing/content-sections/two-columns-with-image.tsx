export default function TwoColumnsWithImage() {
  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10">
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-ground-100">
        <span className="subheading text-ground-400">Image Placeholder</span>
      </div>
      <div className="mt-10 lg:grid lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="label mb-4 uppercase tracking-wide text-brand-primary">Clarity at scale</p>
          <h3 className="heading text-ground-900">
            Design systems become useful when they stay close to the work
          </h3>
        </div>
        <div className="mt-6 space-y-4 lg:mt-0">
          <p className="body text-ground-600">
            Teams adopt systems when they make daily execution easier. A gallery of abstract
            components is not enough; people need narrative, examples, and guidance that maps to
            their actual projects.
          </p>
          <p className="body text-ground-600">
            That is why content sections matter. They bridge the space between the primitive and the
            polished page, showing how ideas become customer-facing work.
          </p>
        </div>
      </div>
    </section>
  );
}
