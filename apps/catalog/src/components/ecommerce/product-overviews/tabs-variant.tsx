
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

const REVIEWS = [
  {
    name: "Alex Morgan",
    quote: "Soft weight, clean fit, and the six-pack makes reordering easy.",
  },
  {
    name: "Jordan Lee",
    quote: "The grayscale palette works with everything and the fabric holds shape well.",
  },
  {
    name: "Taylor Cruz",
    quote: "Arrived fast and the medium fit exactly as expected after one wash.",
  },
] as const;

type ColorName = (typeof COLORS)[number]["name"];
type SizeName = (typeof SIZES)[number];
type OverviewTab = "Details" | "Reviews" | "Shipping";

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
              className={`rounded-full border px-4 py-2 transition ${
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

export default function TabsVariant() {
  const [selectedColor, setSelectedColor] = useState<ColorName>("White");
  const [selectedSize, setSelectedSize] = useState<SizeName>("S");
  const [activeTab, setActiveTab] = useState<OverviewTab>("Details");

  return (
    <section className="w-full bg-white px-6 py-8 md:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-ground-50 p-8">
          <img src={PRODUCT_IMAGES[0]} alt={PRODUCT_NAME} className="aspect-square w-full object-cover" />
        </div>
        <div>
          <ProductHeader />
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <ColorSelector selectedColor={selectedColor} onChange={setSelectedColor} />
            <SizeSelector selectedSize={selectedSize} onChange={setSelectedSize} />
          </div>
          <nav className="mt-8 inline-flex rounded-full bg-ground-100 p-1">
            {(["Details", "Reviews", "Shipping"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 caption font-medium transition ${
                  activeTab === tab ? "bg-brand-primary text-white" : "text-ground-600 hover:text-ground-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="mt-6 rounded-[2rem] border border-ground-100 p-6">
            {activeTab === "Details" ? (
              <div>
                <p className="subheading text-ground-900">Made for everyday rotation</p>
                <p className="body mt-3 text-ground-500">{PRODUCT_DESCRIPTION}</p>
              </div>
            ) : null}
            {activeTab === "Reviews" ? (
              <div className="space-y-5">
                {REVIEWS.map((review) => (
                  <article key={review.name} className="border-b border-ground-100 pb-5 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-1 text-brand-secondary">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} className="size-4 fill-current" />
                      ))}
                    </div>
                    <p className="body mt-3 text-ground-700">{review.quote}</p>
                    <p className="caption mt-2 text-ground-400">{review.name}</p>
                  </article>
                ))}
              </div>
            ) : null}
            {activeTab === "Shipping" ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 size-5 text-brand-primary" />
                  <div>
                    <p className="body font-medium text-ground-900">Free standard shipping</p>
                    <p className="caption mt-1 text-ground-400">Arrives in 3 to 5 business days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="mt-0.5 size-5 text-brand-primary" />
                  <div>
                    <p className="body font-medium text-ground-900">Easy returns</p>
                    <p className="caption mt-1 text-ground-400">Return any unworn pack within 30 days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 text-brand-primary" />
                  <div>
                    <p className="body font-medium text-ground-900">Quality guarantee</p>
                    <p className="caption mt-1 text-ground-400">Backed by our lifetime stitching warranty.</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <Button className="mt-8 min-w-40">Add to bag</Button>
        </div>
      </div>
    </section>
  );
}
