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

export default function NewsletterWithDescriptionOnBrandCard() {
  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10">
      <div className="rounded-2xl bg-brand-primary p-8 sm:p-10 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div className="max-w-lg">
          <p className="label mb-4 text-white/70">Early access</p>
          <h3 className="heading text-white">
            Get the next release before everyone else
          </h3>
          <p className="body mt-4 text-white/80">
            Join the preview list for launch notes, new components, and the thinking
            behind each release.
          </p>
        </div>
        <form
          className="mt-8 space-y-3 lg:mt-0"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <EmailInput className="sm:flex-1" />
            <Button
              type="submit"
              className="bg-white text-brand-primary hover:bg-ground-50"
            >
              Sign up
            </Button>
          </div>
          <p className="caption text-white/70">
            Thoughtful product updates for designers, founders, and operators.
          </p>
        </form>
      </div>
    </section>
  );
}
