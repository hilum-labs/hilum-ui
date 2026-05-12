
import { ChevronDown, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Input } from "@hilum/ui";

const navItems = ["Dashboard", "Team", "Projects", "Calendar"] as const;

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-primary text-sm font-bold text-white">
        D
      </div>
      <span className="body font-semibold text-taupe-900">Designly</span>
    </div>
  );
}

function ProfileButton() {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 rounded-full transition-colors text-taupe-600 hover:text-taupe-900"
    >
      <Avatar size="sm">
        <AvatarFallback className="bg-taupe-100 text-taupe-700">
          WK
        </AvatarFallback>
      </Avatar>
      <ChevronDown size={14} />
    </button>
  );
}

function NavItemLink({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  const className = active
    ? "bg-brand-primary/10 text-brand-primary font-medium"
    : "text-taupe-500 hover:text-taupe-900";

  return (
    <a href="#" className={`rounded-lg px-3 py-2 text-sm transition-colors ${className}`}>
      {label}
    </a>
  );
}

function NavbarContent() {
  return (
    <div className="flex h-24 items-center justify-center bg-taupe-50">
      <span className="body text-taupe-400">Page content</span>
    </div>
  );
}

export default function NavbarWithSearch() {
  return (
    <div className="rounded-xl border border-taupe-100 overflow-hidden">
      <nav className="bg-white px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <LogoMark />
          <div className="relative max-w-md lg:mx-6 lg:w-full">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-taupe-400" />
            <Input
              type="text"
              placeholder="Search"
              className="border-0 bg-taupe-50 pl-9 shadow-none focus-visible:border-brand-primary"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavItemLink key={item} label={item} active={item === "Dashboard"} />
              ))}
            </div>
            <ProfileButton />
          </div>
        </div>
      </nav>
      <NavbarContent />
    </div>
  );
}
