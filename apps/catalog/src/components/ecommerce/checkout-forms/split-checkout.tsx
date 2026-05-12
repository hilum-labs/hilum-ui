
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Label } from "@hilum/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hilum/ui";

const ORDER_PRODUCTS = [
  {
    name: "Micro Backpack",
    qty: 1,
    price: 70,
    img: "https://tailwindui.com/img/ecommerce-images/order-history-page-05-product-01.jpg",
  },
  {
    name: "Nomad Shopping Tote",
    qty: 1,
    price: 60,
    img: "https://tailwindui.com/img/ecommerce-images/order-history-page-05-product-02.jpg",
  },
];

const STATES = ["California", "New York", "Texas", "Washington"];
const COUNTRIES = ["United States", "Canada", "Mexico"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function SummaryRows() {
  const subtotal = ORDER_PRODUCTS.reduce((sum, product) => sum + product.price * product.qty, 0);
  const shipping = 12;
  const tax = 10.8;
  const total = subtotal + shipping + tax;

  return (
    <div className="space-y-3 border-t border-taupe-100 pt-4">
      <div className="flex items-center justify-between body text-taupe-500">
        <span>Subtotal</span>
        <span className="text-taupe-900">{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between body text-taupe-500">
        <span>Shipping</span>
        <span className="text-taupe-900">{formatCurrency(shipping)}</span>
      </div>
      <div className="flex items-center justify-between body text-taupe-500">
        <span>Tax</span>
        <span className="text-taupe-900">{formatCurrency(tax)}</span>
      </div>
      <div className="flex items-center justify-between subheading text-taupe-900">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

function OrderSummary({
  detailed = false,
  compact = false,
  className = "",
}: {
  detailed?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={`rounded-[28px] border border-taupe-200 bg-white p-6 shadow-natural ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="label text-taupe-400">Order summary</p>
          <h3 className="heading mt-2 text-taupe-900">Your items</h3>
        </div>
        <Badge variant="secondary">{ORDER_PRODUCTS.length} items</Badge>
      </div>
      <div className="mt-6 space-y-4">
        {ORDER_PRODUCTS.map((product) => (
          <div key={product.name} className="flex items-center gap-4">
            <img
              src={product.img}
              alt={product.name}
              className={compact ? "size-14 rounded-xl object-cover" : "size-16 rounded-2xl object-cover"}
            />
            <div className="min-w-0 flex-1">
              <p className="body font-medium text-taupe-900">{product.name}</p>
              <p className="caption text-taupe-500">Quantity {product.qty}</p>
              {detailed ? <p className="caption mt-1 text-taupe-400">Waxed canvas, carry-all interior, zipper pouch.</p> : null}
            </div>
            <p className="body font-medium text-taupe-900">{formatCurrency(product.price)}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <SummaryRows />
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} />
    </div>
  );
}

function ContactFields({ prefix }: { prefix: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField id={`${prefix}-first-name`} label="First name" placeholder="Ava" />
      <FormField id={`${prefix}-last-name`} label="Last name" placeholder="Mitchell" />
      <div className="sm:col-span-2">
        <FormField id={`${prefix}-email`} label="Email" type="email" placeholder="ava@example.com" />
      </div>
    </div>
  );
}

function ShippingFields({ prefix }: { prefix: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormField id={`${prefix}-address`} label="Address" placeholder="123 Market Street" />
      </div>
      <FormField id={`${prefix}-city`} label="City" placeholder="San Francisco" />
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-state`}>State</Label>
        <Select defaultValue="California">
          <SelectTrigger id={`${prefix}-state`}>
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {STATES.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FormField id={`${prefix}-postal`} label="Postal code" placeholder="94105" />
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-country`}>Country</Label>
        <Select defaultValue="United States">
          <SelectTrigger id={`${prefix}-country`}>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function PaymentFields({ prefix }: { prefix: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2 sm:col-span-3">
        <Label htmlFor={`${prefix}-card-number`}>Card number</Label>
        <Input id={`${prefix}-card-number`} placeholder="4242 4242 4242 4242" />
      </div>
      <FormField id={`${prefix}-expiry`} label="Expiry" placeholder="04 / 28" />
      <FormField id={`${prefix}-cvc`} label="CVC" placeholder="243" />
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-taupe-100 p-5">
      <div className="mb-5">
        <h3 className="subheading text-taupe-900">{title}</h3>
        <p className="caption mt-1 text-taupe-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function SplitCheckout() {
  return (
    <div className="w-full bg-taupe-50 p-6">
      <div className="grid gap-8 rounded-[32px] border border-taupe-200 bg-white p-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <FormSection title="Contact information" description="Use this email to send your receipt and shipping updates.">
            <ContactFields prefix="split-contact" />
          </FormSection>
          <FormSection title="Shipping address" description="We currently ship across North America.">
            <ShippingFields prefix="split-shipping" />
          </FormSection>
          <FormSection title="Payment" description="All transactions are secured and encrypted.">
            <PaymentFields prefix="split-payment" />
          </FormSection>
          <Button className="w-full sm:w-auto">Complete order</Button>
        </div>
        <OrderSummary className="lg:sticky lg:top-6 lg:self-start" />
      </div>
    </div>
  );
}
