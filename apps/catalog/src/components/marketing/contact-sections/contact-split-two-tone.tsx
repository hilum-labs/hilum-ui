import { Mail, MapPin, Phone } from "lucide-react";
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

function InfoRow({
  icon: Icon,
  label,
  value,
  dark = false,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-0.5 flex size-10 items-center justify-center rounded-xl ${
          dark ? "bg-white/10 text-white" : "bg-brand-primary/10 text-brand-primary"
        }`}
      >
        <Icon className="size-4" />
      </div>
      <div>
        <p className={`label ${dark ? "text-ground-500" : "text-ground-400"}`}>{label}</p>
        <p className={`body mt-1 ${dark ? "text-white" : "text-ground-900"}`}>{value}</p>
      </div>
    </div>
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

export default function ContactSplitTwoTone() {
  return (
    <section className="grid w-full lg:grid-cols-2">
      <div className="bg-ground-900 px-8 py-14 text-white">
        <div className="mx-auto max-w-lg">
          <p className="label text-brand-secondary">Contact</p>
          <h2 className="heading mt-4 text-white">
            Work with a team that ships systems, not slides
          </h2>
          <p className="body mt-4 text-ground-300">
            Strategy, implementation, and enablement support for teams that need a durable UI
            foundation.
          </p>
          <div className="mt-10 space-y-6">
            <div>
              <p className="label text-ground-500">Contact info</p>
              <div className="mt-4 space-y-5">
                <InfoRow icon={Mail} label="Mail" value="hello@northstar.so" dark />
                <InfoRow icon={Phone} label="Phone" value="+1 (212) 555-0189" dark />
                <InfoRow icon={MapPin} label="Location" value="New York, United States" dark />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white px-8 py-14">
        <div className="mx-auto max-w-xl">
          <h3 className="subheading text-ground-900">Send us a message</h3>
          <p className="body mt-3 text-ground-500">
            We usually reply within one working day with next steps and a recommended engagement
            model.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
