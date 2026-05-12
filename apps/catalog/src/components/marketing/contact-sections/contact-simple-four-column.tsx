import { Building2, Globe, Mail, Phone } from "lucide-react";

const CONTACT_METHODS = [
  {
    icon: Building2,
    title: "Office",
    details: ["20 W 22nd Street", "New York, NY 10010"],
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["+1 (212) 555-0189", "Mon to Fri, 9am to 6pm"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["team@northstar.so", "Replies within one business day"],
  },
  {
    icon: Globe,
    title: "Social",
    details: ["@northstarhq", "LinkedIn, X, and Dribbble"],
  },
] as const;

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

export default function ContactSimpleFourColumn() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="label text-brand-primary">Reach the right team</p>
          <h2 className="heading mt-4 text-taupe-900">Choose the fastest way to contact us</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {CONTACT_METHODS.map((method) => (
            <ContactCard key={method.title} {...method} />
          ))}
        </div>
      </div>
    </section>
  );
}
