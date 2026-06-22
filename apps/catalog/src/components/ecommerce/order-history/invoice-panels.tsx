import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

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

export default function InvoicePanels() {
  return (
    <div className="w-full bg-white p-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {ORDERS.map((order) => (
          <div
            key={order.id}
            className="rounded-[32px] border border-ground-200 bg-white p-6 shadow-natural"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label text-ground-400">Order number</p>
                <h3 className="heading mt-2 text-ground-900">{order.id}</h3>
                <p className="caption mt-1 text-ground-500">{order.date}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-6 space-y-4 border-y border-ground-100 py-6">
              {order.products.map((product) => (
                <div key={product.name} className="flex items-center gap-4">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="size-16 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="body font-medium text-ground-900">{product.name}</p>
                    <p className="caption text-ground-500">{formatCurrency(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="caption text-ground-400">Order total</p>
                <p className="heading mt-1 text-ground-900">{formatCurrency(order.total)}</p>
              </div>
              <Button variant="outline">Manage order</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
