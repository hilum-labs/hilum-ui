
import { Github, Globe, Linkedin, Twitter } from "lucide-react";

const FOOTER_NAV = {
  product: ["Features", "Pricing", "Changelog", "Documentation"],
  company: ["About", "Blog", "Careers", "Press"],
  legal: ["Privacy", "Terms", "Cookie Policy", "Licenses"],
} as const;

const SOCIALS = [
  { label: "Twitter", Icon: Twitter },
  { label: "GitHub", Icon: Github },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "Web", Icon: Globe },
] as const;

function LogoMark() {
  return (
    <div className="flex items-center gap-3 text-ground-900">
      <div className="flex size-10 items-center justify-center rounded-xl body font-semibold bg-ground-900 text-white">
        NS
      </div>
      <div>
        <p className="body font-medium">Northstar</p>
        <p className="caption text-ground-500">Design systems for product teams</p>
      </div>
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="flex items-center gap-3">
      {SOCIALS.map(({ label, Icon }) => (
        <button
          key={label}
          aria-label={label}
          className="flex size-9 items-center justify-center rounded-full border transition-colors border-ground-200 bg-white text-ground-500 hover:border-ground-300 hover:text-ground-900"
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

export default function FooterFourColumnMission() {
  return (
    <footer className="w-full bg-white px-8 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 border-b border-ground-100 pb-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <LogoMark />
            <p className="body mt-5 text-ground-500">
              Northstar helps teams build design systems that scale across product, marketing, and internal tooling.
            </p>
          </div>
          <FooterLinks title="Product" links={FOOTER_NAV.product} />
          <FooterLinks title="Company" links={FOOTER_NAV.company} />
          <FooterLinks title="Legal" links={FOOTER_NAV.legal} />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <SocialButtons />
          <p className="caption text-ground-400">© 2026 Northstar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
