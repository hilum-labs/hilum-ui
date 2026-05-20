
import { useState } from "react";
import { Minus, Plus, Ticket } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Label } from "@hilum/ui";

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

export default function ExtendedSummaryCart() {
  const [cartThree, setCartThree] = useState(getInitialQuantities);
  const [promoCode, setPromoCode] = useState("SAVE10");
  const [appliedPromo, setAppliedPromo] = useState("SAVE10");

  const subtotalThree = getSubtotal(cartThree);
  const discountThree = appliedPromo ? 10 : 0;
  const shippingThree = 12;
  const taxThree = subtotalThree * 0.08;

  return (
    <div className="w-full bg-ground-50 p-6">
      <div className="grid gap-8 rounded-[32px] border border-ground-200 bg-white p-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6 rounded-[28px] bg-white p-2">
          {CART_ITEMS.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-ground-100 p-5">
              <CartRow
                item={item}
                quantity={cartThree[item.id]}
                quantityControl={
                  <QuantityStepper
                    value={cartThree[item.id]}
                    onChange={(next) => setCartThree((current) => ({ ...current, [item.id]: next }))}
                  />
                }
                action={
                  <div className="caption text-ground-500">
                    Ships in 24 hours
                  </div>
                }
              />
            </div>
          ))}
        </div>
        <div className="rounded-[28px] border border-ground-200 bg-ground-50 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="label text-ground-400">Extended summary</p>
              <h3 className="heading mt-2 text-ground-900">Estimate your order</h3>
            </div>
            {appliedPromo ? (
              <Badge variant="success">
                <Ticket size={12} />
                {appliedPromo} applied
              </Badge>
            ) : null}
          </div>
          <div className="mt-6 space-y-2">
            <Label htmlFor="promo-code">Promo code</Label>
            <div className="flex gap-3">
              <Input
                id="promo-code"
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
                placeholder="Enter code"
              />
              <Button
                variant="outline"
                onClick={() => setAppliedPromo(promoCode.trim())}
              >
                Apply
              </Button>
            </div>
          </div>
          <div className="mt-6 space-y-3 border-t border-ground-200 pt-6">
            <div className="flex items-center justify-between body text-ground-500">
              <span>Subtotal</span>
              <span className="text-ground-900">{formatCurrency(subtotalThree)}</span>
            </div>
            <div className="flex items-center justify-between body text-ground-500">
              <span>Discount</span>
              <span className="text-brand-primary">-{formatCurrency(discountThree)}</span>
            </div>
            <div className="flex items-center justify-between body text-ground-500">
              <span>Shipping estimate</span>
              <span className="text-ground-900">{formatCurrency(shippingThree)}</span>
            </div>
            <div className="flex items-center justify-between body text-ground-500">
              <span>Tax</span>
              <span className="text-ground-900">{formatCurrency(taxThree)}</span>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="subheading text-ground-900">Total due today</p>
                <p className="caption mt-1 text-ground-500">Standard shipping arrives this week.</p>
              </div>
              <p className="heading text-ground-900">
                {formatCurrency(subtotalThree - discountThree + shippingThree + taxThree)}
              </p>
            </div>
          </div>
          <Button className="mt-6 w-full">Proceed to checkout</Button>
        </div>
      </div>
    </div>
  );
}
