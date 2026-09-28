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

/** Localizable strings. Every entry has an English default. */
export interface StepsLabels {
  /** Accessible name of the steps `<nav>`. */
  progress: string;
  /** "Step 2 of 5" (bullets variant). */
  stepOf: (current: number, total: number) => string;
  /** Accessible name of a completed step dot (bullets variant). */
  completed: (name: string) => string;
  /** Accessible name of the current step dot (bullets variant). */
  current: (name: string) => string;
  /** Accessible name of an upcoming step dot (bullets variant). */
  upcoming: (name: string) => string;
}

export const STEPS_DEFAULT_LABELS: StepsLabels = {
  progress: "Progress",
  stepOf: (current, total) => `Step ${current} of ${total}`,
  completed: (name) => `${name}: completed`,
  current: (name) => `${name}: current step`,
  upcoming: (name) => `${name}: upcoming`,
};

interface StepsProps {
  steps: Step[];
  variant?: "circles" | "bullets" | "progress";
  className?: string;
  /** Override any of the English strings. */
  labels?: Partial<StepsLabels>;
}

interface VariantStepsProps {
  steps: Step[];
  className?: string;
  labels: StepsLabels;
}

/* ---------- Circles variant ---------- */
function CirclesSteps({ steps, className, labels }: VariantStepsProps) {
  return (
    <nav data-slot="steps" aria-label={labels.progress} className={className}>
      <ol role="list" className="flex items-center">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li key={step.id ?? i} className={cn("relative", !isLast && "flex-1")}>
              {/* Connector line */}
              {!isLast && (
                <div className="absolute start-9 end-0 top-4.5 h-0.5" aria-hidden="true">
                  <div
                    className={cn(
                      "h-full",
                      step.status === "complete" ? "bg-brand-primary" : "bg-muted",
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
                    "relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                    step.status === "complete" &&
                      "bg-brand-primary group-hover:bg-brand-primary/80",
                    step.status === "current" && "border-2 border-brand-primary bg-card",
                    step.status === "upcoming" &&
                      "border-2 border-border bg-card group-hover:border-border",
                  )}
                >
                  {step.status === "complete" ? (
                    <Check size={14} className="text-background" strokeWidth={2.5} />
                  ) : step.status === "current" ? (
                    <span className="size-3 rounded-full bg-brand-primary" />
                  ) : (
                    <span className="size-3 rounded-full bg-transparent group-hover:bg-muted" />
                  )}
                </span>

                {/* Labels */}
                <span className="flex flex-col items-center">
                  <span
                    className={cn(
                      "caption font-semibold",
                      step.status === "upcoming" ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {step.name}
                  </span>
                  {step.description && (
                    <span className="caption text-pretty text-muted-foreground">
                      {step.description}
                    </span>
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
function BulletsSteps({ steps, className, labels }: VariantStepsProps) {
  const currentIdx = steps.findIndex((s) => s.status === "current");

  return (
    <nav
      data-slot="steps"
      className={cn("flex items-center gap-4", className)}
      aria-label={labels.progress}
    >
      <p className="body font-medium tabular-nums text-muted-foreground">
        {labels.stepOf(currentIdx + 1, steps.length)}
      </p>
      <ol role="list" className="flex items-center gap-2">
        {steps.map((step, i) => (
          <li key={step.id ?? i}>
            <a
              href={step.href ?? "#"}
              onClick={!step.href ? (e) => e.preventDefault() : undefined}
              className="relative flex h-9 w-9 items-center justify-center"
            >
              {step.status === "complete" ? (
                <span
                  className="block size-2.5 rounded-full bg-brand-primary transition-colors hover:bg-brand-primary/80"
                  aria-label={labels.completed(step.name)}
                />
              ) : step.status === "current" ? (
                <span
                  className="relative flex size-4 items-center justify-center"
                  aria-current="step"
                  aria-label={labels.current(step.name)}
                >
                  <span className="absolute size-4 rounded-full bg-brand-primary/20" />
                  <span className="relative size-2.5 rounded-full bg-brand-primary" />
                </span>
              ) : (
                <span
                  className="block size-2.5 rounded-full bg-muted transition-colors hover:bg-muted"
                  aria-label={labels.upcoming(step.name)}
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
function ProgressSteps({ steps, className }: Omit<VariantStepsProps, "labels">) {
  const completeCount = steps.filter((s) => s.status === "complete").length;
  const currentIdx = steps.findIndex((s) => s.status === "current");
  const progress = ((completeCount + (currentIdx >= 0 ? 0.5 : 0)) / steps.length) * 100;

  return (
    <div data-slot="steps" className={cn("w-full", className)}>
      {/* Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-brand-primary transition-[width] duration-500"
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
                "caption font-medium text-pretty",
                i === 0 ? "text-start" : isLast ? "text-end" : "text-center",
                step.status === "upcoming" ? "text-muted-foreground" : "text-foreground",
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
function Steps({ steps, variant = "circles", className, labels }: StepsProps) {
  const classNameProp = className !== undefined ? { className } : {};
  const l = { ...STEPS_DEFAULT_LABELS, ...labels };
  if (variant === "bullets") return <BulletsSteps steps={steps} labels={l} {...classNameProp} />;
  if (variant === "progress") return <ProgressSteps steps={steps} {...classNameProp} />;
  return <CirclesSteps steps={steps} labels={l} {...classNameProp} />;
}

Steps.displayName = "Steps";

export { Steps };
export type { StepsProps };
