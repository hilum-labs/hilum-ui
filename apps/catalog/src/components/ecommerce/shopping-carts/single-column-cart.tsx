
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";

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
    <div className="inline-flex items-center rounded-full border border-taupe-200 bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex size-9 items-center justify-center text-taupe-500 transition hover:bg-taupe-50 hover:text-taupe-900"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <div className="w-10 text-center body font-medium text-taupe-900">{value}</div>
      <button
        type="button"
        onClick={() => onChange(Math.min(8, value + 1))}
        className="flex size-9 items-center justify-center text-taupe-500 transition hover:bg-taupe-50 hover:text-taupe-900"
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
            <a href={item.href} className="subheading text-taupe-900 transition hover:text-brand-primary">
              {item.name}
            </a>
            <p className="caption mt-1 text-taupe-500">
              {item.color} / {item.size}
            </p>
          </div>
          <p className="body font-medium text-taupe-900">{formatCurrency(item.price * quantity)}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {quantityControl}
          {action}
        </div>
      </div>
    </div>
  );
}

export default function SingleColumnCart() {
  const [cartOne, setCartOne] = useState(getInitialQuantities);

  const subtotalOne = getSubtotal(cartOne);
  const shippingOne = 8;
  const taxOne = subtotalOne * 0.08;

  return (
    <div className="w-full bg-taupe-50 p-6">
      <div className="rounded-[32px] border border-taupe-200 bg-white p-8 shadow-natural">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="label text-taupe-400">Current order</p>
            <h3 className="heading mt-2 text-taupe-900">Shopping cart</h3>
          </div>
          <Badge variant="warning">Free shipping over $100</Badge>
        </div>
        <div className="space-y-6 border-b border-taupe-100 pb-8">
          {CART_ITEMS.map((item) => (
            <CartRow
              key={item.id}
              item={item}
              quantity={cartOne[item.id]}
              quantityControl={
                <QuantityStepper
                  value={cartOne[item.id]}
                  onChange={(next) => setCartOne((current) => ({ ...current, [item.id]: next }))}
                />
              }
              action={
                <button type="button" className="caption font-medium text-taupe-500 transition hover:text-brand-primary">
                  Remove
                </button>
              }
            />
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-10 body text-taupe-500">
              <span>Subtotal</span>
              <span className="text-taupe-900">{formatCurrency(subtotalOne)}</span>
            </div>
            <div className="flex items-center justify-between gap-10 body text-taupe-500">
              <span>Shipping</span>
              <span className="text-taupe-900">{formatCurrency(shippingOne)}</span>
            </div>
            <div className="flex items-center justify-between gap-10 body text-taupe-500">
              <span>Tax</span>
              <span className="text-taupe-900">{formatCurrency(taxOne)}</span>
            </div>
          </div>
          <div className="w-full max-w-sm space-y-4 rounded-3xl bg-taupe-50 p-5">
            <div className="flex items-center justify-between">
              <p className="subheading text-taupe-900">Total</p>
              <p className="heading text-taupe-900">{formatCurrency(subtotalOne + shippingOne + taxOne)}</p>
            </div>
            <Button className="w-full">Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
