"use client";

import {
  useRef,
  useEffect,
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { spring } from "../lib/springs";
import { fontWeights } from "../lib/font-weight";
import { useProximityHover } from "../hooks/use-proximity-hover";

// ── Context ──────────────────────────────────────────────

interface TableContextValue {
  registerItem: (index: number, element: HTMLElement | null) => void;
  activeIndex: number | null;
  density: TableDensity;
  mobileDensity: TableDensity;
}

const TableContext = createContext<TableContextValue | null>(null);

// ── Table ────────────────────────────────────────────────

type TableDensity = "default" | "compact";
type TableMobileSurface = "default" | "flat";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  containerClassName?: string;
  density?: TableDensity;
  mobileDensity?: TableDensity;
  mobileSurface?: TableMobileSurface;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      children,
      className,
      containerClassName,
      density = "default",
      mobileDensity = "default",
      mobileSurface = "default",
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } =
      useProximityHover(containerRef);

    useEffect(() => {
      measureItems();
    }, [measureItems, children]);

    const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

    return (
      <TableContext.Provider value={{ registerItem, activeIndex, density, mobileDensity }}>
        <div
          ref={containerRef}
          className={cn(
            "relative",
            mobileSurface === "flat" &&
              "max-sm:-mx-4 max-sm:overflow-x-auto max-sm:rounded-none max-sm:border-x-0",
            containerClassName,
          )}
          onMouseEnter={handlers.onMouseEnter}
          onMouseMove={handlers.onMouseMove}
          onMouseLeave={handlers.onMouseLeave}
        >
          {/* Hover background */}
          <AnimatePresence>
            {activeRect && (
              <motion.div
                key={sessionRef.current}
                className="absolute bg-hover pointer-events-none"
                initial={{
                  opacity: 0,
                  top: activeRect.top,
                  left: activeRect.left,
                  width: activeRect.width,
                  height: activeRect.height,
                }}
                animate={{
                  opacity: 1,
                  top: activeRect.top,
                  left: activeRect.left,
                  width: activeRect.width,
                  height: activeRect.height,
                }}
                exit={{ opacity: 0, transition: spring.fast.exit }}
                transition={{
                  ...spring.fast,
                  opacity: { duration: 0.08 },
                }}
              />
            )}
          </AnimatePresence>

          <table
            ref={ref}
            className={cn("w-full border-collapse text-[13px]", className)}
            {...props}
          >
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  },
);

Table.displayName = "Table";

// ── TableHeader ──────────────────────────────────────────

const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("", className)} {...props} />,
);

TableHeader.displayName = "TableHeader";

// ── TableBody ────────────────────────────────────────────

const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn("", className)} {...props} />,
);

TableBody.displayName = "TableBody";

// ── TableRow ─────────────────────────────────────────────

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  index?: number;
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ index, className, style, ...props }, ref) => {
    const internalRef = useRef<HTMLTableRowElement>(null);
    const ctx = useContext(TableContext);

    useEffect(() => {
      if (index === undefined || !ctx) return;
      ctx.registerItem(index, internalRef.current);
      return () => ctx.registerItem(index, null);
    }, [index, ctx]);

    const isBodyRow = index !== undefined;
    const activeIdx = ctx?.activeIndex ?? null;
    const hideBorder =
      activeIdx !== null &&
      ((isBodyRow && (index === activeIdx || index === activeIdx - 1)) ||
        (!isBodyRow && activeIdx === 0));

    return (
      <tr
        ref={(node) => {
          (internalRef as React.MutableRefObject<HTMLTableRowElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLTableRowElement | null>).current = node;
        }}
        data-proximity-index={index}
        className={cn(
          "group/row relative z-10 border-b transition-[border-color] duration-80",
          hideBorder ? "border-transparent" : "border-accent/40",
          isBodyRow && activeIdx === index && "is-active",
          className,
        )}
        style={{
          ...style,
          fontVariationSettings: isBodyRow ? fontWeights.normal : fontWeights.semibold,
        }}
        {...props}
      />
    );
  },
);

TableRow.displayName = "TableRow";

// ── TableHead ────────────────────────────────────────────

const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    const ctx = useContext(TableContext);
    const densityClass = ctx?.density === "compact" ? "px-2 py-1.5" : "px-3 py-2";
    const mobileDensityClass =
      ctx?.mobileDensity === "compact" ? "max-sm:px-2 max-sm:py-1.5" : "";

    return (
      <th
        ref={ref}
        className={cn(densityClass, mobileDensityClass, "text-left text-foreground", className)}
        {...props}
      />
    );
  },
);

TableHead.displayName = "TableHead";

// ── TableCell ────────────────────────────────────────────

const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    const ctx = useContext(TableContext);
    const densityClass = ctx?.density === "compact" ? "px-2 py-1.5" : "px-3 py-2";
    const mobileDensityClass =
      ctx?.mobileDensity === "compact" ? "max-sm:px-2 max-sm:py-1.5" : "";

    return (
      <td
        ref={ref}
        className={cn(
          densityClass,
          mobileDensityClass,
          "text-muted-foreground transition-colors duration-80 group-[.is-active]/row:text-foreground",
          className,
        )}
        {...props}
      />
    );
  },
);

TableCell.displayName = "TableCell";

const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tfoot ref={ref} className={cn("", className)} {...props} />,
);

TableFooter.displayName = "TableFooter";

const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-4 text-[13px] text-muted-foreground", className)}
      {...props}
    />
  ),
);

TableCaption.displayName = "TableCaption";

// ── Exports ──────────────────────────────────────────────

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption };
export type { TableDensity, TableMobileSurface, TableProps };
