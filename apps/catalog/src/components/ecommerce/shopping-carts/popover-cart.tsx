
import { ShoppingBag } from "lucide-react";
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

const subtotalFive = CART_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);

export default function PopoverCart() {
  return (
    <div className="flex w-full justify-center bg-taupe-50 p-8">
      <div className="w-full max-w-sm rounded-[26px] border border-taupe-200 bg-white p-5 shadow-natural">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-brand-primary text-white">
              <ShoppingBag size={18} />
            </div>
            <div>
              <p className="subheading text-taupe-900">Quick cart</p>
              <p className="caption text-taupe-500">{CART_ITEMS.reduce((sum, item) => sum + item.qty, 0)} items in bag</p>
            </div>
          </div>
          <Badge variant="secondary">{formatCurrency(subtotalFive)}</Badge>
        </div>
        <div className="mt-5 space-y-4">
          {CART_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-taupe-50 p-3">
              <img src={item.img} alt={item.name} className="size-14 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="caption font-semibold text-taupe-900">{item.name}</p>
                <p className="caption text-taupe-500">
                  Qty {item.qty} · {item.color}
                </p>
              </div>
              <p className="caption font-medium text-taupe-900">{formatCurrency(item.price * item.qty)}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex gap-3 border-t border-taupe-100 pt-5">
          <Button variant="outline" className="flex-1">
            View cart
          </Button>
          <Button className="flex-1">Checkout</Button>
        </div>
      </div>
    </div>
  );
}
