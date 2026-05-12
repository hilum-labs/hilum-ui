import { useState } from "react";
import {
  LayoutDashboard, Users, FolderOpen, BarChart2, Settings,
  Bell, ChevronDown, Menu, X, LogOut, User
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
  { label: "Dashboard", icon: LayoutDashboard, href: "#", badge: null, active: true },
  { label: "Team", icon: Users, href: "#", badge: null, active: false },
  { label: "Projects", icon: FolderOpen, href: "#", badge: "12", active: false },
  { label: "Reports", icon: BarChart2, href: "#", badge: null, active: false },
  { label: "Settings", icon: Settings, href: "#", badge: null, active: false },
];

export default function SidebarShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-[520px] overflow-hidden rounded-xl border border-taupe-100 bg-taupe-50 shadow-natural">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-50 flex w-56 flex-col bg-white border-r border-taupe-100 transition-transform duration-200 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-taupe-100 px-4">
          <div className="flex size-6 items-center justify-center rounded-md bg-taupe-900">
            <span className="caption-xs font-bold text-white">DS</span>
          </div>
          <span className="label font-semibold text-taupe-900">Acme Inc.</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 caption transition-colors",
                    item.active
                      ? "bg-brand-primary/10 text-brand-primary font-medium"
                      : "text-taupe-600 hover:bg-taupe-50 hover:text-taupe-900"
                  )}
                >
                  <item.icon size={14} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={item.active ? "outline" : "secondary"}
                      className="caption-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div className="border-t border-taupe-100 p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 caption text-taupe-700 hover:bg-taupe-50 transition-colors">
                <Avatar size="xs">
                  <AvatarFallback className="bg-brand-primary text-white">TC</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="caption font-semibold text-taupe-900 truncate">Tom Cook</p>
                  <p className="caption-xs text-taupe-400 truncate">tom@example.com</p>
                </div>
                <ChevronDown size={12} className="text-taupe-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-48">
              <DropdownMenuItem><User size={13} className="mr-2" /> Profile</DropdownMenuItem>
              <DropdownMenuItem><Settings size={13} className="mr-2" /> Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600"><LogOut size={13} className="mr-2" /> Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-taupe-100 bg-white px-4">
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-taupe-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </Button>
          <div className="flex-1" />
          <button className="relative text-taupe-400 hover:text-taupe-700">
            <Bell size={15} />
            <span className="absolute -top-px -right-px flex size-1.5 rounded-full bg-brand-primary" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="heading font-semibold text-taupe-900 mb-1">Dashboard</h1>
          <p className="caption text-taupe-400 mb-6">Welcome back, Tom.</p>
          <div className="grid grid-cols-3 gap-3">
            {["32,450", "1,230", "97.2%"].map((v, i) => (
              <div key={i} className="rounded-xl border border-taupe-100 bg-white p-4 shadow-natural">
                <p className="caption text-taupe-400 mb-1">{["Revenue", "Users", "Uptime"][i]}</p>
                <p className="heading font-semibold text-taupe-900">{v}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
