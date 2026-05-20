
import { useState, type Dispatch, type SetStateAction } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";

type ColorOption = {
  name: string;
  swatch: string;
};

const COLOR_OPTIONS: ColorOption[] = [
  { name: "White", swatch: "#F5F5F4" },
  { name: "Beige", swatch: "#D6C7B2" },
  { name: "Blue", swatch: "#5B7DB1" },
  { name: "Brown", swatch: "#7A5A42" },
  { name: "Green", swatch: "#6D8B5B" },
  { name: "Purple", swatch: "#8B6FB3" },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL"];
const PRICE_OPTIONS = ["Under $50", "$50 - $100", "$100 - $200", "$200+"];

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

function toggleArrayValue(
  value: string,
  setter: Dispatch<SetStateAction<string[]>>
) {
  setter((current) =>
    current.includes(value)
      ? current.filter((entry) => entry !== value)
      : [...current, value]
  );
}

export default function ExpandableFilterPanel() {
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelColors, setPanelColors] = useState<string[]>(["White", "Brown"]);
  const [panelSizes, setPanelSizes] = useState<string[]>(["S", "M"]);
  const [panelPrice, setPanelPrice] = useState<string>("$50 - $100");

  return (
    <section className="min-h-[320px] w-full bg-white px-6 py-8 sm:px-8">
      <div className="rounded-[28px] border border-ground-100 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant={panelOpen ? "default" : "outline"}
            size="sm"
            onClick={() => setPanelOpen((current) => !current)}
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>
          <p className="caption text-ground-400">
            {panelColors.length + panelSizes.length + 1} conditions applied
          </p>
        </div>

        <div
          className={`grid overflow-hidden transition-all duration-300 ${
            panelOpen
              ? "mt-5 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <div className="grid gap-6 rounded-[24px] border border-ground-100 bg-ground-50 p-5 md:grid-cols-3">
              <div>
                <p className="subheading text-ground-900">Color</p>
                <div className="mt-3 space-y-2">
                  {COLOR_OPTIONS.map((option) => (
                    <CheckboxRow
                      key={option.name}
                      label={option.name}
                      checked={panelColors.includes(option.name)}
                      onChange={() => toggleArrayValue(option.name, setPanelColors)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="subheading text-ground-900">Size</p>
                <div className="mt-3 space-y-2">
                  {SIZE_OPTIONS.map((option) => (
                    <CheckboxRow
                      key={option}
                      label={option}
                      checked={panelSizes.includes(option)}
                      onChange={() => toggleArrayValue(option, setPanelSizes)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="subheading text-ground-900">Price</p>
                <div className="mt-3 space-y-2">
                  {PRICE_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="flex items-center justify-between rounded-2xl border border-ground-100 bg-white px-3 py-2"
                    >
                      <span className="body text-ground-600">{option}</span>
                      <input
                        type="radio"
                        name="price"
                        checked={panelPrice === option}
                        onChange={() => setPanelPrice(option)}
                        className="h-4 w-4 border-ground-300 text-brand-primary focus:ring-brand-primary"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[...panelColors, ...panelSizes, panelPrice].map((selection) => (
            <Badge key={selection} variant="outline">
              {selection}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
