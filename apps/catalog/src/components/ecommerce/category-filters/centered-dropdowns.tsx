import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@hilum/ui";

type ColorOption = {
  name: string;
  swatch: string;
};

type CenteredMenuKey = "Category" | "Color" | "Size" | "Sort";

const COLOR_OPTIONS: ColorOption[] = [
  { name: "White", swatch: "#F5F5F4" },
  { name: "Beige", swatch: "#D6C7B2" },
  { name: "Blue", swatch: "#5B7DB1" },
  { name: "Brown", swatch: "#7A5A42" },
  { name: "Green", swatch: "#6D8B5B" },
  { name: "Purple", swatch: "#8B6FB3" },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL"];
const SORT_OPTIONS = ["Newest", "Best selling", "Price: Low to High", "Price: High to Low"];

const CENTERED_MENUS: Record<CenteredMenuKey, string[]> = {
  Category: ["Desk and Office", "Travel", "Accessories", "Clothing"],
  Color: COLOR_OPTIONS.map((option) => option.name),
  Size: SIZE_OPTIONS,
  Sort: SORT_OPTIONS,
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

export default function CenteredDropdowns() {
  const [centeredOpen, setCenteredOpen] = useState<CenteredMenuKey | null>(null);
  const [centeredSelections, setCenteredSelections] = useState<Record<CenteredMenuKey, string[]>>({
    Category: ["Travel"],
    Color: ["Blue"],
    Size: ["M"],
    Sort: ["Newest"],
  });

  return (
    <section className="min-h-[320px] w-full bg-white px-6 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="label text-brand-primary">Seasonal selection</p>
          <h3 className="display mt-3 text-ground-900">New Arrivals</h3>
          <p className="body mx-auto mt-4 max-w-2xl text-ground-600">
            A flexible browsing pattern for launches, editorial collections, or short-term
            merchandising campaigns.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {(Object.keys(CENTERED_MENUS) as CenteredMenuKey[]).map((menu) => (
            <div key={menu} className="relative">
              <button
                type="button"
                onClick={() => setCenteredOpen((current) => (current === menu ? null : menu))}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 body transition-colors ${
                  centeredOpen === menu
                    ? "border-brand-primary bg-brand-primary/5 text-ground-900"
                    : "border-ground-200 bg-white text-ground-600 hover:border-ground-300"
                }`}
              >
                {menu}
                <ChevronDown className="size-4" />
              </button>
              {centeredOpen === menu && (
                <MenuPanel
                  options={CENTERED_MENUS[menu]}
                  selected={centeredSelections[menu]}
                  onToggle={(value) =>
                    setCenteredSelections((current) => ({
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

        <div className="mt-14 flex flex-wrap justify-center gap-2">
          {Object.values(centeredSelections)
            .flat()
            .map((selection) => (
              <Badge key={selection} variant="outline">
                {selection}
              </Badge>
            ))}
        </div>
      </div>
    </section>
  );
}
