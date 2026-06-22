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

export default function SideBySide() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="heading text-ground-900">Got questions? We have answers.</h2>
          <p className="body mt-4 max-w-md text-ground-500">
            This layout works well when the FAQ needs to support a strong section headline and a bit
            more brand voice.
          </p>
        </div>

        <div className="space-y-8">
          {FAQS.map((item) => (
            <div key={item.q}>
              <p className="body font-semibold text-ground-900">{item.q}</p>
              <p className="body mt-2 text-ground-500">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
