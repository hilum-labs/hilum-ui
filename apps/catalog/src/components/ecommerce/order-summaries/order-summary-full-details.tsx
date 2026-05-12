
import { CheckCircle } from "lucide-react";
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

export default function OrderSummaryFullDetails() {
  const receiptEmail = "ava@example.com";
  const updateChannel = "Email";

  return (
    <div className="w-full bg-white p-6">
      <div className="space-y-8 rounded-[32px] border border-taupe-200 bg-white p-8 shadow-natural">
        <div className="flex flex-col gap-4 rounded-[28px] bg-taupe-50 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-brand-secondary text-taupe-900">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="label text-taupe-400">Order #{ORDER.id}</p>
              <h3 className="heading mt-2 text-taupe-900">Thank you!</h3>
              <p className="body mt-2 text-taupe-500">
                Your order was placed on {ORDER.placed} and is scheduled to arrive on {ORDER.arriving}.
              </p>
            </div>
          </div>
          <Badge variant="success">Arriving soon</Badge>
        </div>
        <div className="space-y-4">
          {ORDER.products.map((product) => (
            <div key={product.name} className="flex items-center gap-4 rounded-[24px] border border-taupe-100 p-4">
              <img src={product.img} alt={product.name} className="h-24 w-20 rounded-2xl object-cover" />
              <div className="flex-1">
                <p className="subheading text-taupe-900">{product.name}</p>
                <p className="caption mt-1 text-taupe-500">Delivered to your home address with tracking included.</p>
              </div>
              <p className="body font-medium text-taupe-900">{formatCurrency(product.price)}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[24px] border border-taupe-100 p-5">
            <p className="label text-taupe-400">Shipping address</p>
            <p className="subheading mt-3 text-taupe-900">Ava Mitchell</p>
            <p className="body mt-2 text-taupe-500">123 Market Street</p>
            <p className="body text-taupe-500">San Francisco, CA 94105</p>
            <p className="body text-taupe-500">United States</p>
          </div>
          <div className="rounded-[24px] border border-taupe-100 p-5">
            <p className="label text-taupe-400">Billing info</p>
            <p className="subheading mt-3 text-taupe-900">Visa ending in 4242</p>
            <p className="body mt-2 text-taupe-500">Receipt sent to {receiptEmail}</p>
            <p className="body text-taupe-500">Update channel: {updateChannel}</p>
          </div>
        </div>
        <TotalsCard />
      </div>
    </div>
  );
}
