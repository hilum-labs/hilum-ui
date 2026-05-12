
const stepItems = ["Shipping", "Payment", "Confirmation"] as const;

export default function StepsProgressBar() {
  return (
    <div className="w-full bg-white px-6 py-8">
      <div className="flex items-center justify-between">
        {stepItems.map((step, index) => (
          <div key={step} className="text-center">
            <p className={`caption ${index === 1 ? "text-brand-primary" : "text-taupe-400"}`}>Step {index + 1}</p>
            <p className={`body mt-1 ${index === 1 ? "font-semibold text-taupe-900" : "text-taupe-500"}`}>{step}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 h-2 rounded-full bg-taupe-100">
        <div className="h-2 rounded-full bg-brand-primary" style={{ width: "66%" }} />
      </div>
      <p className="caption mt-3 text-taupe-500">Step 2 of 3</p>
    </div>
  );
}
