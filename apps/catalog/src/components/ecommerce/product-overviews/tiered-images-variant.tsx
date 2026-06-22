import { useState } from "react";
import { RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const PRODUCT_NAME = "Basic Tee 6-Pack";
const PRODUCT_PRICE = "$192";
const PRODUCT_DESCRIPTION =
  "The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous?";

const COLORS = [
  { name: "White", swatchClass: "bg-white border border-ground-300" },
  { name: "Gray", swatchClass: "bg-ground-400" },
  { name: "Black", swatchClass: "bg-ground-900" },
] as const;

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

const PRODUCT_IMAGES = [
  "https://tailwindui.com/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
  "https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg",
  "https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg",
  "https://tailwindui.com/img/ecommerce-images/product-page-02-featured-product-shot.jpg",
] as const;

type ColorName = (typeof COLORS)[number]["name"];
type SizeName = (typeof SIZES)[number];

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
              className={`flex size-10 items-center justify-center rounded-full border transition-colors ${
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
      <div
        className={
          large ? "mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3" : "mt-3 flex flex-wrap gap-2"
        }
      >
        {SIZES.map((size) => {
          const active = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              onClick={() => onChange(size)}
              className={`rounded-full border px-4 py-2 transition-colors ${
                large
                  ? active
                    ? "border-ground-900 bg-ground-900 text-white"
                    : "border-ground-200 bg-white text-ground-700 hover:border-ground-400"
                  : active
                    ? "border-ground-900 bg-ground-900 text-white"
                    : "border-ground-200 bg-white text-ground-700 hover:border-ground-400"
              } ${large ? "body min-h-14 rounded-2xl font-medium" : "caption font-medium"}`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProductHeader() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Badge variant="warning">Best seller</Badge>
        <div className="flex items-center gap-1 text-brand-secondary">
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} className="size-4 fill-current" />
          ))}
        </div>
      </div>
      <h3 className="heading mt-5 text-ground-900">{PRODUCT_NAME}</h3>
      <p className="subheading mt-3 text-ground-900">{PRODUCT_PRICE}</p>
    </div>
  );
}

export default function TieredImagesVariant() {
  const [selectedColor, setSelectedColor] = useState<ColorName>("Gray");
  const [selectedSize, setSelectedSize] = useState<SizeName>("M");

  return (
    <section className="w-full bg-white px-6 py-8 md:px-8">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr]">
        <img
          src={PRODUCT_IMAGES[0]}
          alt={PRODUCT_NAME}
          className="aspect-[4/5] w-full rounded-[2rem] bg-ground-50 object-cover"
        />
        <div className="grid gap-4">
          {PRODUCT_IMAGES.slice(1, 3).map((image) => (
            <img
              key={image}
              src={image}
              alt={PRODUCT_NAME}
              className="aspect-[4/3] w-full rounded-[2rem] bg-ground-50 object-cover"
            />
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <ProductHeader />
          <p className="body mt-6 max-w-2xl text-ground-500">{PRODUCT_DESCRIPTION}</p>
        </div>
        <div className="space-y-8">
          <ColorSelector selectedColor={selectedColor} onChange={setSelectedColor} />
          <SizeSelector selectedSize={selectedSize} onChange={setSelectedSize} />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-ground-100 p-4">
              <Truck className="size-5 text-brand-primary" />
              <p className="caption mt-3 text-ground-400">Ships free over $100</p>
            </div>
            <div className="rounded-2xl border border-ground-100 p-4">
              <RotateCcw className="size-5 text-brand-primary" />
              <p className="caption mt-3 text-ground-400">30-day returns</p>
            </div>
            <div className="rounded-2xl border border-ground-100 p-4">
              <ShieldCheck className="size-5 text-brand-primary" />
              <p className="caption mt-3 text-ground-400">Premium knit finish</p>
            </div>
          </div>
          <Button className="min-w-40">Add to bag</Button>
        </div>
      </div>
    </section>
  );
}
