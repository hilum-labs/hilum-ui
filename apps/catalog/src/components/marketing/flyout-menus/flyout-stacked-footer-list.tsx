import { useState } from "react";
import { type LucideIcon, BarChart2, ChevronDown, Layers } from "lucide-react";
import { cn } from "@hilum/ui";

type FlyoutItem = {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

const MAIN_LIST_ITEMS: FlyoutItem[] = [
  {
    name: "Developer platform",
    description: "Composable building blocks for product teams.",
    icon: Layers,
    href: "#developer-platform",
  },
  {
    name: "Growth analytics",
    description: "See conversion, retention, and launch impact in one place.",
    icon: BarChart2,
    href: "#growth-analytics",
  },
];

const SECONDARY_LINKS = [
  "Pricing calculator",
  "Migration support",
  "Partner directory",
  "Security overview",
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

export default function FlyoutStackedFooterList() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-[19rem] bg-white">
      <div className="flex items-center justify-between border-b border-ground-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-secondary text-sm font-semibold text-ground-900">
            A
          </div>
          <span className="subheading text-ground-900">Atlas</span>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-1 body font-medium text-ground-700 transition-colors hover:text-ground-900"
          >
            Platform
            <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
          </button>
          {open ? (
            <div className="absolute right-0 z-10 mt-3 w-[22rem] rounded-xl border border-ground-100 bg-white shadow-elevated ring-1 ring-ground-100/50">
              <div className="p-2">
                {MAIN_LIST_ITEMS.map((item) => (
                  <FlyoutLink key={item.name} item={item} />
                ))}
              </div>
              <div className="rounded-b-xl bg-ground-50 p-3">
                <p className="caption px-2 text-ground-400">Quick links</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {SECONDARY_LINKS.map((link) => (
                    <a
                      key={link}
                      href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="rounded-lg px-2 py-2 body text-sm text-ground-600 transition-colors hover:bg-white hover:text-ground-900"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="px-6 py-12">
        <div className="rounded-2xl border border-dashed border-ground-200 bg-ground-50 p-6">
          <p className="body text-ground-500">
            This pattern balances two primary destinations with a denser utility list below.
          </p>
        </div>
      </div>
    </div>
  );
}
