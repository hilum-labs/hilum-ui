
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hilum/ui";

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

const QUANTITY_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"];

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

export default function TwoColumnCart() {
  const [cartTwo, setCartTwo] = useState(getInitialQuantities);

  const subtotalTwo = getSubtotal(cartTwo);
  const shippingTwo = 10;
  const taxTwo = subtotalTwo * 0.0825;

  return (
    <div className="w-full bg-white p-6">
      <div className="grid gap-8 rounded-[32px] border border-ground-200 bg-ground-50 p-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[28px] bg-white p-6 shadow-natural">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="label text-ground-400">Cart review</p>
              <h3 className="heading mt-2 text-ground-900">Items in your bag</h3>
            </div>
            <Badge variant="secondary">{CART_ITEMS.length} products</Badge>
          </div>
          <div className="space-y-6">
            {CART_ITEMS.map((item) => (
              <CartRow
                key={item.id}
                item={item}
                quantity={cartTwo[item.id]}
                quantityControl={
                  <div className="w-28">
                    <Select
                      value={String(cartTwo[item.id])}
                      onValueChange={(value) =>
                        setCartTwo((current) => ({ ...current, [item.id]: Number(value) }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Qty" />
                      </SelectTrigger>
                      <SelectContent>
                        {QUANTITY_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            Qty {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                }
                action={
                  <Button variant="ghost" size="sm">
                    <Trash2 size={14} />
                    Remove
                  </Button>
                }
              />
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-ground-200 bg-white p-6 shadow-natural lg:sticky lg:top-6 lg:self-start">
          <p className="label text-ground-400">Order summary</p>
          <h3 className="heading mt-2 text-ground-900">Ready for checkout</h3>
          <div className="mt-6 space-y-3 border-t border-ground-100 pt-6">
            <div className="flex items-center justify-between body text-ground-500">
              <span>Subtotal</span>
              <span className="text-ground-900">{formatCurrency(subtotalTwo)}</span>
            </div>
            <div className="flex items-center justify-between body text-ground-500">
              <span>Shipping</span>
              <span className="text-ground-900">{formatCurrency(shippingTwo)}</span>
            </div>
            <div className="flex items-center justify-between body text-ground-500">
              <span>Tax</span>
              <span className="text-ground-900">{formatCurrency(taxTwo)}</span>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-ground-50 p-4">
            <div className="flex items-center justify-between">
              <p className="subheading text-ground-900">Total</p>
              <p className="heading text-ground-900">{formatCurrency(subtotalTwo + shippingTwo + taxTwo)}</p>
            </div>
            <p className="caption mt-2 text-ground-500">Delivery in 2 to 4 business days.</p>
          </div>
          <Button className="mt-6 w-full">Checkout</Button>
        </div>
      </div>
    </div>
  );
}
