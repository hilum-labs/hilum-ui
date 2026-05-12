
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
    <div className="flex items-center gap-3 text-taupe-900">
      <div className="flex size-10 items-center justify-center rounded-xl body font-semibold bg-taupe-900 text-white">
        NS
      </div>
      <div>
        <p className="body font-medium">Northstar</p>
        <p className="caption text-taupe-500">Design systems for product teams</p>
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
          className="flex size-9 items-center justify-center rounded-full border transition-colors border-taupe-200 bg-white text-taupe-500 hover:border-taupe-300 hover:text-taupe-900"
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}

export default function FooterSimpleCentered() {
  return (
    <footer className="w-full bg-white px-8 py-14">
      <div className="mx-auto max-w-4xl text-center">
        <div className="flex justify-center">
          <LogoMark />
        </div>
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {[...FOOTER_NAV.product, ...FOOTER_NAV.company.slice(0, 2)].map((link) => (
            <a key={link} href="#" className="body text-taupe-500 transition-colors hover:text-taupe-900">
              {link}
            </a>
          ))}
        </nav>
        <div className="mt-8 flex justify-center">
          <SocialButtons />
        </div>
        <p className="caption mt-8 text-taupe-400">© 2026 Northstar. All rights reserved.</p>
      </div>
    </footer>
  );
}
