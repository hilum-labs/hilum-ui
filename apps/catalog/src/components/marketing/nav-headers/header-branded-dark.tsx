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
          dark ? "bg-brand-secondary text-ground-900" : "bg-brand-primary text-white",
        )}
      >
        D
      </div>
      <span className={cn("subheading", dark ? "text-white" : "text-ground-900")}>Acme</span>
    </div>
  );
}

function DesktopLinks({ centered = false, dark = false }: { centered?: boolean; dark?: boolean }) {
  return (
    <nav className={cn("hidden items-center gap-6 md:flex", centered && "flex-1 justify-center")}>
      {NAV_LINKS.map((link) => (
        <a
          key={link}
          href={`#${link.toLowerCase()}`}
          className={cn(
            "body transition-colors",
            dark ? "text-ground-300 hover:text-white" : "text-ground-600 hover:text-ground-900",
          )}
        >
          {link}
        </a>
      ))}
    </nav>
  );
}

function MobileMenuButton({ onClick, dark = false }: { onClick: () => void; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden",
        dark
          ? "text-ground-300 hover:bg-ground-800 hover:text-white"
          : "text-ground-600 hover:bg-ground-100 hover:text-ground-900",
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
        dark ? "border-ground-700 bg-ground-900" : "border-ground-100 bg-white",
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <Logo dark={dark} />
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
            dark
              ? "text-ground-300 hover:bg-ground-800 hover:text-white"
              : "text-ground-500 hover:bg-ground-100 hover:text-ground-900",
          )}
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  );
}

export default function HeaderBrandedDark() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-[16rem] w-full bg-ground-950">
      <header className="border-b border-ground-800 bg-ground-900 px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <Logo dark />
          <DesktopLinks dark />
          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="sm"
              className="text-ground-400 hover:bg-ground-800 hover:text-white"
            >
              Sign in
            </Button>
            <Button
              size="sm"
              className="bg-brand-secondary text-ground-900 hover:bg-brand-secondary/90"
            >
              Get started
            </Button>
          </div>
          <MobileMenuButton dark onClick={() => setMobileOpen(true)} />
        </div>
      </header>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} dark>
        <nav className="space-y-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="block rounded-lg px-3 py-3 body text-ground-300 transition-colors hover:bg-ground-800 hover:text-white"
            >
              {link}
            </a>
          ))}
        </nav>
        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-ground-400 hover:bg-ground-800 hover:text-white"
          >
            Sign in
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-brand-secondary text-ground-900 hover:bg-brand-secondary/90"
          >
            Get started
          </Button>
        </div>
      </MobileDrawer>

      <div className="px-6 py-10">
        <div className="rounded-2xl border border-dashed border-ground-700 bg-ground-900 p-6">
          <p className="body text-ground-300">
            A branded dark header shifts the tone immediately while keeping the interaction model
            familiar.
          </p>
        </div>
      </div>
    </div>
  );
}
