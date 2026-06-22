import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@hilum/ui";

type ColorOption = {
  name: string;
  swatch: string;
};

type TopBarMenuKey = "Category" | "Color" | "Size";

const COLOR_OPTIONS: ColorOption[] = [
  { name: "White", swatch: "#F5F5F4" },
  { name: "Beige", swatch: "#D6C7B2" },
  { name: "Blue", swatch: "#5B7DB1" },
  { name: "Brown", swatch: "#7A5A42" },
  { name: "Green", swatch: "#6D8B5B" },
  { name: "Purple", swatch: "#8B6FB3" },
];

const SORT_OPTIONS = ["Newest", "Best selling", "Price: Low to High", "Price: High to Low"];

const TOP_BAR_MENUS: Record<TopBarMenuKey, string[]> = {
  Category: ["Travel", "Work bags", "Tech kits", "Layers"],
  Color: COLOR_OPTIONS.map((option) => option.name),
  Size: ["One size", "XS", "S", "M", "L"],
};

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

function MenuPanel({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="absolute left-0 top-full z-10 mt-3 w-60 rounded-3xl border border-ground-100 bg-white p-4 shadow-lg">
      <div className="space-y-2">
        {options.map((option) => (
          <CheckboxRow
            key={option}
            label={option}
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
          />
        ))}
      </div>
    </div>
  );
}

export default function DropdownProductFilters() {
  const [topBarOpen, setTopBarOpen] = useState<TopBarMenuKey | null>(null);
  const [topBarSelections, setTopBarSelections] = useState<Record<TopBarMenuKey, string[]>>({
    Category: ["Travel"],
    Color: ["Green"],
    Size: ["One size"],
  });
  const [topBarSort, setTopBarSort] = useState<string>("Newest");

  return (
    <section className="min-h-[320px] w-full bg-white px-6 py-8 sm:px-8">
      <div className="rounded-[28px] border border-ground-100 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {(Object.keys(TOP_BAR_MENUS) as TopBarMenuKey[]).map((menu) => (
              <div key={menu} className="relative">
                <button
                  type="button"
                  onClick={() => setTopBarOpen((current) => (current === menu ? null : menu))}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 body transition-colors ${
                    topBarOpen === menu
                      ? "border-brand-primary bg-brand-primary/5 text-ground-900"
                      : "border-ground-200 bg-white text-ground-600 hover:border-ground-300"
                  }`}
                >
                  {menu}
                  <ChevronDown className="size-4" />
                </button>
                {topBarOpen === menu && (
                  <MenuPanel
                    options={TOP_BAR_MENUS[menu]}
                    selected={topBarSelections[menu]}
                    onToggle={(value) =>
                      setTopBarSelections((current) => ({
                        ...current,
                        [menu]: current[menu].includes(value)
                          ? current[menu].filter((entry) => entry !== value)
                          : [...current[menu], value],
                      }))
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <label className="flex items-center gap-3 rounded-full border border-ground-200 px-4 py-2">
            <span className="body text-ground-600">Sort</span>
            <select
              value={topBarSort}
              onChange={(event) => setTopBarSort(event.target.value)}
              className="body bg-transparent text-ground-900 outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {Object.values(topBarSelections)
            .flat()
            .map((selection) => (
              <Badge key={selection} variant="outline">
                {selection}
              </Badge>
            ))}
          <Badge variant="secondary">{topBarSort}</Badge>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Flight Pack", "Weekender Pouch", "Canvas Layer"].map((name, index) => (
            <div key={name} className="rounded-[24px] border border-ground-100 bg-ground-50 p-4">
              <div
                className={`h-32 rounded-2xl ${
                  index === 1 ? "bg-brand-secondary/40" : "bg-brand-secondary/40"
                }`}
              />
              <p className="subheading mt-4 text-ground-900">{name}</p>
              <p className="body mt-2 text-ground-600">
                Filtered by {topBarSelections.Category[0] ?? "all categories"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
