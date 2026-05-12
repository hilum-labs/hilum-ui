
import { Check } from "lucide-react";

const stepItems = ["Shipping", "Payment", "Confirmation"] as const;

export default function StepsCircles() {
  const currentStep = 1;

  return (
    <div className="w-full bg-white px-6 py-8">
      <ol className="flex items-start">
        {stepItems.map((step, index) => (
          <div key={step} className="flex flex-1 items-start">
            <li className="flex flex-col items-center text-center">
              {index < currentStep ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white">
                  <Check size={14} />
                </div>
              ) : index === currentStep ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-primary text-sm font-medium text-brand-primary">
                  {index + 1}
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-taupe-200 text-sm font-medium text-taupe-400">
                  {index + 1}
                </div>
              )}
              <span className="caption mt-3 text-taupe-600">{step}</span>
            </li>
            {index < stepItems.length - 1 ? (
              <div className={`mt-4 h-px flex-1 ${index < currentStep ? "bg-brand-primary" : "bg-taupe-200"}`} />
            ) : null}
          </div>
        ))}
      </ol>
    </div>
  );
}
