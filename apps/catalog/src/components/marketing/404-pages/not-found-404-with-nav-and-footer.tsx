import { useState } from "react";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@hilum/ui";

const NAV = ["Product", "Features", "Docs", "Company"];
const FOOTER_NAV = {
  Solutions: ["Marketing", "Analytics", "Commerce", "Insights"],
  Support: ["Pricing", "Docs", "Guides", "API Status"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy", "Terms", "Cookie Policy"],
};

export default function NotFound404WithNavAndFooter() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-[480px] flex-col rounded-xl border border-taupe-100 overflow-hidden">
      {/* Nav */}
      <header className="border-b border-taupe-100 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
          <div className="flex size-6 items-center justify-center rounded-md bg-brand-primary">
            <span className="caption-xs font-bold text-white">D</span>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <a key={item} href="#" className="rounded-md px-3 py-1.5 caption text-taupe-500 hover:bg-taupe-50 hover:text-taupe-900">
                {item}
              </a>
            ))}
          </nav>
          <div className="hidden gap-2 md:flex">
            <Button variant="ghost" size="sm">Sign in</Button>
            <Button size="sm">Sign up</Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <p className="label uppercase tracking-widest text-brand-primary">404 error</p>
        <h1 className="display mt-4 text-taupe-900">Page not found</h1>
        <p className="body mt-3 max-w-sm text-taupe-500">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-6">
          <a href="#" className="body font-semibold text-brand-primary hover:text-brand-primary/80">
            Go back home →
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-taupe-100 bg-taupe-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4">
          {Object.entries(FOOTER_NAV).map(([group, links]) => (
            <div key={group}>
              <p className="label text-taupe-400">{group}</p>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="caption text-taupe-500 hover:text-taupe-900">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-taupe-100 px-5 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <p className="caption text-taupe-400">© 2025 Acme Inc. All rights reserved.</p>
            <div className="flex gap-3 text-taupe-400">
              <a href="#" className="hover:text-taupe-700"><Github size={15} /></a>
              <a href="#" className="hover:text-taupe-700"><Twitter size={15} /></a>
              <a href="#" className="hover:text-taupe-700"><Linkedin size={15} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
