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

export default function InvoiceTable() {
  return (
    <div className="w-full bg-ground-50 p-6">
      <div className="overflow-hidden rounded-[32px] border border-ground-200 bg-white shadow-natural">
        <table className="min-w-full">
          <thead className="border-b border-ground-100 bg-ground-50">
            <tr>
              <th className="px-6 py-4 text-left label text-ground-400">Order</th>
              <th className="px-6 py-4 text-left label text-ground-400">Date</th>
              <th className="px-6 py-4 text-left label text-ground-400">Total</th>
              <th className="px-6 py-4 text-left label text-ground-400">Status</th>
              <th className="px-6 py-4 text-right label text-ground-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((order, index) => (
              <tr
                key={order.id}
                className={index !== ORDERS.length - 1 ? "border-b border-ground-100" : ""}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {order.products.map((product) => (
                        <img
                          key={product.name}
                          src={product.img}
                          alt={product.name}
                          className="size-10 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                    </div>
                    <div>
                      <p className="body font-medium text-ground-900">{order.id}</p>
                      <p className="caption text-ground-500">
                        {order.products.map((product) => product.name).join(", ")}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 body text-ground-600">{order.date}</td>
                <td className="px-6 py-5 body font-medium text-ground-900">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-5 text-right">
                  <a
                    href="#"
                    className="caption font-medium text-brand-primary transition-colors hover:text-brand-primary/80"
                  >
                    Manage
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
