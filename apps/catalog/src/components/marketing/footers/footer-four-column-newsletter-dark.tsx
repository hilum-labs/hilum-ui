
import { Github, Globe, Linkedin, Twitter } from "lucide-react";
import { Button } from "@hilum/ui";

const FOOTER_NAV = {
  product: ["Features", "Pricing", "Changelog", "Documentation"],
  company: ["About", "Blog", "Careers", "Press"],
  legal: ["Privacy", "Terms", "Cookie Policy", "Licenses"],
} as const;

const INPUT_CLASS =
  "h-9 w-full rounded-lg border border-ground-200 bg-white px-3 body text-ground-900 placeholder:text-ground-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary";

const SOCIALS = [
  { label: "Twitter", Icon: Twitter },
  { label: "GitHub", Icon: Github },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "Web", Icon: Globe },
] as const;

function LogoMark({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${dark ? "text-white" : "text-ground-900"}`}>
      <div
        className={`flex size-10 items-center justify-center rounded-xl body font-semibold ${
          dark ? "bg-brand-primary text-white" : "bg-ground-900 text-white"
        }`}
      >
        NS
      </div>
      <div>
        <p className="body font-medium">Northstar</p>
        <p className={`caption ${dark ? "text-ground-400" : "text-ground-500"}`}>Design systems for product teams</p>
      </div>
    </div>
  );
}

function SocialButtons({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {SOCIALS.map(({ label, Icon }) => (
        <button
          key={label}
          aria-label={label}
          className={`flex size-9 items-center justify-center rounded-full border transition-colors ${
            dark
              ? "border-ground-800 bg-ground-900 text-ground-300 hover:border-ground-700 hover:text-white"
              : "border-ground-200 bg-white text-ground-500 hover:border-ground-300 hover:text-ground-900"
          }`}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}

function FooterLinks({
  title,
  links,
  dark = false,
  active = false,
}: {
  title: string;
  links: readonly string[];
  dark?: boolean;
  active?: boolean;
}) {
  return (
    <div>
      <h3 className={`label ${dark ? "text-white" : "text-ground-900"}`}>{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link, index) => (
          <li key={link}>
            <a
              href="#"
              className={`body transition-colors ${
                active && index === 0
                  ? "text-brand-primary"
                  : dark
                    ? "text-ground-400 hover:text-white"
                    : "text-ground-500 hover:text-ground-900"
              }`}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterCard({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`rounded-2xl ${dark ? "bg-ground-950" : "bg-ground-50"} p-5`}>
      <h3 className={`subheading ${dark ? "text-white" : "text-ground-900"}`}>Get product updates</h3>
      <p className={`body mt-3 ${dark ? "text-ground-400" : "text-ground-500"}`}>
        Monthly notes with release updates, component launches, and product writing.
      </p>
      <div className="mt-5 space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          className={dark ? `${INPUT_CLASS} border-ground-700 bg-ground-900 text-white placeholder:text-ground-500 focus:border-brand-primary` : INPUT_CLASS}
        />
        <Button variant={dark ? "brand" : "default"} className="w-full">
          Subscribe
        </Button>
      </div>
    </div>
  );
}

export default function FooterFourColumnNewsletterDark() {
  return (
    <footer className="w-full bg-ground-900 px-8 py-14 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 border-b border-ground-800 pb-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm">
            <LogoMark dark />
            <p className="body mt-5 text-ground-400">
              A darker footer variant suited to premium product pages and feature-rich editorial sites.
            </p>
          </div>
          <FooterLinks title="Product" links={FOOTER_NAV.product} dark />
          <FooterLinks title="Company" links={FOOTER_NAV.company} dark />
          <NewsletterCard dark />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="caption text-ground-500">© 2026 Northstar. All rights reserved.</p>
          <SocialButtons dark />
        </div>
      </div>
    </footer>
  );
}
