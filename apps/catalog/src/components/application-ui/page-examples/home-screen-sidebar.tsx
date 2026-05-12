
import {
  Bell,
  Calendar,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const APP_NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Team", icon: Users },
  { label: "Projects", icon: FolderKanban },
  { label: "Calendar", icon: Calendar },
  { label: "Settings", icon: Settings },
];

const STATS = [
  { label: "Total Revenue", value: "$48,890", change: "+12.4%" },
  { label: "Active Users", value: "2,350", change: "+4.8%" },
  { label: "New Orders", value: "48", change: "+9.1%" },
];

const ACTIVITY_FEED = [
  {
    title: "Maya reviewed the launch checklist",
    detail: "Design QA completed for the April release.",
    time: "12 minutes ago",
  },
  {
    title: "Finance approved the enterprise quote",
    detail: "The proposal for Northwind moved to signed.",
    time: "42 minutes ago",
  },
  {
    title: "Tom assigned a new onboarding task",
    detail: "Implementation notes were added to the handoff.",
    time: "1 hour ago",
  },
];

function ExampleFrame({ children }: { children: any }) {
  return (
    <div className="min-h-[600px] overflow-hidden rounded-xl border border-taupe-100 bg-white">
      {children}
    </div>
  );
}

export default function HomeScreenSidebar() {
  return (
    <ExampleFrame>
      <div className="flex min-h-[600px]">
        <aside className="hidden w-60 flex-col bg-taupe-900 md:flex">
          <div className="border-b border-taupe-800 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-taupe-900">
                <span className="body font-medium">D</span>
              </div>
              <div>
                <p className="body font-medium text-white">Design Co.</p>
                <p className="caption text-taupe-300">Operations</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {APP_NAV.map((item, index) => (
                <li key={item.label}>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left body transition-colors ${
                      index === 0
                        ? "bg-taupe-800 text-white font-medium"
                        : "text-taupe-300 hover:bg-taupe-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-taupe-800 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-white text-taupe-900">
                <span className="body font-medium">TC</span>
              </div>
              <div>
                <p className="body font-medium text-white">Tom Cook</p>
                <p className="caption text-taupe-300">tom@example.com</p>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex min-w-0 flex-1 flex-col bg-taupe-50">
          <div className="border-b border-taupe-100 bg-white px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="heading text-taupe-900">Good morning, Tom</p>
                <p className="caption mt-1 text-taupe-400">Here's what changed across the business since yesterday.</p>
              </div>
              <Button size="sm">
                <Sparkles className="size-4" />
                Create Summary
              </Button>
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="grid gap-4 lg:grid-cols-3">
              {STATS.map((stat, index) => (
                <div key={stat.label} className="rounded-2xl border border-taupe-100 bg-white p-5">
                  <p className="caption text-taupe-400">{stat.label}</p>
                  <p className="heading mt-2 text-taupe-900">{stat.value}</p>
                  <p className={`caption mt-2 ${index === 2 ? "text-brand-primary" : "text-taupe-400"}`}>
                    {stat.change} vs last week
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-taupe-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="subheading text-taupe-900">Activity feed</p>
                    <p className="caption text-taupe-400">Live updates from projects, ops, and sales.</p>
                  </div>
                  <Badge variant="secondary">6 new</Badge>
                </div>
                <div className="space-y-4">
                  {ACTIVITY_FEED.map((item) => (
                    <div key={item.title} className="rounded-xl bg-taupe-50 p-4">
                      <p className="body font-medium text-taupe-900">{item.title}</p>
                      <p className="caption mt-1 text-taupe-400">{item.detail}</p>
                      <p className="caption mt-3 text-taupe-400">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-taupe-100 bg-white p-5">
                <div className="mb-4">
                  <p className="subheading text-taupe-900">Quick links</p>
                  <p className="caption text-taupe-400">Common destinations for the team.</p>
                </div>
                <div className="space-y-3">
                  {[
                    "Review launch checklist",
                    "Approve April budget",
                    "Open people directory",
                    "View calendar",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="flex w-full items-center justify-between rounded-xl border border-taupe-100 bg-taupe-50 px-4 py-3 text-left transition-colors hover:border-brand-primary/30 hover:bg-white"
                    >
                      <span className="body font-medium text-taupe-900">{item}</span>
                      <ChevronRight className="size-4 text-taupe-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ExampleFrame>
  );
}
