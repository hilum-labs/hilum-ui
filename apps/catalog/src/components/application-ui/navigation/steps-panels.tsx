
const stepItems = ["Shipping", "Payment", "Confirmation"] as const;

export default function StepsPanels() {
  const descriptions = [
    "Choose delivery speed and destination.",
    "Add card details and billing address.",
    "Review everything before placing the order.",
  ];

  return (
    <div className="w-full bg-white px-6 py-6">
      <div className="flex flex-col gap-3 lg:flex-row">
        {stepItems.map((step, index) => (
          <div
            key={step}
            className={`flex-1 rounded-lg border px-6 py-4 ${
              index === 1 ? "border-brand-primary" : "border-taupe-100"
            }`}
          >
            <p className={`caption ${index === 1 ? "text-brand-primary" : "text-taupe-400"}`}>Step {index + 1}</p>
            <p className="body mt-2 font-semibold text-taupe-900">{step}</p>
            <p className="caption mt-1 text-taupe-500">{descriptions[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
