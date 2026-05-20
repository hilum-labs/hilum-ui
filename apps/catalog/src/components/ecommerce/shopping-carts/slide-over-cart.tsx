
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@hilum/ui";

const CART_ITEMS = [
  {
    id: 1,
    name: "Artwork Tee",
    href: "#",
    price: 32,
    color: "Bark",
    size: "Large",
    qty: 1,
    img: "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg",
  },
  {
    id: 2,
    name: "Basic Tee",
    href: "#",
    price: 32,
    color: "Aspen White",
    size: "Large",
    qty: 2,
    img: "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function getSubtotal(quantities: Record<number, number>) {
  return CART_ITEMS.reduce((sum, item) => sum + item.price * (quantities[item.id] ?? item.qty), 0);
}

function getInitialQuantities() {
  return CART_ITEMS.reduce<Record<number, number>>((acc, item) => {
    acc[item.id] = item.qty;
    return acc;
  }, {});
}

function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-ground-200 bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex size-9 items-center justify-center text-ground-500 transition hover:bg-ground-50 hover:text-ground-900"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <div className="w-10 text-center body font-medium text-ground-900">{value}</div>
      <button
        type="button"
        onClick={() => onChange(Math.min(8, value + 1))}
        className="flex size-9 items-center justify-center text-ground-500 transition hover:bg-ground-50 hover:text-ground-900"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function CartRow({
  item,
  quantity,
  quantityControl,
  action,
  compact = false,
}: {
  item: (typeof CART_ITEMS)[number];
  quantity: number;
  quantityControl: React.ReactNode;
  action: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`flex gap-4 ${compact ? "items-start" : "items-center"}`}>
      <img
        src={item.img}
        alt={item.name}
        className={`rounded-2xl object-cover ${compact ? "size-16" : "h-28 w-24"}`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <a href={item.href} className="subheading text-ground-900 transition hover:text-brand-primary">
              {item.name}
            </a>
            <p className="caption mt-1 text-ground-500">
              {item.color} / {item.size}
            </p>
          </div>
          <p className="body font-medium text-ground-900">{formatCurrency(item.price * quantity)}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {quantityControl}
          {action}
        </div>
      </div>
    </div>
  );
}

export default function SlideOverCart() {
  const [cartFour, setCartFour] = useState(getInitialQuantities);

  const subtotalFour = getSubtotal(cartFour);

  return (
    <div className="w-full bg-ground-900/5 p-6">
      <div className="ml-auto flex h-[720px] w-full max-w-md flex-col overflow-hidden rounded-[28px] border border-ground-200 bg-white shadow-elevated">
        <div className="flex items-center justify-between border-b border-ground-100 px-6 py-5">
          <div>
            <p className="label text-ground-400">Slide-over cart</p>
            <h3 className="heading mt-2 text-ground-900">Your bag</h3>
          </div>
          <Button variant="ghost" size="icon-sm">
            <X size={16} />
          </Button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {CART_ITEMS.map((item) => (
            <div key={item.id} className="rounded-[22px] border border-ground-100 p-4">
              <CartRow
                item={item}
                quantity={cartFour[item.id]}
                compact
                quantityControl={
                  <QuantityStepper
                    value={cartFour[item.id]}
                    onChange={(next) => setCartFour((current) => ({ ...current, [item.id]: next }))}
                  />
                }
                action={
                  <button
                    type="button"
                    className="flex items-center gap-1 caption font-medium text-ground-500 transition hover:text-brand-primary"
                  >
                    <X size={12} />
                    Remove
                  </button>
                }
              />
            </div>
          ))}
        </div>
        <div className="border-t border-ground-100 bg-ground-50 px-6 py-5">
          <div className="flex items-center justify-between">
            <p className="subheading text-ground-900">Subtotal</p>
            <p className="heading text-ground-900">{formatCurrency(subtotalFour)}</p>
          </div>
          <p className="caption mt-2 text-ground-500">Taxes and shipping are calculated at checkout.</p>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="flex-1">
              View cart
            </Button>
            <Button className="flex-1">Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
