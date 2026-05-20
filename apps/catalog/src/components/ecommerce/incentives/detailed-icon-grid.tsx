
import { type ReactNode } from "react";
import { RefreshCw, Shield, Truck } from "lucide-react";

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
];

const coreIncentives = incentives.slice(0, 3);

function IconContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-14 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
      {children}
    </div>
  );
}

export default function DetailedIconGrid() {
  return (
    <section className="w-full rounded-xl border border-ground-100 bg-white px-6 py-12">
      <div className="grid gap-6 md:grid-cols-3">
        {coreIncentives.map((item) => (
          <div key={item.title} className="rounded-[24px] border border-ground-100 bg-ground-50 p-6">
            <IconContainer>
              <item.icon size={24} strokeWidth={1.8} />
            </IconContainer>
            <p className="subheading mt-4 text-ground-900">{item.title}</p>
            <p className="body mt-3 leading-relaxed text-ground-500">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
