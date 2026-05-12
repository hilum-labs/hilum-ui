
import { useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@hilum/ui";

const ORDER = {
  id: "BE210FB",
  placed: "July 6, 2021",
  arriving: "July 12, 2021",
  products: [
    {
      name: "Micro Backpack",
      price: 70,
      img: "https://tailwindui.com/img/ecommerce-images/order-history-page-05-product-01.jpg",
    },
    {
      name: "Nomad Shopping Tote",
      price: 60,
      img: "https://tailwindui.com/img/ecommerce-images/order-history-page-05-product-02.jpg",
    },
  ],
  subtotal: 130,
  shipping: 12,
  tax: 10.8,
  total: 152.8,
};

const TRACKING_STEPS = ["Order placed", "Processing", "Shipped", "Delivered"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function ProgressTracker({ activeStep }: { activeStep: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {TRACKING_STEPS.map((step, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;

        return (
          <div key={step} className="relative flex items-start gap-3">
            {index < TRACKING_STEPS.length - 1 ? (
              <div className="absolute left-4 top-4 hidden h-px w-[calc(100%-1rem)] bg-taupe-200 md:block" />
            ) : null}
            <div
              className={`relative z-10 flex size-8 items-center justify-center rounded-full border ${
                isCompleted
                  ? "border-brand-primary bg-brand-primary text-white"
                  : isActive
                    ? "border-brand-primary bg-white text-brand-primary ring-2 ring-brand-primary"
                    : "border-taupe-200 bg-white text-taupe-400"
              }`}
            >
              {isCompleted ? <CheckCircle size={14} /> : index + 1}
            </div>
            <div>
              <p className={`label ${isCompleted ? "text-brand-primary" : isActive ? "text-brand-primary" : "text-taupe-400"}`}>
                Step {index + 1}
              </p>
              <p className={`body font-medium ${isCompleted || isActive ? "text-taupe-900" : "text-taupe-500"}`}>{step}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderSummaryProgressBars() {
  const [activeStep, setActiveStep] = useState(2);

  return (
    <div className="w-full bg-taupe-50 p-6">
      <div className="space-y-8 rounded-[32px] border border-taupe-200 bg-white p-8 shadow-natural">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="label text-taupe-400">Tracking view</p>
            <h3 className="heading mt-2 text-taupe-900">Order progress</h3>
            <p className="caption mt-2 text-taupe-500">Move through the delivery stages to preview the component states.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setActiveStep((step) => Math.max(0, step - 1))}>
              <ChevronLeft size={16} />
              Previous
            </Button>
            <Button onClick={() => setActiveStep((step) => Math.min(TRACKING_STEPS.length - 1, step + 1))}>
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        <ProgressTracker activeStep={activeStep} />
        <div className="grid gap-4 md:grid-cols-2">
          {ORDER.products.map((product) => (
            <div key={product.name} className="rounded-[24px] border border-taupe-100 p-4">
              <div className="flex items-center gap-4">
                <img src={product.img} alt={product.name} className="size-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="subheading text-taupe-900">{product.name}</p>
                  <p className="caption mt-1 text-taupe-500">
                    {activeStep >= 2 ? "Tracking label created and carrier confirmed." : "Preparing the shipment and packing the order."}
                  </p>
                </div>
                <p className="body font-medium text-taupe-900">{formatCurrency(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
