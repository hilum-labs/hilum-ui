"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useLink } from "../lib/link-context";
import { useControllableState } from "../lib/use-controllable-state";
import { Card } from "./card";
import { Button } from "./button";
import { Progress } from "./progress";
import { CardHeadingTitle, type CardHeadingLevel } from "./card-heading";

/** A task's call to action: a button (`onAction`) or a link (`href`, via `LinkProvider`). */
interface SetupGuideAction {
  label: string;
  href?: string;
  onAction?: () => void;
  /** Open the link in a new tab (adds `target="_blank"` + `rel="noreferrer"`). */
  external?: boolean;
}

interface SetupGuideTask {
  /** Stable id. */
  id: string;
  title: string;
  /** Shown when the task is expanded. */
  description?: React.ReactNode;
  complete: boolean;
  /** Group id (see `groups`), e.g. "required" / "recommended". */
  group?: string;
  /** Primary call to action, always visible in the expanded task. */
  action?: SetupGuideAction;
  secondaryAction?: SetupGuideAction;
  /** Illustration shown beside the expanded task's text (hidden on small screens). */
  media?: React.ReactNode;
}

interface SetupGuideGroup {
  id: string;
  title: string;
  description?: string;
}

/** Localizable strings. Every entry has an English default. */
interface SetupGuideLabels {
  /** Progress summary, e.g. "3 of 7 tasks complete". */
  progress: (complete: number, total: number) => string;
  /** Collapse / expand toggle of the whole guide. */
  collapse: string;
  expand: string;
  dismiss: string;
  /** Accessible name of a task's status button. */
  markComplete: (title: string) => string;
  markIncomplete: (title: string) => string;
  /** Screen-reader status appended to each task title. */
  complete: string;
  incomplete: string;
}

const SETUP_GUIDE_DEFAULT_LABELS: SetupGuideLabels = {
  progress: (complete, total) =>
    `${complete} of ${total} ${total === 1 ? "task" : "tasks"} complete`,
  collapse: "Collapse setup guide",
  expand: "Expand setup guide",
  dismiss: "Dismiss setup guide",
  markComplete: (title) => `Mark "${title}" as done`,
  markIncomplete: (title) => `Mark "${title}" as not done`,
  complete: "Complete",
  incomplete: "Not complete",
};

interface SetupGuideProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  tasks: SetupGuideTask[];
  /** Task groups in display order (e.g. required, then recommended). Tasks without a matching group render first, ungrouped. */
  groups?: SetupGuideGroup[];
  /** Controlled expanded task id (`null` = none). Default: the first incomplete task. */
  expandedTaskId?: string | null;
  onExpandedTaskChange?: (taskId: string | null) => void;
  /** Controlled open state of the whole guide. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Show a dismiss button. Hide the guide in your app when called. */
  onDismiss?: () => void;
  /**
   * Let merchants tick tasks off (the status circle becomes a button). Without
   * it the status is display-only.
   */
  onTaskCompleteChange?: (taskId: string, complete: boolean) => void;
  /** Heading level of the title (`h2` … `h6`). Default: 2. */
  headingLevel?: CardHeadingLevel;
  /** Localizable strings; unspecified keys fall back to English. */
  labels?: Partial<SetupGuideLabels>;
  className?: string;
  ref?: React.Ref<HTMLElement>;
}

function SetupGuideActionButton({
  action,
  variant,
}: {
  action: SetupGuideAction;
  variant: "primary" | "ghost";
}) {
  const Link = useLink();
  if (action.href) {
    return (
      <Button variant={variant} size="sm" asChild>
        <Link
          href={action.href}
          {...(action.onAction ? { onClick: action.onAction } : {})}
          {...(action.external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {action.label}
        </Link>
      </Button>
    );
  }
  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      {...(action.onAction ? { onClick: action.onAction } : {})}
    >
      {action.label}
    </Button>
  );
}

function TaskStatus({
  task,
  labels,
  onTaskCompleteChange,
}: {
  task: SetupGuideTask;
  labels: SetupGuideLabels;
  onTaskCompleteChange: ((taskId: string, complete: boolean) => void) | undefined;
}) {
  const circle = (
    <span
      className={cn(
        "flex size-5 items-center justify-center rounded-full border-[1.5px] transition-colors motion-reduce:transition-none",
        task.complete
          ? "border-foreground bg-foreground text-background"
          : "border-dashed border-muted-foreground",
      )}
      aria-hidden="true"
    >
      {task.complete && <Check className="size-3" strokeWidth={3} />}
    </span>
  );
  if (!onTaskCompleteChange) {
    return <span className="flex size-7 shrink-0 items-center justify-center">{circle}</span>;
  }
  return (
    <button
      type="button"
      data-slot="setup-guide-task-status"
      aria-pressed={task.complete}
      aria-label={
        task.complete ? labels.markIncomplete(task.title) : labels.markComplete(task.title)
      }
      onClick={() => onTaskCompleteChange(task.id, !task.complete)}
      className="flex size-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {circle}
    </button>
  );
}

/**
 * Onboarding checklist card (Shopify admin's "Setup guide"): title,
 * description, "3 of 7 tasks complete" with a progress bar, collapsible and
 * optionally dismissible. Each task is a disclosure: its title toggles a panel
 * with the description and a visible primary call to action. One task is open
 * at a time, the first incomplete one by default.
 */
function SetupGuide({
  title,
  description,
  tasks,
  groups,
  expandedTaskId: expandedTaskIdProp,
  onExpandedTaskChange,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  onDismiss,
  onTaskCompleteChange,
  headingLevel = 2,
  labels: labelsProp,
  className,
  ref,
}: SetupGuideProps) {
  const labels = { ...SETUP_GUIDE_DEFAULT_LABELS, ...labelsProp };
  const baseId = React.useId();
  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const firstIncomplete = tasks.find((task) => !task.complete)?.id ?? null;
  const [expanded, setExpanded] = useControllableState<string | null>({
    value: expandedTaskIdProp,
    defaultValue: firstIncomplete,
    onChange: onExpandedTaskChange,
  });

  const completeCount = tasks.filter((task) => task.complete).length;
  const total = tasks.length;
  const progressText = labels.progress(completeCount, total);

  // Ungrouped tasks first, then each group in order.
  const knownGroups = new Set((groups ?? []).map((group) => group.id));
  const sections: Array<{ group: SetupGuideGroup | null; tasks: SetupGuideTask[] }> = [];
  const ungrouped = tasks.filter((task) => !task.group || !knownGroups.has(task.group));
  if (ungrouped.length > 0) sections.push({ group: null, tasks: ungrouped });
  for (const group of groups ?? []) {
    const groupTasks = tasks.filter((task) => task.group === group.id);
    if (groupTasks.length > 0) sections.push({ group, tasks: groupTasks });
  }

  const bodyId = `${baseId}-body`;

  const renderTask = (task: SetupGuideTask) => {
    const isExpanded = expanded === task.id;
    const triggerId = `${baseId}-task-${task.id}`;
    const panelId = `${baseId}-panel-${task.id}`;
    return (
      <li
        key={task.id}
        data-slot="setup-guide-task"
        data-state={isExpanded ? "open" : "closed"}
        data-complete={task.complete || undefined}
        className={cn(
          "rounded-lg transition-colors motion-reduce:transition-none",
          isExpanded ? "bg-muted/60" : "hover:bg-muted/40",
        )}
      >
        <div className="flex items-start gap-2 p-1.5">
          <TaskStatus task={task} labels={labels} onTaskCompleteChange={onTaskCompleteChange} />
          <div className="min-w-0 flex-1">
            <button
              type="button"
              id={triggerId}
              aria-expanded={isExpanded}
              aria-controls={panelId}
              onClick={() => setExpanded(isExpanded ? null : task.id)}
              className={cn(
                "flex min-h-7 w-full items-center rounded-md text-start body-sm text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isExpanded && "font-semibold",
              )}
            >
              <span className="min-w-0 flex-1">{task.title}</span>
              <span className="sr-only">
                {" "}
                ({task.complete ? labels.complete : labels.incomplete})
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isExpanded}
              data-slot="setup-guide-task-panel"
              className="pb-2 pe-2"
            >
              <div className="flex gap-4">
                <div className="min-w-0 flex-1">
                  {task.description && (
                    <div className="body-sm font-normal text-pretty text-muted-foreground">
                      {task.description}
                    </div>
                  )}
                  {(task.action || task.secondaryAction) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {task.action && (
                        <SetupGuideActionButton action={task.action} variant="primary" />
                      )}
                      {task.secondaryAction && (
                        <SetupGuideActionButton action={task.secondaryAction} variant="ghost" />
                      )}
                    </div>
                  )}
                </div>
                {task.media && (
                  <div className="hidden shrink-0 sm:block" aria-hidden="true">
                    {task.media}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <Card
      ref={ref as React.Ref<HTMLDivElement>}
      data-slot="setup-guide"
      data-state={open ? "open" : "closed"}
      className={cn("min-w-0 overflow-hidden", className)}
    >
      <div className="flex items-start gap-3 p-4 sm:px-5">
        <div className="min-w-0 flex-1">
          <CardHeadingTitle level={headingLevel}>{title}</CardHeadingTitle>
          {description && (
            <p className="caption mt-0.5 text-pretty text-muted-foreground">{description}</p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <p data-slot="setup-guide-progress" className="caption shrink-0 text-muted-foreground">
              {progressText}
            </p>
            <Progress
              value={total === 0 ? 0 : (completeCount / total) * 100}
              aria-label={progressText}
              className="h-1.5 max-w-40"
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {onDismiss && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={labels.dismiss}
              onClick={onDismiss}
            >
              <X aria-hidden="true" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={open ? labels.collapse : labels.expand}
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => setOpen(!open)}
          >
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "transition-transform motion-reduce:transition-none",
                open && "rotate-180",
              )}
            />
          </Button>
        </div>
      </div>
      <div
        id={bodyId}
        hidden={!open}
        data-slot="setup-guide-body"
        className="px-2.5 pb-3 sm:px-3.5"
      >
        {sections.map(({ group, tasks: sectionTasks }, index) => (
          <section
            key={group?.id ?? "ungrouped"}
            data-slot="setup-guide-group"
            {...(group ? { "aria-labelledby": `${baseId}-group-${group.id}` } : {})}
            className={cn(index > 0 && "mt-3 border-t border-border pt-3")}
          >
            {group && (
              <div className="px-1.5 pb-1.5">
                <p
                  id={`${baseId}-group-${group.id}`}
                  className="caption font-semibold text-foreground"
                >
                  {group.title}
                </p>
                {group.description && (
                  <p className="caption text-muted-foreground">{group.description}</p>
                )}
              </div>
            )}
            <ul className="flex flex-col gap-0.5">{sectionTasks.map(renderTask)}</ul>
          </section>
        ))}
      </div>
    </Card>
  );
}

SetupGuide.displayName = "SetupGuide";

export { SetupGuide, SETUP_GUIDE_DEFAULT_LABELS };
export type {
  SetupGuideAction,
  SetupGuideGroup,
  SetupGuideLabels,
  SetupGuideProps,
  SetupGuideTask,
};
