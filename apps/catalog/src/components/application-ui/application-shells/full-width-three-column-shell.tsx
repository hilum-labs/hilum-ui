import { FolderKanban, LayoutDashboard, Settings, Users } from "lucide-react";
import { Badge } from "@hilum/ui";

const CONTENT_ROWS = [
  {
    title: "Weekly performance",
    meta: "Revenue, team velocity, and delivery health",
  },
  {
    title: "Upcoming milestones",
    meta: "Campaign handoff, launch review, and reporting",
  },
  {
    title: "Operations snapshot",
    meta: "Cross-functional blockers and resourcing updates",
  },
];
const COLUMN_ICONS = [LayoutDashboard, Users, FolderKanban, Settings];

function ShellFrame({ children }: { children: any }) {
  return (
    <div className="flex min-h-[480px] overflow-hidden rounded-xl border border-ground-100">
      {children}
    </div>
  );
}

function ChevronMetric({ value }: { value: string }) {
  return <div className="rounded-full bg-white px-3 py-1 caption text-ground-500">{value}</div>;
}

export default function FullWidthThreeColumnShell() {
  return (
    <ShellFrame>
      <aside className="flex w-16 flex-col items-center justify-between bg-ground-900 py-4">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-ground-900">
          <span className="body font-medium">D</span>
        </div>
        <div className="flex flex-col gap-2">
          {COLUMN_ICONS.map((Icon, index) => (
            <button
              key={index}
              type="button"
              className={`flex size-10 items-center justify-center rounded-xl transition-colors ${
                index === 0
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "text-ground-300 hover:bg-ground-800 hover:text-white"
              }`}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-xl text-ground-300 transition-colors hover:bg-ground-800 hover:text-white"
        >
          <Settings className="size-4" />
        </button>
      </aside>
      <div className="flex min-w-0 flex-1 bg-white">
        <div className="min-w-0 flex-1 border-r border-ground-100 p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h3 className="heading text-ground-900">Project activity</h3>
              <p className="caption mt-1 text-ground-400">
                A full-width three-column frame for operators and PMs.
              </p>
            </div>
            <Badge variant="secondary">28 active tasks</Badge>
          </div>
          <div className="space-y-4">
            {CONTENT_ROWS.map((row) => (
              <div key={row.title} className="rounded-xl border border-ground-100 bg-ground-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="body font-medium text-ground-900">{row.title}</p>
                    <p className="caption mt-1 text-ground-400">{row.meta}</p>
                  </div>
                  <ChevronMetric value="84%" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-full rounded-full bg-white" />
                  <div className="h-2 w-11/12 rounded-full bg-white" />
                  <div className="h-2 w-8/12 rounded-full bg-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="hidden w-64 bg-ground-50 p-5 lg:block">
          <p className="label text-ground-400">Secondary Panel</p>
          <div className="mt-4 space-y-3">
            {["Assigned reviewers", "Release checklist", "Recent notes"].map((item) => (
              <div key={item} className="rounded-xl border border-ground-100 bg-white p-4">
                <p className="body font-medium text-ground-900">{item}</p>
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-full rounded-full bg-ground-100" />
                  <div className="h-2 w-8/12 rounded-full bg-ground-100" />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </ShellFrame>
  );
}
