import { Button } from "@hilum/ui";

const INPUT_CLASS =
  "h-9 w-full rounded-lg border border-taupe-200 bg-white px-3 body text-taupe-900 placeholder:text-taupe-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary";
const TEXTAREA_CLASS =
  "w-full rounded-lg border border-taupe-200 bg-white px-3 py-2 body text-taupe-900 placeholder:text-taupe-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none";

function Field({
  placeholder,
  type = "text",
}: {
  placeholder: string;
  type?: "text" | "email" | "tel";
}) {
  return <input type={type} placeholder={placeholder} className={INPUT_CLASS} />;
}

function MessageField({ rows = 5 }: { rows?: number }) {
  return <textarea rows={rows} placeholder="Tell us about your project" className={TEXTAREA_CLASS} />;
}

export default function ContactCentered() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto max-w-xl text-center">
        <p className="label text-brand-primary">Start a conversation</p>
        <h2 className="heading mt-4 text-taupe-900">Talk to the team</h2>
        <p className="body mt-4 text-taupe-500">
          Share a few project details and we will follow up with the right specialist.
        </p>
        <form className="mt-8 rounded-2xl border border-taupe-100 bg-taupe-50 p-8 text-left">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field placeholder="Name" />
            <Field type="email" placeholder="Email" />
          </div>
          <div className="mt-4">
            <Field type="tel" placeholder="Phone" />
          </div>
          <div className="mt-4">
            <MessageField rows={4} />
          </div>
          <Button className="mt-5 w-full">Send message</Button>
        </form>
      </div>
    </section>
  );
}
