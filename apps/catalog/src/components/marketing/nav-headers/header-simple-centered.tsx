
import { type ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@hilum/ui";
import { cn } from "@hilum/ui";

const NAV_LINKS = ["Product", "Features", "Pricing", "Company"];

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
          dark ? "bg-brand-secondary text-taupe-900" : "bg-brand-primary text-white"
        )}
      >
        D
      </div>
      <span className={cn("subheading", dark ? "text-white" : "text-taupe-900")}>Acme</span>
    </div>
  );
}

function DesktopLinks({
  centered = false,
  dark = false,
}: {
  centered?: boolean;
  dark?: boolean;
}) {
  return (
    <nav
      className={cn(
        "hidden items-center gap-6 md:flex",
        centered && "flex-1 justify-center"
      )}
    >
      {NAV_LINKS.map((link) => (
        <a
          key={link}
          href={`#${link.toLowerCase()}`}
          className={cn(
            "body transition-colors",
            dark ? "text-taupe-300 hover:text-white" : "text-taupe-600 hover:text-taupe-900"
          )}
        >
          {link}
        </a>
      ))}
    </nav>
  );
}

function MobileMenuButton({
  onClick,
  dark = false,
}: {
  onClick: () => void;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden",
        dark
          ? "text-taupe-300 hover:bg-taupe-800 hover:text-white"
          : "text-taupe-600 hover:bg-taupe-100 hover:text-taupe-900"
      )}
    >
      <Menu size={18} />
    </button>
  );
}

function MobileDrawer({
  open,
  onClose,
  dark = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  dark?: boolean;
  children: ReactNode;
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute inset-x-0 top-0 z-50 rounded-xl border p-4 shadow-elevated",
        dark ? "border-taupe-700 bg-taupe-900" : "border-taupe-100 bg-white"
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <Logo dark={dark} />
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
            dark
              ? "text-taupe-300 hover:bg-taupe-800 hover:text-white"
              : "text-taupe-500 hover:bg-taupe-100 hover:text-taupe-900"
          )}
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  );
}

export default function HeaderSimpleCentered() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-[16rem] w-full bg-white">
      <header className="border-b border-taupe-100 px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <Logo />
          <DesktopLinks centered />
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
            <Button size="sm">Sign up</Button>
          </div>
          <MobileMenuButton onClick={() => setMobileOpen(true)} />
        </div>
      </header>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <nav className="space-y-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="block rounded-lg px-3 py-3 body text-taupe-700 transition-colors hover:bg-taupe-50 hover:text-taupe-900"
            >
              {link}
            </a>
          ))}
        </nav>
        <div className="mt-4 flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex-1">
            Sign in
          </Button>
          <Button size="sm" className="flex-1">
            Sign up
          </Button>
        </div>
      </MobileDrawer>

      <div className="px-6 py-10">
        <div className="rounded-2xl border border-dashed border-taupe-200 bg-taupe-50 p-6">
          <p className="body text-taupe-500">
            Centering the link group gives the logo more separation while keeping calls to action fixed on the right.
          </p>
        </div>
      </div>
    </div>
  );
}
