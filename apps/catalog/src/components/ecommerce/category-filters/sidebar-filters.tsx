import { useState, type Dispatch, type SetStateAction } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@hilum/ui";

type ColorOption = {
  name: string;
  swatch: string;
};

type SidebarGroupKey = "color" | "category" | "size";

const COLOR_OPTIONS: ColorOption[] = [
  { name: "White", swatch: "#F5F5F4" },
  { name: "Beige", swatch: "#D6C7B2" },
  { name: "Blue", swatch: "#5B7DB1" },
  { name: "Brown", swatch: "#7A5A42" },
  { name: "Green", swatch: "#6D8B5B" },
  { name: "Purple", swatch: "#8B6FB3" },
];

const CATEGORY_OPTIONS = ["Bags", "Desk accessories", "Organizers", "Travel sets"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL"];

const FILTER_PRODUCTS = [
  { name: "Transit Tote", price: "$98" },
  { name: "Studio Sling", price: "$64" },
  { name: "Fold Desk Mat", price: "$42" },
  { name: "Cable Wrap Set", price: "$28" },
];

function ColorSwatchButton({
  color,
  selected,
  onToggle,
}: {
  color: ColorOption;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition-colors ${
        selected
          ? "border-brand-primary bg-brand-primary/5 text-ground-900"
          : "border-ground-100 bg-white text-ground-600 hover:border-ground-200"
      }`}
    >
      <span className="body flex items-center gap-3">
        <span
          className="h-4 w-4 rounded-full border border-ground-200"
          style={{ backgroundColor: color.swatch }}
        />
        {color.name}
      </span>
      <span className="caption text-ground-400">{selected ? "On" : "Off"}</span>
    </button>
  );
}

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

export default function SidebarFilters() {
  const [sidebarGroups, setSidebarGroups] = useState<Record<SidebarGroupKey, boolean>>({
    color: true,
    category: true,
    size: true,
  });
  const [sidebarColors, setSidebarColors] = useState<string[]>(["Beige", "Green"]);
  const [sidebarCategories, setSidebarCategories] = useState<string[]>(["Bags", "Organizers"]);
  const [sidebarSizes, setSidebarSizes] = useState<string[]>(["M", "L"]);

  const sidebarSelections = [...sidebarColors, ...sidebarCategories, ...sidebarSizes];

  return (
    <section className="min-h-[320px] w-full bg-white lg:flex">
      <aside className="w-full border-b border-ground-100 p-6 lg:w-64 lg:border-b-0 lg:border-r">
        <div className="space-y-6">
          {(
            [
              ["color", "Color"],
              ["category", "Category"],
              ["size", "Sizes"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <button
                type="button"
                onClick={() =>
                  setSidebarGroups((current) => ({
                    ...current,
                    [key]: !current[key],
                  }))
                }
                className="flex w-full items-center justify-between text-left"
              >
                <span className="subheading text-ground-900">{label}</span>
                <ChevronDown
                  className={`size-4 text-ground-400 transition-transform ${
                    sidebarGroups[key] ? "rotate-180" : ""
                  }`}
                />
              </button>
              {sidebarGroups[key] && (
                <div className="mt-3 space-y-2">
                  {key === "color" &&
                    COLOR_OPTIONS.map((color) => (
                      <ColorSwatchButton
                        key={color.name}
                        color={color}
                        selected={sidebarColors.includes(color.name)}
                        onToggle={() => toggleArrayValue(color.name, setSidebarColors)}
                      />
                    ))}
                  {key === "category" &&
                    CATEGORY_OPTIONS.map((option) => (
                      <CheckboxRow
                        key={option}
                        label={option}
                        checked={sidebarCategories.includes(option)}
                        onChange={() => toggleArrayValue(option, setSidebarCategories)}
                      />
                    ))}
                  {key === "size" &&
                    SIZE_OPTIONS.map((option) => (
                      <CheckboxRow
                        key={option}
                        label={option}
                        checked={sidebarSizes.includes(option)}
                        onChange={() => toggleArrayValue(option, setSidebarSizes)}
                      />
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ground-100 pb-4">
          <div>
            <p className="subheading text-ground-900">Showing 48 results</p>
            <p className="caption mt-1 text-ground-400">
              {sidebarSelections.length} active filters
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {sidebarSelections.map((selection) => (
              <Badge key={selection} variant="outline">
                {selection}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FILTER_PRODUCTS.map((product) => (
            <div
              key={product.name}
              className="rounded-[28px] border border-ground-100 bg-ground-50 p-4"
            >
              <div className="h-28 rounded-2xl bg-brand-secondary/40" />
              <p className="subheading mt-4 text-ground-900">{product.name}</p>
              <p className="body mt-2 text-ground-600">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
