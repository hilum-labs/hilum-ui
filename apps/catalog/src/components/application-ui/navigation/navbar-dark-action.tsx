
import { type ReactNode } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Button } from "@hilum/ui";

const navItems = ["Dashboard", "Team", "Projects", "Calendar"] as const;

function LogoMark({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-primary text-sm font-bold text-white">
        D
      </div>
      <span className={`body font-semibold ${dark ? "text-white" : "text-ground-900"}`}>Designly</span>
    </div>
  );
}

function ProfileButton({ dark = false }: { dark?: boolean }) {
  return (
    <button
      type="button"
      className={`flex items-center gap-1.5 rounded-full transition-colors ${
        dark ? "text-ground-300 hover:text-white" : "text-ground-600 hover:text-ground-900"
      }`}
    >
      <Avatar size="sm">
        <AvatarFallback className={dark ? "bg-white/10 text-white" : "bg-ground-100 text-ground-700"}>
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
  dark = false,
}: {
  label: string;
  active: boolean;
  dark?: boolean;
}) {
  const className = dark
    ? active
      ? "bg-white/10 text-white font-medium"
      : "text-ground-300 hover:text-white"
    : active
      ? "bg-brand-primary/10 text-brand-primary font-medium"
      : "text-ground-500 hover:text-ground-900";

  return (
    <a href="#" className={`rounded-lg px-3 py-2 text-sm transition-colors ${className}`}>
      {label}
    </a>
  );
}

function NavbarContent({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`flex h-24 items-center justify-center ${dark ? "bg-ground-950" : "bg-ground-50"}`}>
      <span className={`body ${dark ? "text-ground-500" : "text-ground-400"}`}>Page content</span>
    </div>
  );
}

function IconButton({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <button
      type="button"
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
        dark
          ? "text-ground-300 hover:bg-white/10 hover:text-white"
          : "text-ground-500 hover:bg-ground-100 hover:text-ground-900"
      }`}
    >
      {children}
    </button>
  );
}

export default function NavbarDarkAction() {
  return (
    <div className="rounded-xl border border-ground-100 overflow-hidden">
      <nav className="bg-ground-900 px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-8">
            <LogoMark dark />
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <NavItemLink key={item} label={item} active={item === "Dashboard"} dark />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <IconButton dark>
              <Bell size={16} />
            </IconButton>
            <Button size="sm" variant="brand">
              New project
            </Button>
            <ProfileButton dark />
          </div>
        </div>
      </nav>
      <NavbarContent dark />
    </div>
  );
}
