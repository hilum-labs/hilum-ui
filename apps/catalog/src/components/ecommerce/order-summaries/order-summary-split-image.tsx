
import { PackageCheck, Truck } from "lucide-react";
import { Badge } from "@hilum/ui";

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function TotalsCard() {
  return (
    <div className="rounded-[24px] border border-taupe-200 bg-taupe-50 p-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between body text-taupe-500">
          <span>Subtotal</span>
          <span className="text-taupe-900">{formatCurrency(ORDER.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between body text-taupe-500">
          <span>Shipping</span>
          <span className="text-taupe-900">{formatCurrency(ORDER.shipping)}</span>
        </div>
        <div className="flex items-center justify-between body text-taupe-500">
          <span>Tax</span>
          <span className="text-taupe-900">{formatCurrency(ORDER.tax)}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-taupe-200 pt-4">
        <p className="subheading text-taupe-900">Total</p>
        <p className="heading text-taupe-900">{formatCurrency(ORDER.total)}</p>
      </div>
    </div>
  );
}

export default function OrderSummarySplitImage() {
  const updateChannel = "Email";

  return (
    <div className="w-full bg-taupe-50 p-6">
      <div className="overflow-hidden rounded-[32px] border border-taupe-200 bg-white shadow-natural lg:grid lg:grid-cols-2">
        <div className="hidden bg-taupe-100 lg:block">
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,77,1,0.18),transparent_40%),linear-gradient(180deg,_rgba(235,231,223,0.6),rgba(235,231,223,0.95))] p-10">
            <img
              src={ORDER.products[0].img}
              alt={ORDER.products[0].name}
              className="h-full max-h-[520px] w-full rounded-[32px] object-cover shadow-elevated"
            />
          </div>
        </div>
        <div className="space-y-6 p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-brand-primary text-white">
              <PackageCheck size={18} />
            </div>
            <Badge variant="success">Order confirmed</Badge>
          </div>
          <div>
            <p className="label text-taupe-400">Order #{ORDER.id}</p>
            <h3 className="heading mt-2 text-taupe-900">Thank you for your order.</h3>
            <p className="body mt-2 text-taupe-500">
              We received your order on {ORDER.placed}. The carrier expects delivery by {ORDER.arriving}.
            </p>
          </div>
          <div className="space-y-4">
            {ORDER.products.map((product) => (
              <div key={product.name} className="flex items-center gap-4 rounded-[24px] border border-taupe-100 p-4">
                <img src={product.img} alt={product.name} className="size-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="body font-medium text-taupe-900">{product.name}</p>
                  <p className="caption text-taupe-500">Premium carry goods with tracking enabled.</p>
                </div>
                <p className="caption font-medium text-taupe-900">{formatCurrency(product.price)}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[24px] border border-taupe-200 bg-taupe-50 p-5">
            <div className="flex items-center gap-3">
              <Truck size={16} className="text-brand-primary" />
              <p className="body font-medium text-taupe-900">Shipment heading to San Francisco, California</p>
            </div>
            <p className="caption mt-2 text-taupe-500">You'll receive delivery updates by {updateChannel.toLowerCase()}.</p>
          </div>
          <TotalsCard />
        </div>
      </div>
    </div>
  );
}
