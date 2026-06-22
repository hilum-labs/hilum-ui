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
    <div className="flex min-h-[480px] overflow-hidden rounded-xl border border-ground-100">
      {children}
    </div>
  );
}

function HorizontalNav({ tone }: { tone: "light" | "dark" | "brand" }) {
  const wrapperClass =
    tone === "light"
      ? "border-b border-ground-200 bg-white"
      : tone === "dark"
        ? "bg-ground-900"
        : "bg-brand-primary";
  const brandClass = tone === "light" ? "bg-brand-primary text-white" : "bg-white/15 text-white";
  const textClass = tone === "light" ? "text-ground-500" : "text-white/70";
  const hoverTextClass = tone === "light" ? "hover:text-ground-900" : "hover:text-white";
  const activeClass =
    tone === "light"
      ? "bg-brand-primary/10 text-brand-primary font-medium"
      : "bg-white/10 text-white font-medium";
  const avatarClass = tone === "light" ? "bg-ground-900 text-white" : "bg-white text-ground-900";

  return (
    <div className={`flex items-center justify-between px-6 py-4 ${wrapperClass}`}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className={`flex size-8 items-center justify-center rounded-xl ${brandClass}`}>
            <span className="body font-medium">D</span>
          </div>
          <span
            className={
              tone === "light" ? "body font-medium text-ground-900" : "body font-medium text-white"
            }
          >
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
          className={
            tone === "light"
              ? "caption text-ground-400 hover:text-ground-700"
              : "caption text-white/70 hover:text-white"
          }
        >
          Help
        </button>
        <div className={`flex size-10 items-center justify-center rounded-full ${avatarClass}`}>
          <span className="body font-medium">{USER.initials}</span>
        </div>
      </div>
    </div>
  );
}

function ContentRows({
  title,
  subtitle,
  surfaceClassName,
  cardClassName,
}: {
  title: string;
  subtitle: string;
  surfaceClassName: string;
  cardClassName: string;
}) {
  return (
    <div className={`flex-1 p-6 ${surfaceClassName}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="heading text-ground-900">{title}</h3>
          <p className="caption mt-1 text-ground-400">{subtitle}</p>
        </div>
        <Badge variant="secondary">Updated 8m ago</Badge>
      </div>
      <div className="space-y-4">
        {CONTENT_ROWS.map((row) => (
          <div key={row.title} className={`rounded-xl p-4 ${cardClassName}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="body font-medium text-ground-900">{row.title}</p>
                <p className="caption mt-1 text-ground-400">{row.meta}</p>
              </div>
              <div className="h-2 w-20 rounded-full bg-ground-100" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-2 w-full rounded-full bg-ground-100" />
              <div className="h-2 w-10/12 rounded-full bg-ground-100" />
              <div className="h-2 w-7/12 rounded-full bg-ground-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DarkStackedShell() {
  return (
    <ShellFrame>
      <div className="flex flex-1 flex-col bg-white">
        <HorizontalNav tone="dark" />
        <ContentRows
          title="Executive summary"
          subtitle="A dark utility bar anchors global navigation while preserving a calm work surface."
          surfaceClassName="bg-white"
          cardClassName="border border-ground-100 bg-ground-50"
        />
      </div>
    </ShellFrame>
  );
}
