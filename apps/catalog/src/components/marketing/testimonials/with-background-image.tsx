const TESTIMONIAL = {
  quote:
    "We launched the new campaign site in one sprint and still had time to refine the story. That never happened before we standardized the section library.",
  name: "Talia Carter",
  title: "Head of Brand, Fieldwork",
  initials: "TC",
};

function QuoteMarks({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 38C11 27.3 17.4 18.7 28 14L31 19C24.7 22.1 21 26.6 20 32H31V50H13.4C11.8 46.8 11 42.8 11 38ZM35 38C35 27.3 41.4 18.7 52 14L55 19C48.7 22.1 45 26.6 44 32H55V50H37.4C35.8 46.8 35 42.8 35 38Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function WithBackgroundImage() {
  return (
    <section className="relative w-full overflow-hidden bg-ground-900 px-8 py-24">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.1),transparent_45%,rgba(255,77,1,0.14))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <QuoteMarks className="mx-auto mb-8 size-16 text-white" />
        <p className="display italic text-white">{TESTIMONIAL.quote}</p>
        <div className="mt-8">
          <p className="subheading font-semibold text-white">{TESTIMONIAL.name}</p>
          <p className="body text-ground-300">{TESTIMONIAL.title}</p>
        </div>
      </div>
    </section>
  );
}
