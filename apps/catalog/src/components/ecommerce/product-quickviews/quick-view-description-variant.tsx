
import { type ReactNode, useState } from "react";
import { Check, X } from "lucide-react";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const PRODUCT_NAME = "Basic Tee 6-Pack";
const PRODUCT_PRICE = "$192";
const PRODUCT_DESCRIPTION =
  "The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous?";
const PRODUCT_IMAGE =
  "https://tailwindui.com/img/ecommerce-images/product-page-02-secondary-product-shot.jpg";

const COLORS = [
  { name: "White", swatchClass: "bg-white border border-taupe-300" },
  { name: "Gray", swatchClass: "bg-taupe-400" },
  { name: "Black", swatchClass: "bg-taupe-900" },
] as const;

type ColorName = (typeof COLORS)[number]["name"];

function QuickViewFrame({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-taupe-100 overflow-hidden">
      <div className="grid overflow-hidden rounded-xl bg-white lg:grid-cols-2">{children}</div>
    </div>
  );
}

function QuickViewImage() {
  return (
    <div className="flex items-center justify-center bg-taupe-100 p-6">
      <img src={PRODUCT_IMAGE} alt={PRODUCT_NAME} className="aspect-square w-full max-w-md object-cover" />
    </div>
  );
}

function QuickViewHeader() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Badge variant="warning">Quick view</Badge>
        <h3 className="heading mt-4 text-taupe-900">{PRODUCT_NAME}</h3>
        <p className="subheading mt-2 text-taupe-900">{PRODUCT_PRICE}</p>
      </div>
      <button
        type="button"
        aria-label="Close preview"
        className="rounded-full border border-taupe-200 p-2 text-taupe-500 transition hover:border-taupe-300 hover:text-taupe-900"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function ColorSelector({
  selectedColor,
  onChange,
}: {
  selectedColor: ColorName;
  onChange: (color: ColorName) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="label text-taupe-900">Color</p>
        <p className="caption text-taupe-400">{selectedColor}</p>
      </div>
      <div className="mt-3 flex items-center gap-3">
        {COLORS.map((color) => {
          const active = selectedColor === color.name;

          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onChange(color.name)}
              aria-label={`Select ${color.name}`}
              className={`flex size-9 items-center justify-center rounded-full border transition ${
                active ? "border-taupe-900" : "border-transparent hover:border-taupe-200"
              }`}
            >
              <span className={`size-6 rounded-full ${color.swatchClass}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function QuickViewDescriptionVariant() {
  const [selectedColor, setSelectedColor] = useState<ColorName>("Black");

  return (
    <QuickViewFrame>
      <QuickViewImage />
      <div className="p-6">
        <QuickViewHeader />
        <div className="mt-6">
          <ColorSelector selectedColor={selectedColor} onChange={setSelectedColor} />
        </div>
        <p className="body mt-6 text-taupe-500">{PRODUCT_DESCRIPTION}</p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-secondary/20 px-3 py-1.5 caption text-taupe-800">
          <Check className="size-4" />
          In stock for immediate dispatch
        </div>
        <Button className="mt-8 w-full">Add to bag</Button>
      </div>
    </QuickViewFrame>
  );
}
