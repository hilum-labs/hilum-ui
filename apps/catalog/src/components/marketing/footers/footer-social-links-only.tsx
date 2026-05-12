
import { Github, Globe, Linkedin, Twitter } from "lucide-react";

const SOCIALS = [
  { label: "Twitter", Icon: Twitter },
  { label: "GitHub", Icon: Github },
  { label: "LinkedIn", Icon: Linkedin },
  { label: "Web", Icon: Globe },
] as const;

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

export default function FooterSocialLinksOnly() {
  return (
    <footer className="w-full bg-white px-8 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="heading text-taupe-900">Northstar</p>
        <div className="mt-6 flex justify-center">
          <SocialButtons />
        </div>
        <p className="caption mt-6 text-taupe-400">© 2026 Northstar. Crafted for modern product teams.</p>
      </div>
    </footer>
  );
}
