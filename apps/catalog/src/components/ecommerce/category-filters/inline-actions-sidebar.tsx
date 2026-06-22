import { useState, type Dispatch, type SetStateAction } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@hilum/ui";

type ColorOption = {
  name: string;
  swatch: string;
};

type SidebarExpandableKey = "Color" | "Size";

const COLOR_OPTIONS: ColorOption[] = [
  { name: "White", swatch: "#F5F5F4" },
  { name: "Beige", swatch: "#D6C7B2" },
  { name: "Blue", swatch: "#5B7DB1" },
  { name: "Brown", swatch: "#7A5A42" },
  { name: "Green", swatch: "#6D8B5B" },
  { name: "Purple", swatch: "#8B6FB3" },
];

const SORT_OPTIONS = ["Newest", "Best selling", "Price: Low to High", "Price: High to Low"];

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-ground-100 bg-white px-3 py-2 text-ground-600">
      <span className="body">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-ground-300 text-brand-primary focus:ring-brand-primary"
      />
    </label>
  );
}

function toggleArrayValue(value: string, setter: Dispatch<SetStateAction<string[]>>) {
  setter((current) =>
    current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value],
  );
}

export default function InlineActionsSidebar() {
  const [sidebarSort, setSidebarSort] = useState<string>("Newest");
  const [subcategory, setSubcategory] = useState<string>("Travel sets");
  const [expandableGroups, setExpandableGroups] = useState<Record<SidebarExpandableKey, boolean>>({
    Color: true,
    Size: true,
  });
  const [expandableColors, setExpandableColors] = useState<string[]>(["Blue"]);
  const [expandableSizes, setExpandableSizes] = useState<string[]>(["One size"]);

  return (
    <section className="min-h-[320px] w-full bg-white lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-ground-100 p-6 lg:border-b-0 lg:border-r">
        <div>
          <p className="subheading text-ground-900">Sort</p>
          <div className="mt-3 space-y-2">
            {SORT_OPTIONS.slice(0, 3).map((option) => (
              <label
                key={option}
                className="flex items-center justify-between rounded-2xl border border-ground-100 bg-white px-3 py-2"
              >
                <span className="body text-ground-600">{option}</span>
                <input
                  type="radio"
                  name="sidebar-sort"
                  checked={sidebarSort === option}
                  onChange={() => setSidebarSort(option)}
                  className="h-4 w-4 border-ground-300 text-brand-primary focus:ring-brand-primary"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="subheading text-ground-900">Subcategories</p>
          <div className="mt-3 space-y-2">
            {["Travel sets", "Packing cubes", "Tech pouches", "Garment bags"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSubcategory(item)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 body transition-colors ${
                  subcategory === item
                    ? "bg-brand-primary/10 text-ground-900"
                    : "bg-ground-50 text-ground-600 hover:bg-ground-100"
                }`}
              >
                {item}
                <span className="caption text-ground-400">12</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {(Object.keys(expandableGroups) as SidebarExpandableKey[]).map((group) => (
            <div key={group}>
              <button
                type="button"
                onClick={() =>
                  setExpandableGroups((current) => ({
                    ...current,
                    [group]: !current[group],
                  }))
                }
                className="flex w-full items-center justify-between"
              >
                <span className="subheading text-ground-900">{group}</span>
                <ChevronDown
                  className={`size-4 text-ground-400 transition-transform ${
                    expandableGroups[group] ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandableGroups[group] && (
                <div className="mt-3 space-y-2">
                  {group === "Color" &&
                    COLOR_OPTIONS.map((option) => (
                      <CheckboxRow
                        key={option.name}
                        label={option.name}
                        checked={expandableColors.includes(option.name)}
                        onChange={() => toggleArrayValue(option.name, setExpandableColors)}
                      />
                    ))}
                  {group === "Size" &&
                    ["One size", "XS", "S", "M", "L"].map((option) => (
                      <CheckboxRow
                        key={option}
                        label={option}
                        checked={expandableSizes.includes(option)}
                        onChange={() => toggleArrayValue(option, setExpandableSizes)}
                      />
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ground-100 pb-4">
          <div>
            <p className="subheading text-ground-900">{subcategory}</p>
            <p className="caption mt-1 text-ground-400">Sorted by {sidebarSort.toLowerCase()}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...expandableColors, ...expandableSizes].map((selection) => (
              <Badge key={selection} variant="outline">
                {selection}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {["Compression Case", "Cord Roll", "Passport Sleeve"].map((item, index) => (
            <div key={item} className="rounded-[24px] border border-ground-100 bg-ground-50 p-4">
              <div
                className={`h-32 rounded-2xl ${
                  index === 2 ? "bg-brand-secondary/40" : "bg-brand-secondary/40"
                }`}
              />
              <p className="subheading mt-4 text-ground-900">{item}</p>
              <p className="body mt-2 text-ground-600">Tuned for {subcategory.toLowerCase()}.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
