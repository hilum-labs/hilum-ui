
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
    <Badge className="border border-brand-secondary/50 bg-brand-secondary/20 text-ground-800">
      {status}
    </Badge>
  );
}

export default function InvoiceList() {
  return (
    <div className="w-full bg-white p-6">
      <div className="overflow-hidden rounded-[32px] border border-ground-200 bg-white shadow-natural">
        {ORDERS.map((order, index) => (
          <div
            key={order.id}
            className={`grid gap-5 px-6 py-5 lg:grid-cols-[1fr_220px] ${index !== ORDERS.length - 1 ? "border-b border-ground-100" : ""}`}
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="subheading text-ground-900">{order.date}</p>
                <span className="caption text-ground-400">Order {order.id}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                {order.products.map((product) => (
                  <div key={product.name} className="flex items-center gap-3 rounded-2xl bg-ground-50 p-3">
                    <img src={product.img} alt={product.name} className="size-14 rounded-xl object-cover" />
                    <div>
                      <p className="caption font-semibold text-ground-900">{product.name}</p>
                      <p className="caption text-ground-500">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start justify-between gap-4 lg:items-end">
              <div className="text-left lg:text-right">
                <p className="caption text-ground-400">Total</p>
                <p className="heading mt-1 text-ground-900">{formatCurrency(order.total)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={order.status} />
                <a href="#" className="caption font-medium text-brand-primary transition hover:text-brand-primary/80">
                  View invoice
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
