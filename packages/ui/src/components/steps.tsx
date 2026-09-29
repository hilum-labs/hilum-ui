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
// One equal-width grid column per step, top-aligned, so circles stay on one
// line however the labels wrap; each connector runs from its circle to the
// next one (centre ± circle radius + gap), whatever the column width.
function CirclesSteps({ steps, className, labels }: VariantStepsProps) {
  return (
    <nav data-slot="steps" aria-label={labels.progress} className={className}>
      <ol
        role="list"
        className="grid items-start"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.id ?? i}
              data-slot="steps-item"
              data-status={step.status}
              className="relative flex min-w-0 flex-col items-center"
            >
              {/* Connector line */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  data-slot="steps-connector"
                  className={cn(
                    "absolute top-[17px] h-0.5 start-[calc(50%_+_1.5rem)] end-[calc(-50%_+_1.5rem)]",
                    step.status === "complete" ? "bg-brand-primary" : "bg-border-strong",
                  )}
                />
              )}

              <a
                href={step.href ?? "#"}
                onClick={!step.href ? (e) => e.preventDefault() : undefined}
                aria-current={step.status === "current" ? "step" : undefined}
                className="group relative flex min-w-0 max-w-full flex-col items-center gap-2 rounded-md px-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {/* Circle */}
                <span
                  data-slot="steps-circle"
                  className={cn(
                    "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full transition-colors motion-reduce:transition-none",
                    step.status === "complete" &&
                      "bg-brand-primary group-hover:bg-brand-primary/80",
                    step.status === "current" && "border-2 border-brand-primary bg-card",
                    step.status === "upcoming" &&
                      "border-2 border-border-strong bg-card group-hover:border-muted-foreground",
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

                {/* Labels: wrap between words; a word longer than the column breaks rather than overflow. */}
                <span className="flex min-w-0 max-w-full flex-col items-center">
                  <span
                    className={cn(
                      "caption max-w-full font-semibold text-balance break-words hyphens-auto",
                      step.status === "upcoming" ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {step.name}
                  </span>
                  {step.description && (
                    <span className="caption max-w-full text-pretty break-words hyphens-auto text-muted-foreground">
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
          <li key={step.id ?? i} data-slot="steps-item" data-status={step.status}>
            <a
              href={step.href ?? "#"}
              onClick={!step.href ? (e) => e.preventDefault() : undefined}
              aria-current={step.status === "current" ? "step" : undefined}
              aria-label={
                step.status === "complete"
                  ? labels.completed(step.name)
                  : step.status === "current"
                    ? labels.current(step.name)
                    : labels.upcoming(step.name)
              }
              className="group relative flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {step.status === "complete" ? (
                <span
                  aria-hidden="true"
                  data-slot="steps-dot"
                  className="block size-2.5 rounded-full bg-brand-primary transition-colors group-hover:bg-brand-primary/80 motion-reduce:transition-none"
                />
              ) : step.status === "current" ? (
                <span
                  aria-hidden="true"
                  data-slot="steps-dot"
                  className="relative flex size-4 items-center justify-center"
                >
                  <span className="absolute size-4 rounded-full bg-brand-primary/20" />
                  <span className="relative size-2.5 rounded-full bg-brand-primary" />
                </span>
              ) : (
                // Upcoming: a hollow dot in the muted text colour, visible on any surface.
                <span
                  aria-hidden="true"
                  data-slot="steps-dot"
                  className="block size-2.5 rounded-full border-[1.5px] border-muted-foreground transition-colors group-hover:bg-muted-foreground/30 motion-reduce:transition-none"
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
      <div
        data-slot="steps-progress-track"
        className="h-1.5 w-full overflow-hidden rounded-full bg-border"
      >
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
