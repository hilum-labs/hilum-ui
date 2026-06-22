import { useState } from "react";
import { type LucideIcon, BarChart2, ChevronDown, Globe, Layers, Shield, Zap } from "lucide-react";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { cn } from "@hilum/ui";

type FlyoutItem = {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

const FULL_WIDTH_ITEMS: FlyoutItem[] = [
  {
    name: "Revenue intelligence",
    description: "Unify funnel reporting, attribution, and campaign insights.",
    icon: BarChart2,
    href: "#revenue-intelligence",
  },
  {
    name: "Composable platform",
    description: "Connect services, data, and deployment rules from one layer.",
    icon: Layers,
    href: "#composable-platform",
  },
  {
    name: "Workflow engine",
    description: "Automate launch steps, approvals, and notifications.",
    icon: Zap,
    href: "#workflow-engine",
  },
  {
    name: "Governance",
    description: "Protect access, roles, and release quality across teams.",
    icon: Shield,
    href: "#governance",
  },
];

const RECENT_POSTS = [
  {
    title: "How growth teams design a launch cockpit that stays usable at scale",
    date: "April 4, 2026",
  },
  {
    title: "A practical pattern library for reporting, approvals, and handoff",
    date: "March 22, 2026",
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

export default function FlyoutFullWidth() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-[26rem] bg-white">
      <div className="flex items-center justify-between border-b border-ground-100 px-6 py-4">
        <div className="flex items-center gap-10">
          <span className="subheading text-ground-900">Acme</span>
          <div className="flex items-center gap-6">
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
            </div>
            <a href="#pricing" className="body text-ground-500 hover:text-ground-900">
              Pricing
            </a>
            <a href="#docs" className="body text-ground-500 hover:text-ground-900">
              Docs
            </a>
          </div>
        </div>
        <Button size="sm">Start free</Button>
      </div>

      {open ? (
        <div className="absolute left-0 top-[4.5rem] z-10 w-full border-t border-ground-100 bg-white shadow-elevated">
          <div className="grid gap-8 px-6 py-6 md:grid-cols-[1.35fr_0.85fr]">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <h3 className="label text-ground-400">Explore products</h3>
                <div className="h-px flex-1 bg-ground-100" />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {FULL_WIDTH_ITEMS.map((item) => (
                  <FlyoutLink key={item.name} item={item} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-ground-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="label text-ground-400">Recent posts</h3>
                <Badge variant="secondary">Editorial</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {RECENT_POSTS.map((post) => (
                  <a
                    key={post.title}
                    href={`#${post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="block rounded-xl border border-ground-100 bg-white p-4 transition-colors hover:border-ground-200 hover:bg-ground-50"
                  >
                    <p className="body font-medium text-ground-900">{post.title}</p>
                    <p className="caption mt-2 text-ground-500">{post.date}</p>
                  </a>
                ))}
              </div>
              <Button variant="secondary" size="sm" className="mt-4">
                Read all posts
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="px-6 py-12">
        <div className="rounded-2xl border border-dashed border-ground-200 bg-ground-50 p-6">
          <p className="body max-w-2xl text-ground-500">
            Full-width panels let the menu behave like a small landing surface, combining navigation
            with editorial context.
          </p>
        </div>
      </div>
    </div>
  );
}
