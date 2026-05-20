import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

export type StepStatus = "complete" | "current" | "upcoming";

export interface Step {
  id?: string | number;
  name: string;
  description?: string;
  status: StepStatus;
  href?: string;
}

interface StepsProps {
  steps: Step[];
  variant?: "circles" | "bullets" | "progress";
  className?: string;
}

/* ---------- Circles variant ---------- */
function CirclesSteps({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol role="list" className="flex items-center">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li key={step.id ?? i} className={cn("relative", !isLast && "flex-1")}>
              {/* Connector line */}
              {!isLast && (
                <div className="absolute top-4 left-8 -right-px h-0.5" aria-hidden="true">
                  <div
                    className={cn(
                      "h-full",
                      step.status === "complete" ? "bg-brand-primary" : "bg-ground-200",
                    )}
                  />
                </div>
              )}

              <a
                href={step.href ?? "#"}
                onClick={!step.href ? (e) => e.preventDefault() : undefined}
                className="group relative flex flex-col items-center gap-2"
              >
                {/* Circle */}
                <span
                  className={cn(
                    "relative z-10 flex size-8 items-center justify-center rounded-full transition-colors",
                    step.status === "complete" &&
                      "bg-brand-primary group-hover:bg-brand-primary/80",
                    step.status === "current" && "border-2 border-brand-primary bg-white",
                    step.status === "upcoming" &&
                      "border-2 border-ground-300 bg-white group-hover:border-ground-400",
                  )}
                >
                  {step.status === "complete" ? (
                    <Check size={14} className="text-white" strokeWidth={2.5} />
                  ) : step.status === "current" ? (
                    <span className="size-2.5 rounded-full bg-brand-primary" />
                  ) : (
                    <span className="size-2.5 rounded-full bg-transparent group-hover:bg-ground-300" />
                  )}
                </span>

                {/* Labels */}
                <span className="flex flex-col items-center">
                  <span
                    className={cn(
                      "caption font-semibold",
                      step.status === "upcoming" ? "text-ground-400" : "text-ground-900",
                    )}
                  >
                    {step.name}
                  </span>
                  {step.description && (
                    <span className="caption text-ground-400">{step.description}</span>
                  )}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------- Bullets variant ---------- */
function BulletsSteps({ steps, className }: { steps: Step[]; className?: string }) {
  const currentIdx = steps.findIndex((s) => s.status === "current");

  return (
    <nav className={cn("flex items-center gap-4", className)} aria-label="Progress">
      <p className="body font-medium text-ground-700">
        Step {currentIdx + 1} of {steps.length}
      </p>
      <ol role="list" className="flex items-center gap-2">
        {steps.map((step, i) => (
          <li key={step.id ?? i}>
            <a
              href={step.href ?? "#"}
              onClick={!step.href ? (e) => e.preventDefault() : undefined}
              className="block"
            >
              {step.status === "complete" ? (
                <span
                  className="block size-2.5 rounded-full bg-brand-primary hover:bg-brand-primary/80 transition-colors"
                  title={step.name}
                />
              ) : step.status === "current" ? (
                <span
                  className="relative flex size-4 items-center justify-center"
                  aria-current="step"
                >
                  <span className="absolute size-4 rounded-full bg-brand-primary/20" />
                  <span className="relative size-2.5 rounded-full bg-brand-primary" />
                  <span className="sr-only">{step.name}</span>
                </span>
              ) : (
                <span
                  className="block size-2.5 rounded-full bg-ground-200 hover:bg-ground-300 transition-colors"
                  title={step.name}
                />
              )}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Progress bar variant ---------- */
function ProgressSteps({ steps, className }: { steps: Step[]; className?: string }) {
  const completeCount = steps.filter((s) => s.status === "complete").length;
  const currentIdx = steps.findIndex((s) => s.status === "current");
  const progress = ((completeCount + (currentIdx >= 0 ? 0.5 : 0)) / steps.length) * 100;

  return (
    <div className={cn("w-full", className)}>
      {/* Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ground-100">
        <div
          className="h-full rounded-full bg-brand-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Labels */}
      <div className="mt-4 grid" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div
              key={step.id ?? i}
              className={cn(
                "caption font-medium",
                i === 0 ? "text-left" : isLast ? "text-right" : "text-center",
                step.status === "upcoming" ? "text-ground-400" : "text-ground-900",
              )}
            >
              {step.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Main component ---------- */
function Steps({ steps, variant = "circles", className }: StepsProps) {
  const classNameProp = className !== undefined ? { className } : {};
  if (variant === "bullets") return <BulletsSteps steps={steps} {...classNameProp} />;
  if (variant === "progress") return <ProgressSteps steps={steps} {...classNameProp} />;
  return <CirclesSteps steps={steps} {...classNameProp} />;
}

export { Steps };
