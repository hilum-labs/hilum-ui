import { Button } from "@hilum/ui";

const EMAIL_INPUT_CLASS =
  "h-9 w-full rounded-lg border border-ground-200 bg-white px-3 body text-ground-900 placeholder:text-ground-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary";

function EmailInput({ className = "" }: { className?: string }) {
  return (
    <input
      type="email"
      placeholder="Enter your email"
      className={`${EMAIL_INPUT_CLASS} ${className}`.trim()}
    />
  );
}

export default function NewsletterCenteredCardWithGraphic() {
  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-ground-100 bg-ground-50 p-8 text-center sm:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-primary/20" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-primary/20" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-primary/10" />
        </div>
        <div className="relative">
          <p className="label mb-4 text-brand-primary">Inside Workflow</p>
          <h3 className="heading text-ground-900">The build log, delivered weekly</h3>
          <p className="body mx-auto mt-4 max-w-2xl text-ground-500">
            Get a tighter look at roadmap themes, product bets, and reusable design
            patterns without the noise.
          </p>
          <form
            className="mx-auto mt-8 max-w-xl"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="flex flex-col gap-3 md:flex-row">
              <EmailInput className="md:flex-1" />
              <Button type="submit">Subscribe</Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
