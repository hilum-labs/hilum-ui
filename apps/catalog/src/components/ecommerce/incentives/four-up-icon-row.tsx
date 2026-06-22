import { useState, type ReactNode } from "react";
import { Gift, Leaf, RefreshCw, Shield, Truck } from "lucide-react";

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
  {
    title: "For the love of planet",
    description:
      "We've pledged 1% of sales to the preservation and restoration of the natural environment.",
    icon: Leaf,
  },
];

const wrappedGift = {
  title: "Gift wrapping",
  description:
    "Premium wrap, handwritten note cards, and clean packaging ready to send directly to someone else.",
  icon: Gift,
};

const gridFour = [incentives[0], incentives[1], incentives[2], wrappedGift];

function IconContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-14 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
      {children}
    </div>
  );
}

export default function FourUpIconRow() {
  const [highlighted, setHighlighted] = useState(incentives[0].title);

  return (
    <section className="w-full rounded-xl border border-ground-100 bg-white px-6 py-12">
      <div className="grid gap-4 md:grid-cols-4">
        {gridFour.map((item) => (
          <button
            key={item.title}
            onMouseEnter={() => setHighlighted(item.title)}
            onClick={() => setHighlighted(item.title)}
            className={`rounded-[24px] border p-5 text-left transition-colors ${
              highlighted === item.title
                ? "border-brand-primary/40 bg-brand-primary/5"
                : "border-ground-100 bg-ground-50 hover:border-ground-200"
            }`}
          >
            <IconContainer>
              <item.icon size={24} strokeWidth={1.8} />
            </IconContainer>
            <p className="subheading mt-4 text-ground-900">{item.title}</p>
            <p className="caption mt-2 leading-relaxed text-ground-400">{item.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
