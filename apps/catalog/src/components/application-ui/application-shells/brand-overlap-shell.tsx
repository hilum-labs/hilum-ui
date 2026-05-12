
import { Badge } from "@hilum/ui";

const NAV_ITEMS = ["Dashboard", "Team", "Projects", "Calendar", "Reports"];
const USER = { name: "Tom Cook", email: "tom@example.com", initials: "TC" };
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
    <div className="flex min-h-[480px] overflow-hidden rounded-xl border border-taupe-100">
      {children}
    </div>
  );
}

function HorizontalNav({ tone }: { tone: "light" | "dark" | "brand" }) {
  const wrapperClass =
    tone === "light"
      ? "border-b border-taupe-200 bg-white"
      : tone === "dark"
        ? "bg-taupe-900"
        : "bg-brand-primary";
  const brandClass = tone === "light" ? "bg-brand-primary text-white" : "bg-white/15 text-white";
  const textClass = tone === "light" ? "text-taupe-500" : "text-white/70";
  const hoverTextClass = tone === "light" ? "hover:text-taupe-900" : "hover:text-white";
  const activeClass =
    tone === "light"
      ? "bg-brand-primary/10 text-brand-primary font-medium"
      : "bg-white/10 text-white font-medium";
  const avatarClass = tone === "light" ? "bg-taupe-900 text-white" : "bg-white text-taupe-900";

  return (
    <div className={`flex items-center justify-between px-6 py-4 ${wrapperClass}`}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className={`flex size-8 items-center justify-center rounded-xl ${brandClass}`}>
            <span className="body font-medium">D</span>
          </div>
          <span className={tone === "light" ? "body font-medium text-taupe-900" : "body font-medium text-white"}>
            Design Co.
          </span>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {NAV_ITEMS.map((item, index) => (
            <button
              key={item}
              type="button"
              className={`rounded-full px-3 py-1.5 body transition-colors ${index === 0 ? activeClass : `${textClass} ${hoverTextClass}`}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={tone === "light" ? "caption text-taupe-400 hover:text-taupe-700" : "caption text-white/70 hover:text-white"}
        >
          Help
        </button>
        <div className={`flex size-9 items-center justify-center rounded-full ${avatarClass}`}>
          <span className="body font-medium">{USER.initials}</span>
        </div>
      </div>
    </div>
  );
}

export default function BrandOverlapShell() {
  return (
    <ShellFrame>
      <div className="flex flex-1 flex-col bg-taupe-50">
        <HorizontalNav tone="brand" />
        <div className="flex-1 bg-taupe-50 px-6 pb-6">
          <div className="-mt-8 rounded-2xl border border-taupe-100 bg-white p-6 shadow-natural">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="heading text-taupe-900">Launch planning</h3>
                <p className="caption mt-1 text-taupe-400">
                  A branded header can overlap the content area without overwhelming the page.
                </p>
              </div>
              <Badge variant="secondary">3 open approvals</Badge>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {CONTENT_ROWS.map((row) => (
                <div key={row.title} className="rounded-xl border border-taupe-100 bg-taupe-50 p-4">
                  <p className="body font-medium text-taupe-900">{row.title}</p>
                  <p className="caption mt-1 text-taupe-400">{row.meta}</p>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 w-full rounded-full bg-white" />
                    <div className="h-2 w-9/12 rounded-full bg-white" />
                    <div className="h-2 w-7/12 rounded-full bg-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ShellFrame>
  );
}
