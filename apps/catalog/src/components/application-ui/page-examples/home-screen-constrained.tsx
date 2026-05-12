
import {
  Bell,
  Calendar,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { Badge } from "@hilum/ui";

const APP_NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Team", icon: Users },
  { label: "Projects", icon: FolderKanban },
  { label: "Calendar", icon: Calendar },
  { label: "Settings", icon: Settings },
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

const PROJECTS = [
  { name: "Website Redesign", status: "In Review", due: "Apr 18" },
  { name: "Mobile Analytics", status: "On Track", due: "Apr 21" },
  { name: "CRM Migration", status: "Needs Input", due: "Apr 26" },
];

const TEAM = [
  { name: "Tom Cook", initials: "TC", role: "Product Lead" },
  { name: "Maya Lin", initials: "ML", role: "Designer" },
  { name: "Ari Patel", initials: "AP", role: "Engineer" },
  { name: "Jules Kim", initials: "JK", role: "Ops" },
];

function ExampleFrame({ children }: { children: any }) {
  return (
    <div className="min-h-[600px] overflow-hidden rounded-xl border border-taupe-100 bg-white">
      {children}
    </div>
  );
}

function AvatarStack() {
  return (
    <div className="flex items-center">
      {TEAM.map((member, index) => (
        <div
          key={member.name}
          className={`-ml-2 flex size-10 items-center justify-center rounded-full border-2 border-white bg-taupe-900 text-white first:ml-0 ${
            index === 1 ? "bg-brand-primary" : index === 2 ? "bg-brand-secondary text-taupe-900" : ""
          }`}
        >
          <span className="caption font-medium">{member.initials}</span>
        </div>
      ))}
    </div>
  );
}

export default function HomeScreenConstrained() {
  return (
    <ExampleFrame>
      <div className="flex min-h-[600px] flex-col bg-taupe-50">
        <div className="border-b border-taupe-200 bg-white px-6 py-4">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-2xl bg-brand-primary text-white">
                  <span className="body font-medium">D</span>
                </div>
                <span className="body font-medium text-taupe-900">Design Co.</span>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                {APP_NAV.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    className={`rounded-full px-3 py-1.5 body transition-colors ${
                      index === 2
                        ? "bg-brand-primary/10 text-brand-primary font-medium"
                        : "text-taupe-500 hover:text-taupe-900"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className="rounded-full p-2 text-taupe-400 transition-colors hover:bg-taupe-50 hover:text-taupe-900">
              <Bell className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-6">
              <div className="caption mb-3 flex items-center gap-1.5 text-taupe-400">
                <span>Design System</span>
                <span>/</span>
                <span>Application UI</span>
                <span>/</span>
                <span className="text-taupe-900">Home</span>
              </div>
              <h3 className="heading text-taupe-900">Program overview</h3>
              <p className="caption mt-1 text-taupe-400">
                A constrained dashboard with evenly weighted cards across the first view.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-taupe-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="subheading text-taupe-900">Projects</p>
                  <Badge variant="secondary">3 active</Badge>
                </div>
                <div className="space-y-3">
                  {PROJECTS.map((project) => (
                    <div key={project.name} className="rounded-xl bg-taupe-50 p-4">
                      <p className="body font-medium text-taupe-900">{project.name}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="caption text-taupe-400">{project.status}</p>
                        <p className="caption text-taupe-400">{project.due}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-taupe-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="subheading text-taupe-900">Team</p>
                  <Badge variant="secondary">8 people</Badge>
                </div>
                <AvatarStack />
                <div className="mt-5 space-y-3">
                  {TEAM.slice(0, 3).map((member) => (
                    <div key={member.name} className="flex items-center justify-between rounded-xl bg-taupe-50 px-4 py-3">
                      <div>
                        <p className="body font-medium text-taupe-900">{member.name}</p>
                        <p className="caption text-taupe-400">{member.role}</p>
                      </div>
                      <ChevronRight className="size-4 text-taupe-400" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-taupe-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="subheading text-taupe-900">Recent Activity</p>
                  <Badge variant="secondary">Today</Badge>
                </div>
                <div className="space-y-4">
                  {ACTIVITY_FEED.map((item) => (
                    <div key={item.title}>
                      <p className="body font-medium text-taupe-900">{item.title}</p>
                      <p className="caption mt-1 text-taupe-400">{item.detail}</p>
                      <p className="caption mt-2 text-taupe-400">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExampleFrame>
  );
}
