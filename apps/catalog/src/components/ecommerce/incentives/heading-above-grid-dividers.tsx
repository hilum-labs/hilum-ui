import { type ReactNode } from "react";
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

function IconContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-14 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
      {children}
    </div>
  );
}

function IconFeature({
  title,
  description,
  icon: Icon,
  centered = false,
  detailed = false,
  active = false,
}: {
  title: string;
  description: string;
  icon: typeof Truck;
  centered?: boolean;
  detailed?: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] px-5 py-6 transition-colors ${
        active
          ? "border border-brand-primary/40 bg-brand-primary/5"
          : "border border-transparent bg-white"
      } ${centered ? "text-center" : ""}`}
    >
      <div className={centered ? "mx-auto mb-4 w-fit" : "mb-4"}>
        <IconContainer>
          <Icon size={24} strokeWidth={1.8} />
        </IconContainer>
      </div>
      <p className="subheading text-ground-900">{title}</p>
      <p
        className={`mt-2 ${detailed ? "body leading-relaxed text-ground-500" : "caption leading-relaxed text-ground-400"}`}
      >
        {description}
      </p>
    </div>
  );
}

export default function HeadingAboveGridDividers() {
  return (
    <section className="w-full rounded-xl border border-ground-100 bg-white px-6 py-12">
      <div className="max-w-xl">
        <h2 className="heading text-ground-900">Designed to remove hesitation before checkout</h2>
        <p className="body mt-3 text-ground-500">
          A compact trust strip for high-intent shopping moments with clear, readable details.
        </p>
      </div>
      <div className="mt-8 grid gap-0 rounded-[24px] border border-ground-100 md:grid-cols-3">
        {coreIncentives.map((item, index) => (
          <div
            key={item.title}
            className={`px-6 py-6 ${index < coreIncentives.length - 1 ? "border-b border-ground-100 md:border-b-0 md:border-r" : ""}`}
          >
            <IconFeature {...item} detailed />
          </div>
        ))}
      </div>
    </section>
  );
}
