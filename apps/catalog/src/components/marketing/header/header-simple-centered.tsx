export default function HeaderSimpleCentered() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="caption text-ground-400">Marketing / Case studies</p>
        <h2 className="display mt-4 text-ground-900">
          Stories from teams building with a shared system
        </h2>
        <p className="body mt-5 text-ground-500">
          Browse launch retrospectives, implementation notes, and design system rollouts from
          product teams working at scale.
        </p>
      </div>
    </section>
  );
}
