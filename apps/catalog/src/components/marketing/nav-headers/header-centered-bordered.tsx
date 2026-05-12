
import { type ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
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

export default function HeaderCenteredBordered() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-[16rem] w-full bg-white">
      <header className="border-b border-taupe-200 bg-white">
        <div className="relative px-6 py-5">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 md:hidden">
            <MobileMenuButton onClick={() => setMobileOpen(true)} />
          </div>
        </div>
        <div className="hidden items-center justify-center gap-8 border-t border-taupe-100 px-6 py-4 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="body text-taupe-600 transition-colors hover:text-taupe-900"
            >
              {link}
            </a>
          ))}
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
      </MobileDrawer>

      <div className="px-6 py-10">
        <div className="rounded-2xl border border-dashed border-taupe-200 bg-taupe-50 p-6">
          <p className="body text-taupe-500">
            This version strips the header back to centered brand presence and a quiet secondary navigation row.
          </p>
        </div>
      </div>
    </div>
  );
}
