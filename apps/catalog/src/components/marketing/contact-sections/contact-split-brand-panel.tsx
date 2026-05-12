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

export default function ContactSplitBrandPanel() {
  return (
    <section className="grid w-full lg:grid-cols-2">
      <div className="bg-brand-primary px-8 py-14 text-white">
        <div className="mx-auto max-w-lg">
          <p className="label text-white/70">Why teams reach out</p>
          <h2 className="heading mt-4 text-white">Move from one-off UI decisions to a system people trust</h2>
          <p className="body mt-4 text-white/80">
            A focused engagement helps your team reduce inconsistency, improve delivery speed, and align product, design, and engineering.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Clarify your component roadmap in one workshop",
              "Audit tokens, primitives, and documentation gaps",
              "Create an implementation plan the team can own",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <div className="mt-1 size-2 rounded-full bg-white" />
                <span className="body text-white">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-white px-8 py-14">
        <div className="mx-auto max-w-xl">
          <p className="label text-taupe-400">Project brief</p>
          <h3 className="heading mt-4 text-taupe-900">Request a tailored walkthrough</h3>
          <p className="body mt-4 text-taupe-500">
            Share your team size, current stack, and timeline. We will reply with recommended scope and a proposed intro call.
          </p>
          <div className="mt-8">
            <ContactForm compact />
          </div>
        </div>
      </div>
    </section>
  );
}
