import { Mail, MessageSquare } from "lucide-react";
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

function ContactCard({
  icon: Icon,
  title,
  details,
}: {
  icon: typeof Mail;
  title: string;
  details: readonly string[];
}) {
  return (
    <article className="rounded-2xl border border-taupe-100 bg-white p-6">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
        <Icon className="size-5" />
      </div>
      <h3 className="subheading mt-5 text-taupe-900">{title}</h3>
      <div className="mt-3 space-y-1">
        {details.map((detail) => (
          <p key={detail} className="body text-taupe-500">
            {detail}
          </p>
        ))}
      </div>
    </article>
  );
}

function ContactForm({ compact = false }: { compact?: boolean }) {
  return (
    <form className={`rounded-2xl border border-taupe-100 bg-white ${compact ? "p-6" : "p-8"}`}>
      <div className={`grid gap-4 ${compact ? "md:grid-cols-2" : "sm:grid-cols-2"}`}>
        <Field placeholder="Name" />
        <Field type="email" placeholder="Email" />
      </div>
      <div className="mt-4">
        <Field type="tel" placeholder="Phone" />
      </div>
      <div className="mt-4">
        <MessageField rows={compact ? 4 : 6} />
      </div>
      <Button className="mt-5 w-full sm:w-auto">Send message</Button>
    </form>
  );
}

export default function ContactSideBySideGrid() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-2xl bg-taupe-50 p-8">
          <p className="label text-brand-primary">General inquiries</p>
          <h2 className="heading mt-4 text-taupe-900">Need a quick answer or a detailed proposal?</h2>
          <p className="body mt-4 text-taupe-500">
            Tell us whether you are evaluating a new system, refreshing an existing library, or planning a migration.
          </p>
          <div className="mt-8 space-y-4">
            <ContactCard icon={Mail} title="Sales" details={["sales@northstar.so", "Response in 24 hours"]} />
            <ContactCard icon={MessageSquare} title="Support" details={["support@northstar.so", "For implementation questions"]} />
          </div>
        </aside>
        <ContactForm />
      </div>
    </section>
  );
}
