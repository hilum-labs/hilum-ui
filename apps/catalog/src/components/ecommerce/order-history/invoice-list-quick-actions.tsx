
import { useState } from "react";
import { Download, MoreHorizontal } from "lucide-react";
import { Badge } from "@hilum/ui";

const ORDERS = [
  {
    id: "WU88191111",
    date: "July 6, 2021",
    total: 152.8,
    status: "Delivered",
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
  },
  {
    id: "AT48441546",
    date: "December 22, 2020",
    total: 88,
    status: "Delivered",
    products: [
      {
        name: "Double Stack Clothing Bag",
        price: 88,
        img: "https://tailwindui.com/img/ecommerce-images/order-history-page-05-product-03.jpg",
      },
    ],
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className="border border-brand-secondary/50 bg-brand-secondary/20 text-taupe-800">
      {status}
    </Badge>
  );
}

export default function InvoiceListQuickActions() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="w-full bg-taupe-50 p-6">
      <div className="space-y-4 rounded-[32px] border border-taupe-200 bg-white p-6 shadow-natural">
        {ORDERS.map((order) => (
          <div key={order.id} className="relative rounded-[24px] border border-taupe-100 p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="subheading text-taupe-900">{order.id}</p>
                  <StatusBadge status={order.status} />
                  <p className="caption text-taupe-500">{order.date}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {order.products.map((product) => (
                    <div key={product.name} className="flex items-center gap-3 rounded-2xl bg-taupe-50 p-3">
                      <img src={product.img} alt={product.name} className="size-14 rounded-xl object-cover" />
                      <div>
                        <p className="caption font-semibold text-taupe-900">{product.name}</p>
                        <p className="caption text-taupe-500">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 self-start">
                <div className="text-right">
                  <p className="caption text-taupe-400">Total</p>
                  <p className="body font-medium text-taupe-900">{formatCurrency(order.total)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenMenuId((current) => (current === order.id ? null : order.id))}
                  className="flex size-9 items-center justify-center rounded-full border border-taupe-200 text-taupe-500 transition hover:bg-taupe-50 hover:text-taupe-900"
                  aria-label={`Open quick actions for order ${order.id}`}
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            {openMenuId === order.id ? (
              <div className="absolute right-5 top-16 z-20 w-48 rounded-2xl border border-taupe-200 bg-white p-2 shadow-elevated">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 body text-taupe-700 transition hover:bg-taupe-50 hover:text-taupe-900"
                >
                  Manage
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 body text-taupe-700 transition hover:bg-taupe-50 hover:text-taupe-900"
                >
                  <Download size={14} />
                  Download invoice
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
