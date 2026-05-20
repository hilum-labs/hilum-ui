
import { Button } from "@hilum/ui";

const NAV_ITEMS = ["Dashboard", "Team", "Projects", "Calendar", "Reports"];
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

function ShellFrame({ children }: { children: any }) {
  return (
    <div className="flex min-h-[480px] overflow-hidden rounded-xl border border-ground-100">
      {children}
    </div>
  );
}

function LogoMark({ tone }: { tone: "light" | "dark" | "brand" }) {
  const classes =
    tone === "light"
      ? "bg-brand-primary text-white"
      : tone === "dark"
        ? "bg-white text-ground-900"
        : "bg-white/15 text-white";

  return (
    <div className="flex items-center gap-3">
      <div className={`flex size-9 items-center justify-center rounded-xl ${classes}`}>
        <span className="subheading font-medium">D</span>
      </div>
      <div>
        <p className={tone === "light" ? "body font-medium text-ground-900" : "body font-medium text-white"}>
          Design Co.
        </p>
        <p className={tone === "light" ? "caption text-ground-400" : "caption text-white/60"}>
          Product workspace
        </p>
      </div>
    </div>
  );
}

function SidebarNav({ tone }: { tone: "light" | "dark" | "brand" }) {
  return (
    <nav className="flex-1 px-3 py-4">
      <ul className="space-y-1">
        {NAV_ITEMS.map((item, index) => {
          const isActive = index === 0;
          let itemClass = "text-ground-500 hover:bg-ground-50 hover:text-ground-900";

          if (tone === "light") {
            itemClass = isActive
              ? "bg-brand-primary/10 text-brand-primary font-medium"
              : "text-ground-500 hover:bg-ground-50 hover:text-ground-900";
          }

          if (tone === "dark") {
            itemClass = isActive
              ? "bg-ground-800 text-white font-medium"
              : "text-ground-300 hover:bg-ground-800 hover:text-white";
          }

          if (tone === "brand") {
            itemClass = isActive
              ? "bg-white/10 text-white font-medium"
              : "text-white/70 hover:bg-white/10 hover:text-white";
          }

          return (
            <li key={item}>
              <button
                type="button"
                className={`flex w-full items-center rounded-lg px-3 py-2 text-left body transition-colors ${itemClass}`}
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function ConstrainedThreeColumnShell() {
  return (
    <ShellFrame>
      <div className="flex flex-1 bg-ground-50 p-4">
        <div className="mx-auto flex w-full max-w-7xl overflow-hidden rounded-2xl border border-ground-100 bg-white">
          <aside className="hidden w-52 border-r border-ground-100 bg-white lg:flex lg:flex-col">
            <div className="border-b border-ground-100 p-4">
              <LogoMark tone="light" />
            </div>
            <SidebarNav tone="light" />
          </aside>
          <div className="min-w-0 flex-1 p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="heading text-ground-900">Planning workspace</h3>
                <p className="caption mt-1 text-ground-400">
                  A centered shell keeps multi-column layouts contained on wide screens.
                </p>
              </div>
              <Button size="sm">Invite Team</Button>
            </div>
            <div className="space-y-4">
              {CONTENT_ROWS.map((row) => (
                <div key={row.title} className="rounded-xl border border-ground-100 bg-ground-50 p-4">
                  <p className="body font-medium text-ground-900">{row.title}</p>
                  <p className="caption mt-1 text-ground-400">{row.meta}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="h-16 rounded-xl bg-white" />
                    <div className="h-16 rounded-xl bg-white" />
                    <div className="h-16 rounded-xl bg-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="hidden w-64 border-l border-ground-100 bg-ground-50 p-5 xl:block">
            <p className="label text-ground-400">Context</p>
            <div className="mt-4 space-y-3">
              {["Timeline", "Approvals", "Team availability"].map((item) => (
                <div key={item} className="rounded-xl border border-ground-100 bg-white p-4">
                  <p className="body font-medium text-ground-900">{item}</p>
                  <div className="mt-3 space-y-2">
                    <div className="h-2 w-full rounded-full bg-ground-100" />
                    <div className="h-2 w-9/12 rounded-full bg-ground-100" />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </ShellFrame>
  );
}
