
import { useState } from "react";
import { BarChart2, CreditCard, LayoutGrid, Settings, Users } from "lucide-react";

const verticalItems = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Analytics", icon: BarChart2 },
  { label: "Settings", icon: Settings },
  { label: "Billing", icon: CreditCard },
  { label: "Team", icon: Users },
] as const;

export default function VerticalNavigationSimple() {
  const [activeItem, setActiveItem] = useState("Overview");

  return (
    <div className="p-8">
      <div className="w-48 rounded-xl bg-ground-50 p-2">
        <div className="space-y-1">
          {verticalItems.map((item) => (
            <button
              key={item.label}
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
          ))}
        </div>
      </div>
    </div>
  );
}
