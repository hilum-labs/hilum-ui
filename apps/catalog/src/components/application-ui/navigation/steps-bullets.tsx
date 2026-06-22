const stepItems = ["Shipping", "Payment", "Confirmation"] as const;

export default function StepsBullets() {
  const currentStep = 1;

  return (
    <div className="w-full bg-white px-6 py-8">
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {stepItems.map((step, index) => (
          <li key={step} className="flex items-center gap-3">
            <span
              className={`rounded-full ${
                index < currentStep
                  ? "h-3 w-3 bg-brand-primary"
                  : index === currentStep
                    ? "h-3 w-3 border-2 border-brand-primary bg-white"
                    : "h-3 w-3 bg-ground-200"
              }`}
            />
            <span
              className={`body ${index === currentStep ? "font-medium text-ground-900" : "text-ground-500"}`}
            >
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
