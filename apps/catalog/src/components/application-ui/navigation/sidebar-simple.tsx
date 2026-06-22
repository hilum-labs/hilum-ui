import { useState } from "react";
import { BarChart2, Calendar, FolderKanban, LayoutDashboard, Users } from "lucide-react";
import { Badge } from "@hilum/ui";
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

export default function SidebarSimple() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className="p-8">
      <div className="rounded-xl border border-ground-100 overflow-hidden w-56 bg-white p-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveItem(item.label)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                activeItem === item.label
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "text-ground-600 hover:bg-ground-50 hover:text-ground-900"
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
              {item.badge ? (
                <Badge variant="brand" className="ml-auto min-w-5 justify-center px-1.5 py-0">
                  {item.badge}
                </Badge>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
