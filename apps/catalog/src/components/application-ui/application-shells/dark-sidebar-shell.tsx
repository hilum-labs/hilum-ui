
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

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

function UserCard({ tone }: { tone: "light" | "dark" | "brand" }) {
  const avatarClass =
    tone === "light"
      ? "bg-brand-primary text-white"
      : tone === "dark"
        ? "bg-white text-ground-900"
        : "bg-white/15 text-white";
  const cardClass =
    tone === "light"
      ? "border-ground-100"
      : tone === "dark"
        ? "border-ground-800"
        : "border-white/15";
  const nameClass = tone === "light" ? "text-ground-900" : "text-white";
  const emailClass = tone === "light" ? "text-ground-400" : "text-white/60";

  return (
    <div className={`border-t p-4 ${cardClass}`}>
      <div className="flex items-center gap-3">
        <div className={`flex size-10 items-center justify-center rounded-full ${avatarClass}`}>
          <span className="body font-medium">{USER.initials}</span>
        </div>
        <div className="min-w-0">
          <p className={`body truncate font-medium ${nameClass}`}>{USER.name}</p>
          <p className={`caption truncate ${emailClass}`}>{USER.email}</p>
        </div>
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

export default function DarkSidebarShell() {
  return (
    <ShellFrame>
      <aside className="flex w-56 flex-col bg-ground-900">
        <div className="border-b border-ground-800 p-4">
          <LogoMark tone="dark" />
        </div>
        <SidebarNav tone="dark" />
        <UserCard tone="dark" />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col bg-white">
        <div className="flex items-center justify-between border-b border-ground-100 px-5 py-4">
          <div>
            <p className="heading text-ground-900">Team dashboard</p>
            <p className="caption text-ground-400">A high-contrast shell for analytics and operations work.</p>
          </div>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
        <ContentRows
          title="Team operations"
          subtitle="A dark navigation rail keeps secondary navigation distinct from the primary work surface."
          surfaceClassName="bg-white"
          cardClassName="border border-ground-100 bg-ground-50"
        />
      </div>
    </ShellFrame>
  );
}
