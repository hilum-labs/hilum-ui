
import { type ReactNode, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const PRODUCT_NAME = "Basic Tee 6-Pack";
const PRODUCT_PRICE = "$192";
const PRODUCT_IMAGE =
  "https://tailwindui.com/img/ecommerce-images/product-page-02-secondary-product-shot.jpg";

const COLORS = [
  { name: "White", swatchClass: "bg-white border border-ground-300" },
  { name: "Gray", swatchClass: "bg-ground-400" },
  { name: "Black", swatchClass: "bg-ground-900" },
] as const;

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

type ColorName = (typeof COLORS)[number]["name"];
type SizeName = (typeof SIZES)[number];

function QuickViewFrame({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-ground-100 overflow-hidden">
      <div className="grid overflow-hidden rounded-xl bg-white lg:grid-cols-2">{children}</div>
    </div>
  );
}

function QuickViewImage() {
  return (
    <div className="flex items-center justify-center bg-ground-100 p-6">
      <img src={PRODUCT_IMAGE} alt={PRODUCT_NAME} className="aspect-square w-full max-w-md object-cover" />
    </div>
  );
}

function QuickViewHeader() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Badge variant="warning">Quick view</Badge>
        <h3 className="heading mt-4 text-ground-900">{PRODUCT_NAME}</h3>
        <p className="subheading mt-2 text-ground-900">{PRODUCT_PRICE}</p>
      </div>
      <button
        type="button"
        aria-label="Close preview"
        className="rounded-full border border-ground-200 p-2 text-ground-500 transition hover:border-ground-300 hover:text-ground-900"
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
        <p className="label text-ground-900">Color</p>
        <p className="caption text-ground-400">{selectedColor}</p>
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
                active ? "border-ground-900" : "border-transparent hover:border-ground-200"
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

function SizeSelector({
  selectedSize,
  onChange,
  large = false,
}: {
  selectedSize: SizeName;
  onChange: (size: SizeName) => void;
  large?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="label text-ground-900">Size</p>
        <a href="#" className="caption text-brand-primary hover:opacity-80">
          Size guide
        </a>
      </div>
      <div className={large ? "mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3" : "mt-3 flex flex-wrap gap-2"}>
        {SIZES.map((size) => {
          const active = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              onClick={() => onChange(size)}
              className={`border transition ${
                active
                  ? "border-ground-900 bg-ground-900 text-white"
                  : "border-ground-200 bg-white text-ground-700 hover:border-ground-400"
              } ${large ? "body min-h-14 rounded-2xl px-4 py-3 font-medium" : "rounded-full px-4 py-2 caption font-medium"}`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function QuickViewLargeSizeVariant() {
  const [selectedColor, setSelectedColor] = useState<ColorName>("White");
  const [selectedSize, setSelectedSize] = useState<SizeName>("M");

  return (
    <QuickViewFrame>
      <QuickViewImage />
      <div className="p-6">
        <QuickViewHeader />
        <div className="mt-6 space-y-6">
          <ColorSelector selectedColor={selectedColor} onChange={setSelectedColor} />
          <SizeSelector selectedSize={selectedSize} onChange={setSelectedSize} large />
        </div>
        <Button className="mt-8 w-full">Add to bag</Button>
      </div>
    </QuickViewFrame>
  );
}
