import { useState } from "react";
import {
  LayoutDashboard, Users, FolderOpen, BarChart2,
  Bell, Menu, X, ChevronDown, Settings, LogOut, User
} from "lucide-react";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Avatar, AvatarFallback } from "@hilum/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@hilum/ui";
import { cn } from "@hilum/ui";

const NAV_ITEMS = [
  { label: "Dashboard", href: "#", active: true },
  { label: "Team", href: "#", active: false },
  { label: "Projects", href: "#", active: false },
  { label: "Reports", href: "#", active: false },
];

export default function StackedShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-taupe-100 bg-taupe-50 shadow-natural">
      {/* Top nav */}
      <header className="bg-white border-b border-taupe-100">
        <div className="px-5">
          <div className="flex h-13 items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex size-6 items-center justify-center rounded-md bg-taupe-900">
                <span className="caption-xs font-bold text-white">DS</span>
              </div>
              <span className="label font-semibold text-taupe-900">Acme Inc.</span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden sm:flex flex-1 items-center gap-0.5">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 caption transition-colors",
                    item.active
                      ? "bg-brand-primary/10 text-brand-primary font-medium"
                      : "text-taupe-500 hover:bg-taupe-50 hover:text-taupe-900"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <button className="relative p-1.5 text-taupe-400 hover:text-taupe-700 transition-colors">
                <Bell size={15} />
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-brand-primary" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 hover:bg-taupe-50 transition-colors">
                    <Avatar size="xs">
                      <AvatarFallback className="bg-brand-primary text-white">TC</AvatarFallback>
                    </Avatar>
                    <ChevronDown size={12} className="text-taupe-400 hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem><User size={13} className="mr-2" />Profile</DropdownMenuItem>
                  <DropdownMenuItem><Settings size={13} className="mr-2" />Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600"><LogOut size={13} className="mr-2" />Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0 text-taupe-500 sm:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={15} /> : <Menu size={15} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="border-t border-taupe-100 px-3 py-2 sm:hidden">
            <nav className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 caption",
                    item.active
                      ? "bg-brand-primary/10 text-brand-primary font-semibold"
                      : "text-taupe-500"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Page */}
      <main className="p-6">
        <h1 className="heading font-semibold text-taupe-900 mb-1">Dashboard</h1>
        <p className="caption text-taupe-400 mb-6">Here's what's happening today.</p>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Revenue", value: "$32,450", delta: "+4.6%" },
            { label: "Users", value: "1,230", delta: "+2.1%" },
            { label: "Orders", value: "847", delta: "-0.5%" },
            { label: "Uptime", value: "99.9%", delta: "+0.1%" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-taupe-100 bg-white p-4 shadow-natural">
              <p className="caption text-taupe-400 mb-1">{s.label}</p>
              <p className="heading font-semibold text-taupe-900">{s.value}</p>
              <p className="caption-xs text-taupe-400 mt-0.5">{s.delta} vs last mo.</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-taupe-100 bg-white shadow-natural overflow-hidden">
          <div className="border-b border-taupe-100 px-5 py-3 flex items-center justify-between">
            <p className="label text-taupe-900">Recent activity</p>
            <Badge variant="secondary" className="caption-xs">View all</Badge>
          </div>
          <div className="divide-y divide-taupe-50">
            {["Invoice #1234 paid", "New user signup: alex@example.com", "Deployment to production succeeded"].map((item) => (
              <div key={item} className="px-5 py-3 caption text-taupe-600">{item}</div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
