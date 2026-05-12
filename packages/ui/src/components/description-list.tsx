import * as React from "react";
import { cn } from "../lib/utils";

interface DescriptionItem {
  term: string;
  details: React.ReactNode;
  action?: React.ReactNode;
}

interface DescriptionListProps {
  title?: string;
  description?: string;
  items: DescriptionItem[];
  columns?: 1 | 2;
  striped?: boolean;
  className?: string;
}

function DescriptionList({
  title,
  description,
  items,
  columns = 1,
  striped = false,
  className,
}: DescriptionListProps) {
  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-4">
          {title && <p className="body font-semibold text-taupe-900">{title}</p>}
          {description && <p className="mt-1 caption text-taupe-400">{description}</p>}
        </div>
      )}

      <dl className={cn("border-t border-taupe-100", columns === 2 && "sm:grid sm:grid-cols-2")}>
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              "py-3.5",
              columns === 1
                ? "grid grid-cols-3 gap-4 items-baseline"
                : "flex flex-col gap-1 border-b border-taupe-100",
              columns === 1 && i !== items.length - 1 && "border-b border-taupe-100",
              striped && i % 2 === 0 && "bg-taupe-50 -mx-4 px-4 rounded",
            )}
          >
            <dt className="caption font-semibold text-taupe-500 uppercase tracking-wide">
              {item.term}
            </dt>
            <dd className={cn("body text-taupe-900", columns === 1 ? "col-span-2" : "")}>
              {item.action ? (
                <div className="flex items-center justify-between gap-4">
                  <span>{item.details}</span>
                  {item.action}
                </div>
              ) : (
                item.details
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export { DescriptionList };
export type { DescriptionItem };
