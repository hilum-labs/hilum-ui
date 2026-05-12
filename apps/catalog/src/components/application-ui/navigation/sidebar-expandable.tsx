
import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function SidebarExpandable() {
  const [analyticsOpen, setAnalyticsOpen] = useState(true);
  const [customersOpen, setCustomersOpen] = useState(true);
  const [activeSubItem, setActiveSubItem] = useState("Reports");

  return (
    <div className="p-8">
      <div className="rounded-xl border border-taupe-100 overflow-hidden w-56 bg-white p-2">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setAnalyticsOpen((value) => !value)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-taupe-700 transition-colors hover:bg-taupe-50"
          >
            <ChevronRight size={16} className={`transition-transform ${analyticsOpen ? "rotate-90" : ""}`} />
            Analytics
          </button>
          {analyticsOpen && (
            <div className="space-y-1 pl-8">
              {["Overview", "Real-time", "Reports"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveSubItem(item)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                    activeSubItem === item
                      ? "bg-brand-primary/10 text-brand-primary font-medium"
                      : "text-taupe-500 hover:bg-taupe-50 hover:text-taupe-900"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setCustomersOpen((value) => !value)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-taupe-700 transition-colors hover:bg-taupe-50"
          >
            <ChevronRight size={16} className={`transition-transform ${customersOpen ? "rotate-90" : ""}`} />
            Customers
          </button>
          {customersOpen && (
            <div className="space-y-1 pl-8">
              {["Users", "Segments"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveSubItem(item)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                    activeSubItem === item
                      ? "bg-brand-primary/10 text-brand-primary font-medium"
                      : "text-taupe-500 hover:bg-taupe-50 hover:text-taupe-900"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
