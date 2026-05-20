
import { type ReactNode } from "react";
import { Leaf, RefreshCw, Shield, Truck } from "lucide-react";
import { Badge } from "@hilum/ui";

const incentives = [
  {
    title: "Free shipping",
    description: "It's not actually free we just price it into the products. Someone's paying for it, and it's not us.",
    icon: Truck,
  },
  {
    title: "10-year warranty",
    description: "If it breaks in the first 10 years we'll replace it. After that you're on your own though.",
    icon: Shield,
  },
  {
    title: "Exchanges",
    description: "If you don't like it, trade it to one of your friends for something of theirs. Don't send it here though.",
    icon: RefreshCw,
  },
  {
    title: "For the love of planet",
    description: "We've pledged 1% of sales to the preservation and restoration of the natural environment.",
    icon: Leaf,
  },
];

function IconContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-14 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
      {children}
    </div>
  );
}

export default function LargeTwoByTwoCards() {
  return (
    <section className="w-full rounded-xl border border-ground-100 bg-white p-6">
      <div className="grid gap-5 md:grid-cols-2">
        {incentives.map((item) => (
          <div
            key={item.title}
            className="rounded-[28px] border border-ground-100 bg-ground-50 p-7"
          >
            <IconContainer>
              <item.icon size={26} strokeWidth={1.8} />
            </IconContainer>
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="heading text-ground-900">{item.title}</p>
              <Badge variant="secondary">Trust signal</Badge>
            </div>
            <p className="body mt-3 max-w-md leading-relaxed text-ground-500">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
