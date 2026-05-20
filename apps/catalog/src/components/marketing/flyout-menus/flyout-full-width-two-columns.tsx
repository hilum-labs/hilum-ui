
import { useState } from "react";
import {
  type LucideIcon,
  BarChart2,
  BookOpen,
  ChevronDown,
  FileText,
  Layers,
  MessageSquare,
  Zap,
} from "lucide-react";
import { Badge } from "@hilum/ui";
import { cn } from "@hilum/ui";

type FlyoutItem = {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

const PRODUCT_LINKS: FlyoutItem[] = [
  {
    name: "Growth Suite",
    description: "Measure launches, experiments, and acquisition in one workspace.",
    icon: BarChart2,
    href: "#growth-suite",
  },
  {
    name: "Platform Core",
    description: "Ship interfaces on top of a shared system architecture.",
    icon: Layers,
    href: "#platform-core",
  },
  {
    name: "Automation Studio",
    description: "Build rules, approvals, and notifications without friction.",
    icon: Zap,
    href: "#automation-studio",
  },
];

const RESOURCE_LINKS: FlyoutItem[] = [
  {
    name: "Guides",
    description: "Implementation playbooks for design and engineering teams.",
    icon: BookOpen,
    href: "#guides",
  },
  {
    name: "Community",
    description: "Join product operators sharing templates and lessons learned.",
    icon: MessageSquare,
    href: "#community",
  },
  {
    name: "Documentation",
    description: "Reference every token, component, and integration endpoint.",
    icon: FileText,
    href: "#documentation",
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
      className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-ground-50"
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg bg-ground-100 text-ground-700",
          iconClassName
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

export default function FlyoutFullWidthTwoColumns() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-[24rem] bg-white">
      <div className="flex items-center justify-between border-b border-ground-100 px-6 py-4">
        <div className="flex items-center gap-10">
          <span className="subheading text-ground-900">Acme</span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="inline-flex items-center gap-1 body font-medium text-ground-700 transition-colors hover:text-ground-900"
            >
              Solutions
              <ChevronDown
                size={14}
                className={cn("transition-transform", open && "rotate-180")}
              />
            </button>
          </div>
        </div>
        <Badge variant="warning">New resources</Badge>
      </div>

      {open ? (
        <div className="absolute left-0 top-[4.5rem] z-10 w-full border-t border-ground-100 bg-white shadow-elevated">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="px-6 py-6">
              <div className="mb-4 flex items-center gap-3">
                <h3 className="label text-ground-400">Products</h3>
                <div className="h-px flex-1 bg-ground-100" />
              </div>
              <div className="space-y-2">
                {PRODUCT_LINKS.map((item) => (
                  <FlyoutLink key={item.name} item={item} />
                ))}
              </div>
            </div>
            <div className="border-t border-ground-100 px-6 py-6 md:border-l md:border-t-0">
              <div className="mb-4 flex items-center gap-3">
                <h3 className="label text-ground-400">Resources</h3>
                <div className="h-px flex-1 bg-ground-100" />
              </div>
              <div className="space-y-2">
                {RESOURCE_LINKS.map((item) => (
                  <FlyoutLink key={item.name} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="px-6 py-12">
        <div className="rounded-2xl border border-dashed border-ground-200 bg-ground-50 p-6">
          <p className="body max-w-2xl text-ground-500">
            Split layouts separate primary product discovery from educational and support resources without overcrowding either side.
          </p>
        </div>
      </div>
    </div>
  );
}
