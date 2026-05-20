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

export default function NewsletterWithParagraphOnDarkFullWidth() {
  return (
    <section className="w-full bg-ground-900 px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div className="max-w-2xl">
          <p className="label mb-4 text-brand-secondary">Newsletter</p>
          <h3 className="heading text-white">Signal, not noise</h3>
          <p className="body mt-4 text-ground-300">
            A weekly edit of roadmap lessons, GTM ideas, and reusable design
            patterns for teams building products with ambition.
          </p>
        </div>
        <form
          className="mt-8 space-y-3 lg:mt-0"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <EmailInput className="bg-white text-ground-900 md:flex-1" />
            <Button
              type="submit"
              className="bg-brand-primary text-white hover:bg-brand-primary/90"
            >
              Subscribe
            </Button>
          </div>
          <p className="caption text-ground-400">
            Practical notes from the team behind the system. No filler.
          </p>
        </form>
      </div>
    </section>
  );
}
