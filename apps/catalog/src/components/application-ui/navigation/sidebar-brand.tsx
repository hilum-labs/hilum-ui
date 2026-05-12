
import { useState } from "react";
import { BarChart2, Calendar, FolderKanban, LayoutDashboard, Users } from "lucide-react";
import { type LucideIcon } from "lucide-react";

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  badge?: string;
};

const sidebarItems: readonly SidebarItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Team", icon: Users, badge: "3" },
  { label: "Projects", icon: FolderKanban },
  { label: "Calendar", icon: Calendar },
  { label: "Reports", icon: BarChart2 },
];

export default function SidebarBrand() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className="p-8">
      <div className="rounded-xl border border-brand-primary/30 overflow-hidden w-56 bg-brand-primary p-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveItem(item.label)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                activeItem === item.label
                  ? "bg-white/15 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon size={16} className="text-white" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
