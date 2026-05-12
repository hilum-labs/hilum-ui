import { Button } from "@hilum/ui";

const EMAIL_INPUT_CLASS =
  "h-9 w-full rounded-lg border border-taupe-200 bg-white px-3 body text-taupe-900 placeholder:text-taupe-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary";

function EmailInput({ className = "" }: { className?: string }) {
  return (
    <input
      type="email"
      placeholder="Enter your email"
      className={`${EMAIL_INPUT_CLASS} ${className}`.trim()}
    />
  );
}

export default function NewsletterSimpleWithDescription() {
  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
      <div className="max-w-lg">
        <p className="label mb-4 text-brand-primary">Newsletter</p>
        <h3 className="heading text-taupe-900">Stay close to the product</h3>
        <p className="body mt-4 text-taupe-500">
          Release notes, new templates, and practical product writing from the team
          building Workflow.
        </p>
      </div>
      <div className="mt-8 lg:mt-0">
        <form
          className="space-y-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <EmailInput className="sm:flex-1" />
            <Button type="submit">Subscribe</Button>
          </div>
          <p className="caption text-taupe-400">
            We send one email a week. No spam, no sharing, unsubscribe anytime.
          </p>
        </form>
      </div>
    </section>
  );
}
