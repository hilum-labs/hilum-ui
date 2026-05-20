
import { useState } from "react";
import { BarChart2, CreditCard, LayoutGrid, Settings, Users } from "lucide-react";

const verticalItems = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Analytics", icon: BarChart2 },
  { label: "Settings", icon: Settings },
  { label: "Billing", icon: CreditCard },
  { label: "Team", icon: Users },
] as const;

export default function VerticalNavigationSecondary() {
  const [activeItem, setActiveItem] = useState("Overview");
  const [activeSubItem, setActiveSubItem] = useState("Performance");

  return (
    <div className="p-8">
      <div className="w-48 rounded-xl bg-ground-50 p-2">
        <div className="space-y-1">
          {verticalItems.map((item) => (
            <div key={item.label}>
              <button
                type="button"
                onClick={() => setActiveItem(item.label)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeItem === item.label
                    ? "bg-white text-ground-900 font-medium shadow-sm"
                    : "text-ground-600 hover:bg-white/60"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
              {item.label === "Overview" && activeItem === "Overview" ? (
                <div className="ml-4 mt-2 space-y-1 border-l border-ground-100 pl-4">
                  {["Performance", "Audience", "Conversions"].map((subItem) => (
                    <button
                      key={subItem}
                      type="button"
                      onClick={() => setActiveSubItem(subItem)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                        activeSubItem === subItem
                          ? "bg-brand-primary/10 text-brand-primary font-medium"
                          : "text-ground-500 hover:bg-white hover:text-ground-900"
                      }`}
                    >
                      {subItem}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
