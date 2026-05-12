import { Mail, MapPin, Phone } from "lucide-react";
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
        <p className={`label ${dark ? "text-taupe-500" : "text-taupe-400"}`}>{label}</p>
        <p className={`body mt-1 ${dark ? "text-white" : "text-taupe-900"}`}>{value}</p>
      </div>
    </div>
  );
}

export default function ContactSimpleTwoColumn() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        <div className="max-w-lg">
          <p className="label text-brand-primary">Talk with us</p>
          <h2 className="heading mt-4 text-taupe-900">Tell us what you are building</h2>
          <p className="body mt-4 text-taupe-500">
            Whether you need a design system audit, implementation support, or a fast consultation, the team can help you map the right next step.
          </p>
          <div className="mt-8 space-y-5">
            <InfoRow icon={Mail} label="Email" value="hello@northstar.so" />
            <InfoRow icon={Phone} label="Phone" value="+1 (212) 555-0189" />
            <InfoRow icon={MapPin} label="Location" value="20 W 22nd Street, New York, NY 10010" />
          </div>
        </div>
        <form className="rounded-2xl border border-taupe-100 bg-taupe-50 p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field placeholder="Name" />
            <Field type="email" placeholder="Email" />
          </div>
          <div className="mt-4">
            <MessageField />
          </div>
          <Button className="mt-5">Submit inquiry</Button>
        </form>
      </div>
    </section>
  );
}
