import { Badge } from "@hilum/ui";

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

export default function ThreeColumnsWithIntroduction() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
        <div className="space-y-4">
          <Badge variant="outline">Pricing support</Badge>
          <h2 className="heading text-taupe-900">Answers before you commit</h2>
          <p className="body text-taupe-500">
            Everything prospects usually need to know before they start a
            trial, upgrade a workspace, or talk to procurement.
          </p>
          <a
            href="#"
            className="body inline-block font-semibold text-brand-primary"
          >
            Explore pricing details
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:col-span-2">
          {FAQS.map((item) => (
            <div key={item.q}>
              <p className="body font-semibold text-taupe-900">{item.q}</p>
              <p className="body mt-2 text-taupe-500">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
