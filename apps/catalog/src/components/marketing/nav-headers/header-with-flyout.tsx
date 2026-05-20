
import { type ReactNode, useState } from "react";
import {
  type LucideIcon,
  BarChart2,
  ChevronDown,
  Layers,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { cn } from "@hilum/ui";

const NAV_LINKS = ["Product", "Features", "Pricing", "Company"];

const SOLUTION_LINKS: Array<{
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
}> = [
  {
    name: "Revenue analytics",
    description: "Measure funnel performance, attribution, and launch impact.",
    icon: BarChart2,
    href: "#revenue-analytics",
  },
  {
    name: "Platform foundations",
    description: "Build product surfaces from a shared system architecture.",
    icon: Layers,
    href: "#platform-foundations",
  },
  {
    name: "Workflow automation",
    description: "Coordinate approvals, alerts, and releases with fewer steps.",
    icon: Zap,
    href: "#workflow-automation",
  },
];

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
          dark ? "bg-brand-secondary text-ground-900" : "bg-brand-primary text-white"
        )}
      >
        D
      </div>
      <span className={cn("subheading", dark ? "text-white" : "text-ground-900")}>Acme</span>
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
          ? "text-ground-300 hover:bg-ground-800 hover:text-white"
          : "text-ground-600 hover:bg-ground-100 hover:text-ground-900"
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
        dark ? "border-ground-700 bg-ground-900" : "border-ground-100 bg-white"
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
              ? "text-ground-300 hover:bg-ground-800 hover:text-white"
              : "text-ground-500 hover:bg-ground-100 hover:text-ground-900"
          )}
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  );
}

export default function HeaderWithFlyout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const links = NAV_LINKS.filter((link) => link !== "Product");

  return (
    <div className="relative min-h-[24rem] w-full bg-white">
      <header className="relative border-b border-ground-100 bg-white px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <button
              type="button"
              onClick={() => setFlyoutOpen(!flyoutOpen)}
              className="inline-flex items-center gap-1 body text-ground-600 transition-colors hover:text-ground-900"
            >
              Solutions
              <ChevronDown
                size={14}
                className={cn("transition-transform", flyoutOpen && "rotate-180")}
              />
            </button>
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="body text-ground-600 transition-colors hover:text-ground-900"
              >
                {link}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
            <Button size="sm">Sign up</Button>
          </div>
          <MobileMenuButton onClick={() => setMobileOpen(true)} />
        </div>

        {flyoutOpen ? (
          <div className="absolute inset-x-0 top-full z-10 hidden border-t border-ground-100 bg-white shadow-elevated md:block">
            <div className="grid gap-8 px-6 py-6 md:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <h3 className="label text-ground-400">Solutions</h3>
                  <div className="h-px flex-1 bg-ground-100" />
                </div>
                <div className="space-y-2">
                  {SOLUTION_LINKS.map((link) => {
                    const Icon = link.icon;

                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-ground-50"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-ground-100 text-ground-700">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="body font-medium text-ground-900">{link.name}</p>
                          <p className="caption mt-1 text-ground-500">{link.description}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-xl bg-ground-50 p-4">
                <Badge variant="secondary">Featured</Badge>
                <h3 className="subheading mt-3 text-ground-900">Build a launch system your whole org can use</h3>
                <p className="body mt-2 text-ground-500">
                  Package analytics, rollout controls, and modular UI into one shared operating model for product teams.
                </p>
                <Button variant="secondary" size="sm" className="mt-4">
                  Read the overview
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => {
          setMobileOpen(false);
          setFlyoutOpen(false);
        }}
      >
        <nav className="space-y-2">
          <button
            type="button"
            onClick={() => setFlyoutOpen(!flyoutOpen)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-3 body text-ground-700 transition-colors hover:bg-ground-50 hover:text-ground-900"
          >
            Solutions
            <ChevronDown
              size={14}
              className={cn("transition-transform", flyoutOpen && "rotate-180")}
            />
          </button>
          {flyoutOpen ? (
            <div className="space-y-2 px-3 pb-1">
              {SOLUTION_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block rounded-lg border border-ground-100 bg-ground-50 px-3 py-3"
                >
                  <p className="body font-medium text-ground-900">{link.name}</p>
                  <p className="caption mt-1 text-ground-500">{link.description}</p>
                </a>
              ))}
            </div>
          ) : null}
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="block rounded-lg px-3 py-3 body text-ground-700 transition-colors hover:bg-ground-50 hover:text-ground-900"
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
        <div className="rounded-2xl border border-dashed border-ground-200 bg-ground-50 p-6">
          <p className="body max-w-2xl text-ground-500">
            A full-width flyout turns the primary navigation into a richer discovery layer without changing the header footprint.
          </p>
        </div>
      </div>
    </div>
  );
}
