import { Button } from "@hilum/ui";

const INPUT_CLASS =
  "h-9 w-full rounded-lg border border-ground-200 bg-white px-3 body text-ground-900 placeholder:text-ground-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary";
const TEXTAREA_CLASS =
  "w-full rounded-lg border border-ground-200 bg-white px-3 py-2 body text-ground-900 placeholder:text-ground-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none";

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
  return (
    <textarea rows={rows} placeholder="Tell us about your project" className={TEXTAREA_CLASS} />
  );
}

function ContactForm({ compact = false }: { compact?: boolean }) {
  return (
    <form className={`rounded-2xl border border-ground-100 bg-white ${compact ? "p-6" : "p-8"}`}>
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

export default function ContactSplitWithImage() {
  return (
    <section className="grid w-full lg:grid-cols-2">
      <div className="relative min-h-[520px] bg-ground-100">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,77,1,0.08),transparent_55%),linear-gradient(0deg,rgba(255,255,255,0.4),rgba(255,255,255,0.4))]" />
        <div className="absolute bottom-8 left-8 rounded-2xl bg-white/80 p-5 backdrop-blur">
          <p className="label text-ground-400">Studio visit</p>
          <p className="subheading mt-2 text-ground-900">New York HQ</p>
          <p className="body mt-2 text-ground-500">
            Meet the product, design, and engineering leads in one place.
          </p>
        </div>
      </div>
      <div className="bg-white px-8 py-14">
        <div className="mx-auto max-w-xl">
          <p className="label text-brand-primary">Book a consultation</p>
          <h2 className="heading mt-4 text-ground-900">Tell us where your team is stuck</h2>
          <p className="body mt-4 text-ground-500">
            We help teams diagnose adoption problems, rebuild component architecture, and create
            implementation plans that can ship.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
