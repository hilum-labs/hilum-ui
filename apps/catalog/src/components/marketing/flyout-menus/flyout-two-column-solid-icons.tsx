
import { useState } from "react";
import {
  type LucideIcon,
  BarChart2,
  ChevronDown,
  Globe,
  Layers,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@hilum/ui";

type FlyoutItem = {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

const FEATURE_GRID_ITEMS: FlyoutItem[] = [
  {
    name: "Dashboards",
    description: "Track release health in real time.",
    icon: BarChart2,
    href: "#dashboards",
  },
  {
    name: "Modular stacks",
    description: "Compose flows from reusable primitives.",
    icon: Layers,
    href: "#modular-stacks",
  },
  {
    name: "Smart automations",
    description: "Reduce manual work across teams.",
    icon: Zap,
    href: "#smart-automations",
  },
  {
    name: "Secure controls",
    description: "Guard access with enterprise policies.",
    icon: Shield,
    href: "#secure-controls",
  },
  {
    name: "Global reach",
    description: "Launch in every region with confidence.",
    icon: Globe,
    href: "#global-reach",
  },
  {
    name: "Shared spaces",
    description: "Keep product, design, and ops aligned.",
    icon: Users,
    href: "#shared-spaces",
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

export default function FlyoutTwoColumnSolidIcons() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-[20rem] bg-white">
      <div className="flex items-center justify-between border-b border-taupe-100 px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="subheading text-taupe-900">Acme</span>
          <a href="#enterprise" className="body text-taupe-500 hover:text-taupe-900">
            Enterprise
          </a>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-1 body font-medium text-taupe-700 transition-colors hover:text-taupe-900"
          >
            Features
            <ChevronDown
              size={14}
              className={cn("transition-transform", open && "rotate-180")}
            />
          </button>
          {open ? (
            <div className="absolute right-0 z-10 mt-3 w-96 rounded-xl border border-taupe-100 bg-white p-4 shadow-elevated ring-1 ring-taupe-100/50">
              <div className="grid grid-cols-2 gap-2">
                {FEATURE_GRID_ITEMS.map((item) => (
                  <FlyoutLink
                    key={item.name}
                    item={item}
                    iconClassName="bg-brand-primary text-white"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="px-6 py-12">
        <div className="rounded-2xl border border-dashed border-taupe-200 bg-taupe-50 p-6">
          <p className="body text-taupe-500">
            Wider, two-column flyouts work best once the product surface grows beyond a simple stacked list.
          </p>
        </div>
      </div>
    </div>
  );
}
