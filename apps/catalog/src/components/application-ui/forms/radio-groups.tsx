
import { type ReactNode, useState } from "react";

type Plan = "startup" | "business" | "enterprise";
type ApparelSize = "S" | "M" | "L" | "XL";
type AccentColor = "white" | "ground" | "black" | "brand-primary";

const planOptions: Array<{ value: Plan; label: string; price: string }> = [
  { value: "startup", label: "Startup", price: "$18 / mo" },
  { value: "business", label: "Business", price: "$48 / mo" },
  { value: "enterprise", label: "Enterprise", price: "$99 / mo" },
];

function VariantCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-ground-100 bg-ground-50/60 p-5 ${className}`}>
      <p className="label mb-3 text-ground-400">{title}</p>
      {children}
    </div>
  );
}

export default function RadioGroups() {
  const [contactPreference, setContactPreference] = useState<string>("newsletters");
  const [selectedPlan, setSelectedPlan] = useState<Plan>("business");
  const [selectedSize, setSelectedSize] = useState<ApparelSize>("M");
  const [selectedColor, setSelectedColor] = useState<AccentColor>("brand-primary");

  return (
    <div className="bg-white px-8 py-10">
      <div className="grid gap-5 xl:grid-cols-2">
        <VariantCard title="1. Simple list">
          <div className="space-y-3">
            {[
              {
                value: "newsletters",
                label: "Newsletters",
                description: "Product launches and design system release notes.",
              },
              {
                value: "offers",
                label: "Offers",
                description: "Occasional promotions and upgrade incentives.",
              },
              {
                value: "updates",
                label: "Updates",
                description: "Critical account, billing, and policy changes.",
              },
              {
                value: "none",
                label: "None",
                description: "Only send activity related to my own actions.",
              },
            ].map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-ground-100 bg-white p-3"
              >
                <input
                  type="radio"
                  name="contact-preference"
                  checked={contactPreference === option.value}
                  onChange={() => setContactPreference(option.value)}
                  className="mt-1 size-4 border-ground-300 text-brand-primary focus:ring-brand-primary/30"
                />
                <div>
                  <p className="body font-medium text-ground-900">{option.label}</p>
                  <p className="caption text-ground-400">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </VariantCard>

        <VariantCard title="2. Cards">
          <div className="grid gap-3 md:grid-cols-3">
            {planOptions.map((plan) => {
              const active = selectedPlan === plan.value;

              return (
                <button
                  key={plan.value}
                  type="button"
                  onClick={() => setSelectedPlan(plan.value)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    active
                      ? "border-brand-primary ring-2 ring-brand-primary"
                      : "border-ground-200 hover:border-ground-300"
                  }`}
                >
                  <p className="body font-medium text-ground-900">{plan.label}</p>
                  <p className="caption mt-1 text-ground-400">{plan.price}</p>
                </button>
              );
            })}
          </div>
        </VariantCard>

        <VariantCard title="3. Small cards">
          <div className="flex flex-wrap gap-2">
            {(["S", "M", "L", "XL"] as const).map((size) => {
              const active = selectedSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full px-4 py-2 body font-medium transition ${
                    active
                      ? "bg-brand-primary text-white"
                      : "border border-ground-200 bg-white text-ground-700 hover:border-ground-300"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </VariantCard>

        <VariantCard title="4. Color picker">
          <div className="flex items-center gap-3">
            {[
              {
                value: "white" as const,
                className: "border border-ground-200 bg-white",
              },
              {
                value: "ground" as const,
                className: "bg-ground-500",
              },
              {
                value: "black" as const,
                className: "bg-black",
              },
              {
                value: "brand-primary" as const,
                className: "bg-brand-primary",
              },
            ].map((option) => {
              const active = selectedColor === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-label={option.value}
                  onClick={() => setSelectedColor(option.value)}
                  className={`rounded-full p-1 transition ${
                    active ? "ring-2 ring-brand-primary ring-offset-1" : ""
                  }`}
                >
                  <span className={`block size-8 rounded-full ${option.className}`} />
                </button>
              );
            })}
          </div>
        </VariantCard>
      </div>
    </div>
  );
}
