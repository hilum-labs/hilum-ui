
import { type ReactNode } from "react";
import { ArrowRight, RefreshCw, Shield, Truck } from "lucide-react";
import { Button } from "@hilum/ui";
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
      className={`rounded-[24px] px-5 py-6 transition ${
        active ? "border border-brand-primary/40 bg-brand-primary/5" : "border border-transparent bg-white"
      } ${centered ? "text-center" : ""}`}
    >
      <div className={centered ? "mx-auto mb-4 w-fit" : "mb-4"}>
        <IconContainer>
          <Icon size={24} strokeWidth={1.8} />
        </IconContainer>
      </div>
      <p className="subheading text-taupe-900">{title}</p>
      <p className={`mt-2 ${detailed ? "body leading-relaxed text-taupe-500" : "caption leading-relaxed text-taupe-400"}`}>
        {description}
      </p>
    </div>
  );
}

export default function SplitHeaderHighlights() {
  return (
    <section className="w-full rounded-xl border border-taupe-100 bg-white px-6 py-12">
      <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:items-center">
        <div className="max-w-sm">
          <Badge variant="warning">Always on</Badge>
          <h2 className="heading mt-5 text-taupe-900">Free delivery on all orders over $100</h2>
          <p className="body mt-3 text-taupe-500">
            Pair the delivery message with two complementary trust notes to keep the section direct and conversion-focused.
          </p>
          <div className="mt-6">
            <Button>
              Learn more
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {coreIncentives.map((item) => (
            <IconFeature key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
