
import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Download,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Upload,
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

const PROJECT_TABS = ["Overview", "Activity", "Files", "Settings"];
const FILE_ITEMS = [
  { name: "Homepage brief.pdf", detail: "Briefing document", icon: Download },
  { name: "Wireframe-v3.fig", detail: "Latest design file", icon: Upload },
  { name: "Launch-checklist.docx", detail: "Go-live handoff", icon: Download },
  { name: "Analytics-plan.csv", detail: "Reporting setup", icon: Download },
];

function ExampleFrame({ children }: { children: any }) {
  return (
    <div className="min-h-[600px] overflow-hidden rounded-xl border border-ground-100 bg-white">
      {children}
    </div>
  );
}

export default function ProjectDetailScreen() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <ExampleFrame>
      <div className="flex min-h-[600px] flex-col bg-ground-50">
        <div className="border-b border-ground-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-2xl bg-brand-primary text-white">
                  <span className="body font-medium">D</span>
                </div>
                <span className="body font-medium text-ground-900">Design Co.</span>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                {APP_NAV.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    className={`rounded-full px-3 py-1.5 body transition-colors ${
                      index === 2
                        ? "bg-brand-primary/10 text-brand-primary font-medium"
                        : "text-ground-500 hover:text-ground-900"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <Button size="sm">Share</Button>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="rounded-2xl border border-ground-100 bg-white p-6">
            <div className="caption mb-3 flex items-center gap-1.5 text-ground-400">
              <span>Projects</span>
              <ChevronRight className="size-3" />
              <span className="text-ground-900">Website Redesign</span>
            </div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <h3 className="heading text-ground-900">Website Redesign</h3>
              <Badge className="bg-brand-secondary/20 text-ground-800">Active</Badge>
            </div>
            <div className="mb-6 flex flex-wrap gap-2 border-b border-ground-100 pb-4">
              {PROJECT_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-3 py-1.5 body transition-colors ${
                    activeTab === tab
                      ? "bg-brand-primary/10 text-brand-primary font-medium"
                      : "text-ground-500 hover:text-ground-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Overview" && (
              <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="body text-ground-600">
                    The redesign project is focused on simplifying the marketing site, tightening conversion flows,
                    and aligning content design across product launches.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      ["Owner", "Tom Cook"],
                      ["Timeline", "Apr 12 - May 30"],
                      ["Budget", "$84,000"],
                      ["Review cadence", "Weekly"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-ground-50 p-4">
                        <p className="label text-ground-400">{label}</p>
                        <p className="body mt-2 font-medium text-ground-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-ground-100 bg-ground-50 p-4">
                  <p className="subheading text-ground-900">Milestones</p>
                  <div className="mt-4 space-y-3">
                    {["Audit complete", "Wireframes approved", "Final QA review"].map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className={`flex size-8 items-center justify-center rounded-full ${index < 2 ? "bg-brand-secondary/20 text-ground-900" : "bg-white text-ground-500"}`}>
                          <CheckCircle2 className="size-4" />
                        </div>
                        <div>
                          <p className="body font-medium text-ground-900">{item}</p>
                          <p className="caption text-ground-400">{index < 2 ? "Completed" : "Due next week"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Activity" && (
              <div className="space-y-4">
                {ACTIVITY_FEED.map((item) => (
                  <div key={item.title} className="rounded-xl bg-ground-50 p-4">
                    <p className="body font-medium text-ground-900">{item.title}</p>
                    <p className="caption mt-1 text-ground-400">{item.detail}</p>
                    <p className="caption mt-3 text-ground-400">{item.time}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Files" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {FILE_ITEMS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.name} className="rounded-xl border border-ground-100 bg-ground-50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="body font-medium text-ground-900">{item.name}</p>
                          <p className="caption mt-1 text-ground-400">{item.detail}</p>
                        </div>
                        <div className="flex size-9 items-center justify-center rounded-full bg-white text-ground-600">
                          <Icon className="size-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "Settings" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Project visibility", "Shared with marketing, product, and exec team"],
                  ["Approval flow", "Design lead and finance must sign off"],
                  ["Notifications", "Daily digest at 9:00 AM"],
                  ["Connected tools", "Figma, Notion, and Analytics"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-ground-100 bg-ground-50 p-4">
                    <p className="label text-ground-400">{label}</p>
                    <p className="body mt-2 font-medium text-ground-900">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ExampleFrame>
  );
}
