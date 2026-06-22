import { useState } from "react";
import { type LucideIcon, ExternalLink, Globe, ChevronDown, Users, Zap } from "lucide-react";
import { Button } from "@hilum/ui";
import { cn } from "@hilum/ui";

type FlyoutItem = {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

const STACKED_ITEMS: FlyoutItem[] = [
  {
    name: "Global infrastructure",
    description: "Ship in every market with shared standards.",
    icon: Globe,
    href: "#infrastructure",
  },
  {
    name: "Customer workspaces",
    description: "Give every team a clear place to manage launches.",
    icon: Users,
    href: "#workspaces",
  },
  {
    name: "Launch automation",
    description: "Trigger approvals, rollouts, and alerts automatically.",
    icon: Zap,
    href: "#launch-automation",
  },
];

function FlyoutLink({ item, iconClassName }: { item: FlyoutItem; iconClassName?: string }) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-ground-50"
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg bg-ground-100 text-ground-700",
          iconClassName,
        )}
      >
        <Icon size={18} />
      </div>
      <div>
        <p className="body font-medium text-ground-900">{item.name}</p>
        <p className="caption mt-1 text-ground-500">{item.description}</p>
      </div>
    </a>
  );
}

export default function FlyoutStackedFooterActions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-[19rem] bg-white">
      <div className="flex items-center justify-between border-b border-ground-100 px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="subheading text-ground-900">Acme</span>
          <div className="flex items-center gap-6">
            <a href="#solutions" className="body text-ground-500 hover:text-ground-900">
              Solutions
            </a>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="inline-flex items-center gap-1 body font-medium text-ground-700 transition-colors hover:text-ground-900"
              >
                Products
                <ChevronDown
                  size={14}
                  className={cn("transition-transform", open && "rotate-180")}
                />
              </button>
              {open ? (
                <div className="absolute left-1/2 z-10 mt-3 w-80 -translate-x-1/2 rounded-xl border border-ground-100 bg-white p-2 shadow-elevated ring-1 ring-ground-100/50">
                  {STACKED_ITEMS.map((item) => (
                    <FlyoutLink key={item.name} item={item} />
                  ))}
                  <div className="mt-2 border-t border-ground-100 px-3 pt-3">
                    <div className="flex items-center justify-between gap-4">
                      {[
                        { label: "View all products", href: "#all-products" },
                        { label: "Watch demo", href: "#watch-demo" },
                      ].map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          className="inline-flex items-center gap-1.5 caption font-medium text-ground-600 transition-colors hover:text-ground-900"
                        >
                          {link.label}
                          <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          Contact sales
        </Button>
      </div>
      <div className="px-6 py-12">
        <div className="rounded-2xl border border-dashed border-ground-200 bg-ground-50 p-6">
          <p className="body text-ground-500">
            Footer actions work well when the menu is primarily navigational but still needs quick
            escape hatches for deeper exploration.
          </p>
        </div>
      </div>
    </div>
  );
}
