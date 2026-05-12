
import { useState } from "react";
import {
  type LucideIcon,
  BarChart2,
  ChevronDown,
  Layers,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "@hilum/ui";

type FlyoutItem = {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

const SIMPLE_ITEMS: FlyoutItem[] = [
  {
    name: "Analytics",
    description: "Track performance",
    icon: BarChart2,
    href: "#analytics",
  },
  {
    name: "Platform",
    description: "Build on our stack",
    icon: Layers,
    href: "#platform",
  },
  {
    name: "Automation",
    description: "Automate workflows",
    icon: Zap,
    href: "#automation",
  },
  {
    name: "Security",
    description: "Enterprise-grade security",
    icon: Shield,
    href: "#security",
  },
];

function FlyoutLink({
  item,
  iconClassName,
}: {
  item: FlyoutItem;
  iconClassName?: string;
}) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-taupe-50"
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg bg-taupe-100 text-taupe-700",
          iconClassName
        )}
      >
        <Icon size={18} />
      </div>
      <div>
        <p className="body font-medium text-taupe-900">{item.name}</p>
        <p className="caption mt-1 text-taupe-500">{item.description}</p>
      </div>
    </a>
  );
}

export default function FlyoutSimple() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-[19rem] bg-white">
      <div className="flex items-center justify-between border-b border-taupe-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-brand-primary text-sm font-semibold text-white">
            D
          </div>
          <div>
            <p className="subheading text-taupe-900">Acme</p>
            <p className="caption text-taupe-400">Product navigation</p>
          </div>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-1 body font-medium text-taupe-700 transition-colors hover:text-taupe-900"
          >
            Products
            <ChevronDown
              size={14}
              className={cn("transition-transform", open && "rotate-180")}
            />
          </button>
          {open ? (
            <div className="absolute left-1/2 z-10 mt-3 w-72 -translate-x-1/2 rounded-xl border border-taupe-100 bg-white p-2 shadow-elevated ring-1 ring-taupe-100/50">
              {SIMPLE_ITEMS.map((item) => (
                <FlyoutLink key={item.name} item={item} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="px-6 py-12">
        <div className="rounded-2xl border border-dashed border-taupe-200 bg-taupe-50 p-6">
          <p className="label text-taupe-400">Mock page content</p>
          <p className="body mt-2 max-w-xl text-taupe-500">
            Use a compact flyout for a short product list with fast scan labels and concise supporting detail.
          </p>
        </div>
      </div>
    </div>
  );
}
