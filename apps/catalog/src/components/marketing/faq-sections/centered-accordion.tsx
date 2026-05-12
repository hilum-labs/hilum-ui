import { useState } from "react";

const FAQS = [
  {
    q: "How does the free trial work?",
    a: "You get full access to all features for 14 days, no credit card required. At the end of the trial, choose a plan or your data stays safe for 30 days.",
  },
  {
    q: "Can I change my plan later?",
    a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately and billing is prorated.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely.",
  },
  {
    q: "Is there a setup fee?",
    a: "No setup fees, ever. You pay only for the plan you choose, starting from day one of your paid subscription.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Cancel anytime from your account settings. You keep access until the end of your billing period.",
  },
  {
    q: "Do you offer discounts for nonprofits?",
    a: "Yes, we offer 50% off for registered nonprofits. Contact our support team with your nonprofit documentation.",
  },
];

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CenteredAccordion() {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({
    0: true,
    2: true,
  });

  const toggleItem = (index: number) => {
    setOpenItems((current) => ({
      ...current,
      [index]: !current[index],
    }));
  };

  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h2 className="heading text-taupe-900">Frequently asked questions</h2>
          <p className="body mt-3 text-taupe-500">
            Concise answers for the details customers usually ask before
            signing off on a purchase.
          </p>
        </div>

        <div className="divide-y divide-taupe-100 border-y border-taupe-100">
          {FAQS.map((item, index) => {
            const isOpen = !!openItems[index];

            return (
              <div key={item.q} className="py-1">
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between gap-4 px-1 py-5 text-left"
                >
                  <span className="body font-semibold text-taupe-900">
                    {item.q}
                  </span>
                  <ChevronDownIcon
                    className={`size-5 shrink-0 text-taupe-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="body pr-10 text-taupe-500">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
