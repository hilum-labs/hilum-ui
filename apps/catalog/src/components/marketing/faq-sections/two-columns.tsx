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

export default function TwoColumns() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="heading text-taupe-900">Frequently asked questions</h2>
        <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {FAQS.map((item) => (
            <div key={item.q}>
              <dt className="body font-semibold text-taupe-900">{item.q}</dt>
              <dd className="body mt-2 text-taupe-500">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
