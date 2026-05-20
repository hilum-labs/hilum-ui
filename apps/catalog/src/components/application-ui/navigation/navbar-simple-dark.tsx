
import { type ReactNode, useState } from "react";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@hilum/ui";

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

export default function NavbarSimpleDark() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="rounded-xl border border-ground-100 overflow-hidden">
      <nav className="relative bg-ground-900 px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <LogoMark dark />
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <NavItemLink key={item} label={item} active={item === "Dashboard"} dark />
              ))}
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <IconButton dark>
              <Bell size={16} />
            </IconButton>
            <ProfileButton dark />
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ground-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="absolute inset-x-0 top-full z-10 border-t border-white/10 bg-ground-900 p-3 shadow-lg md:hidden">
            <div className="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`block rounded-lg px-3 py-2 text-sm ${
                    item === "Dashboard"
                      ? "bg-white/10 text-white font-medium"
                      : "text-ground-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <ProfileButton dark />
              <IconButton dark>
                <Bell size={16} />
              </IconButton>
            </div>
          </div>
        )}
      </nav>
      <NavbarContent dark />
    </div>
  );
}
