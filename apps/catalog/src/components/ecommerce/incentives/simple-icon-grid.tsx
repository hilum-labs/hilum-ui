import { RefreshCw, Shield, Truck } from "lucide-react";

const incentives = [
  {
    title: "Free shipping",
    description:
      "It's not actually free we just price it into the products. Someone's paying for it, and it's not us.",
    icon: Truck,
  },
  {
    title: "10-year warranty",
    description:
      "If it breaks in the first 10 years we'll replace it. After that you're on your own though.",
    icon: Shield,
  },
  {
    title: "Exchanges",
    description:
      "If you don't like it, trade it to one of your friends for something of theirs. Don't send it here though.",
    icon: RefreshCw,
  },
];

const coreIncentives = incentives.slice(0, 3);

export default function SimpleIconGrid() {
  return (
    <section className="w-full rounded-xl border border-ground-100 bg-white px-6 py-16">
      <div className="grid gap-6 md:grid-cols-3">
        {coreIncentives.map((item) => (
          <div key={item.title} className="space-y-4">
            <item.icon size={26} className="text-brand-primary" strokeWidth={1.9} />
            <p className="subheading text-ground-900">{item.title}</p>
            <p className="caption leading-relaxed text-ground-400">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
