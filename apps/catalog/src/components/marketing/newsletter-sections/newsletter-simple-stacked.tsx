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

export default function NewsletterSimpleStacked() {
  return (
    <section className="w-full bg-white px-6 py-16 text-center sm:px-10">
      <p className="label mb-4 text-ground-400">Weekly brief</p>
      <h3 className="heading text-ground-900">Product notes worth opening</h3>
      <p className="body mx-auto mt-4 max-w-2xl text-ground-500">
        A concise edit of launches, lessons, and design decisions from fast-moving software teams.
      </p>
      <form className="mx-auto mt-8 max-w-xl" onSubmit={(event) => event.preventDefault()}>
        <div className="flex flex-col gap-3 md:flex-row">
          <EmailInput className="md:flex-1" />
          <Button type="submit">Join the list</Button>
        </div>
      </form>
    </section>
  );
}
