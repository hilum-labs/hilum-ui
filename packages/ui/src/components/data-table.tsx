"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ColumnSizingState,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type VisibilityState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronUp, ChevronDown, ChevronsUpDown, Columns3, MoreHorizontal } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table";
import { Button } from "./button";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import { Skeleton } from "./skeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "../lib/utils";
import { pluralize, useFormatter } from "../lib/format";
import { useControllableState } from "../lib/use-controllable-state";

/* ─────────────────────── Types ─────────────────────── */

/** Localizable strings. Every entry has an English default. */
interface DataTableLabels {
  /** Placeholder for the built-in `searchKey` input. */
  search: string;
  /** Default body text when there are no rows and no `emptyState`. */
  noResults: string;
  previous: string;
  next: string;
  /** "Page 2 of 10" — numbers are already locale-formatted. */
  pageOf: (page: string, pageCount: string) => string;
  /** Accessible name of the header checkbox. */
  selectAll: string;
  /** Accessible name of a row checkbox. `label` comes from `getRowLabel`, when set. */
  selectRow: (label: string | undefined, index: number) => string;
  /** "3 selected" — number already locale-formatted. */
  selected: (count: string) => string;
  /** "All 1,204 selected". */
  allSelected: (count: string) => string;
  /** "Select all 1,204" — the select-all-across-pages affordance. */
  selectAllMatching: (count: string) => string;
  clearSelection: string;
  /** Accessible name of the bulk actions group. */
  bulkActions: string;
  /** Trigger for non-promoted bulk actions. */
  moreActions: string;
  /** Column visibility menu trigger. */
  columns: string;
  /** Accessible name of a column resize handle. */
  resizeColumn: (column: string) => string;
  /** Announced while `loading`. */
  loading: string;
}

const DEFAULT_LABELS: DataTableLabels = {
  search: "Search...",
  noResults: "No results.",
  previous: "Previous",
  next: "Next",
  pageOf: (page, pageCount) => `Page ${page} of ${pageCount}`,
  selectAll: "Select all rows on this page",
  selectRow: (label) => (label ? `Select ${label}` : "Select row"),
  selected: (count) => `${count} selected`,
  allSelected: (count) => `All ${count} selected`,
  selectAllMatching: (count) => `Select all ${count}`,
  clearSelection: "Clear selection",
  bulkActions: "Bulk actions",
  moreActions: "More actions",
  columns: "Columns",
  resizeColumn: (column) => `Resize ${column} column`,
  loading: "Loading",
};

interface DataTableSelectionContext<TData> {
  /** Selected rows that are present in `data` (current page in server mode). */
  selectedRows: TData[];
  /** Every selected row id, including rows on other pages in server mode. */
  selectedRowIds: string[];
  /** Count shown in the bar — `totalCount` when all matching rows are selected. */
  selectedCount: number;
  /** True after the user chose "Select all N" across pages. */
  allMatchingSelected: boolean;
  clearSelection: () => void;
}

interface DataTableBulkAction<TData> {
  label: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  onAction: (context: DataTableSelectionContext<TData>) => void;
}

interface DataTableVirtualizeOptions {
  /** Estimated row height in px. Default 41. */
  estimateRowHeight?: number;
  /** Scroll viewport height. Default 480px. */
  height?: number | string;
  /** Rows rendered outside the viewport. Default 8. */
  overscan?: number;
}

interface DataTableProps<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  showPagination?: boolean;
  /** Rendered in the table body when there are no rows (e.g. an `<EmptyState>` with an action). */
  emptyState?: React.ReactNode;
  /**
   * Make rows clickable (e.g. open the detail page). Enter/Space activate focused rows.
   * Clicks on checkboxes, links, buttons and form controls inside the row are ignored,
   * as are clicks on anything marked `data-row-click-ignore`.
   */
  onRowClick?: (row: TData) => void;
  /** Noun for the result count — "12 orders". Default: "result". */
  itemLabel?: string;
  /** Plural noun when it isn't `${itemLabel}s`. */
  itemLabelPlural?: string;
  /** Localizable strings. Partial — unspecified keys fall back to English. */
  labels?: Partial<DataTableLabels>;
  /** Extra content in the toolbar row (filters, export). */
  toolbar?: React.ReactNode;
  className?: string;

  /* Identity & selection */
  /** Stable row id (e.g. `row => row.id`). Required for selection that survives paging/sorting. */
  getRowId?: (row: TData, index: number) => string;
  /** Human label for a row, used in its checkbox name ("Select Order #1042"). */
  getRowLabel?: (row: TData) => string;
  /** Adds a checkbox column. A function decides per row. Implied by bulk actions. */
  enableRowSelection?: boolean | ((row: TData) => boolean);
  rowSelection?: RowSelectionState;
  defaultRowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  /**
   * Bulk actions shown while rows are selected. An array renders buttons (or a
   * "More actions" menu when `promotedBulkActions` is also set); a function
   * renders anything you like.
   */
  bulkActions?:
    DataTableBulkAction<TData>[] | ((context: DataTableSelectionContext<TData>) => React.ReactNode);
  /** Always-visible bulk action buttons; `bulkActions` then go into a menu. */
  promotedBulkActions?: DataTableBulkAction<TData>[];
  /** Total rows matching the current query (server mode). Enables "Select all N". */
  totalCount?: number;
  /** Called when the user selects (true) or clears (false) all matching rows across pages. */
  onSelectAllMatching?: (selected: boolean) => void;

  /* Server-side / controlled state */
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
  /** Page count for `manualPagination`. Derived from `rowCount` when omitted. */
  pageCount?: number;
  /** Total row count for `manualPagination`. */
  rowCount?: number;
  sorting?: SortingState;
  defaultSorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  /** Replace body rows with skeleton rows and set `aria-busy`. */
  loading?: boolean;
  /** Skeleton rows while loading. Default: page size (max 10). */
  loadingRowCount?: number;

  /* Layout */
  /** Keep the header visible while scrolling. Offset with `--hilum-data-table-sticky-offset`. */
  stickyHeader?: boolean;
  /** Constrain the table to a scroll viewport (enables sticky header within it). */
  maxHeight?: number | string;
  /** Show a "Columns" menu to toggle hideable columns. */
  enableColumnVisibility?: boolean;
  columnVisibility?: VisibilityState;
  defaultColumnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  /** Column ids pinned to the inline-start edge. The selection column is pinned automatically. */
  columnPinning?: ColumnPinningState;
  onColumnPinningChange?: (pinning: ColumnPinningState) => void;
  /** Drag (or arrow-key) resize handles on headers. Uses fixed table layout. */
  enableColumnResizing?: boolean;
  columnSizing?: ColumnSizingState;
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;
  /** Writing direction for resize math. Default "ltr". */
  dir?: "ltr" | "rtl";
  /**
   * Render only visible rows (large client datasets). Disables pagination —
   * all filtered/sorted rows are scrollable in a fixed-height viewport.
   */
  virtualize?: boolean | DataTableVirtualizeOptions;

  /* Mobile */
  /**
   * `"cards"` renders rows as stacked cards below `mobileBreakpoint`: the
   * primary column as the card title and the other columns as label / value
   * rows. Selection, row clicks, bulk actions, loading and empty states work
   * the same. Default `"table"` (the table scrolls horizontally).
   */
  mobileLayout?: "table" | "cards";
  /** Width below which `mobileLayout="cards"` applies: `sm` (640px, default) or `md` (768px). */
  mobileBreakpoint?: "sm" | "md";
  /** Column id shown as the card title. Default: the first visible data column. */
  mobilePrimaryColumn?: string;
  /**
   * Column ids shown as label / value rows, in this order. Default: every
   * other visible column. The label is `meta.label` or a string `header`;
   * columns without one (e.g. row actions) render full width at the end.
   */
  mobileColumns?: string[];
}

const SELECT_COLUMN_ID = "__select";

const ROW_CLICK_IGNORE =
  'a,button,input,select,textarea,label,summary,[role="checkbox"],[role="button"],[role="link"],[role="menuitem"],[role="switch"],[contenteditable="true"],[data-row-click-ignore]';

function columnLabel<TData>(column: Column<TData, unknown>): string {
  const meta = column.columnDef.meta as { label?: string } | undefined;
  if (meta?.label) return meta.label;
  const header = column.columnDef.header;
  return typeof header === "string" ? header : column.id;
}

/** Whether a media query matches; `null` never matches. Re-renders on change. */
function useMediaQuery(query: string | null): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (!query || typeof window === "undefined" || !window.matchMedia) return () => {};
      const list = window.matchMedia(query);
      list.addEventListener?.("change", onChange);
      return () => list.removeEventListener?.("change", onChange);
    },
    [query],
  );
  return React.useSyncExternalStore(
    subscribe,
    () => Boolean(query && typeof window !== "undefined" && window.matchMedia?.(query).matches),
    () => false,
  );
}

/** Label of a column for the mobile cards: `meta.label` or a string header, else undefined. */
function cardColumnLabel<TData>(column: Column<TData, unknown>): string | undefined {
  const meta = column.columnDef.meta as { label?: string } | undefined;
  if (meta?.label) return meta.label;
  const header = column.columnDef.header;
  return typeof header === "string" ? header : undefined;
}

function toCssSize(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

/* ─────────────────────── DataTable ─────────────────────── */

/**
 * Resource table on TanStack Table: sorting, filtering, selection with bulk
 * actions, server-side mode, pinning, resizing, virtualization, and stacked
 * cards on phones (`mobileLayout="cards"`).
 *
 * Cell typography: body cells are 14px (`text-sm`), the size of
 * `ResourceCell`'s title. Keep one hierarchy per row:
 * - primary: the first column, a `ResourceCell` (14px medium, foreground);
 * - values: other cells as plain text (14px regular), numbers `tabular-nums`
 *   and end-aligned;
 * - secondary: `ResourceCell` `subtitle`, or a `caption` line (12px, muted).
 * Don't set cell text smaller than 14px or secondary text larger than 12px.
 */
function DataTable<TData>({
  columns,
  data,
  searchKey,
  searchPlaceholder,
  pageSize = 10,
  showPagination = true,
  emptyState,
  onRowClick,
  itemLabel = "result",
  itemLabelPlural,
  labels: labelsProp,
  toolbar,
  className,
  getRowId,
  getRowLabel,
  enableRowSelection,
  rowSelection: rowSelectionProp,
  defaultRowSelection,
  onRowSelectionChange,
  bulkActions,
  promotedBulkActions,
  totalCount,
  onSelectAllMatching,
  manualSorting = false,
  manualFiltering = false,
  manualPagination = false,
  pageCount,
  rowCount,
  sorting: sortingProp,
  defaultSorting,
  onSortingChange,
  pagination: paginationProp,
  onPaginationChange,
  columnFilters: columnFiltersProp,
  onColumnFiltersChange,
  loading = false,
  loadingRowCount,
  stickyHeader = false,
  maxHeight,
  enableColumnVisibility = false,
  columnVisibility: columnVisibilityProp,
  defaultColumnVisibility,
  onColumnVisibilityChange,
  columnPinning: columnPinningProp,
  onColumnPinningChange,
  enableColumnResizing = false,
  columnSizing: columnSizingProp,
  onColumnSizingChange,
  dir = "ltr",
  virtualize,
  mobileLayout = "table",
  mobileBreakpoint = "sm",
  mobilePrimaryColumn,
  mobileColumns,
}: DataTableProps<TData>) {
  const cardsQuery =
    mobileLayout === "cards"
      ? `(max-width: ${mobileBreakpoint === "md" ? "767.98px" : "639.98px"})`
      : null;
  const cards = useMediaQuery(cardsQuery);
  const fmt = useFormatter();
  const labels = React.useMemo(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp]);
  const locale = fmt.locale ? { locale: fmt.locale } : {};
  const num = (value: number) => fmt.number(value);

  const selectionEnabled =
    Boolean(enableRowSelection) || Boolean(bulkActions) || Boolean(promotedBulkActions?.length);
  const virtualOptions: DataTableVirtualizeOptions | null = virtualize
    ? virtualize === true
      ? {}
      : virtualize
    : null;

  const [sorting, setSorting] = useControllableState<SortingState>({
    value: sortingProp,
    defaultValue: defaultSorting ?? [],
    onChange: onSortingChange,
  });
  const [columnFilters, setColumnFilters] = useControllableState<ColumnFiltersState>({
    value: columnFiltersProp,
    defaultValue: [],
    onChange: onColumnFiltersChange,
  });
  const [pagination, setPagination] = useControllableState<PaginationState>({
    value: paginationProp,
    defaultValue: { pageIndex: 0, pageSize },
    onChange: onPaginationChange,
  });
  const [rowSelection, setRowSelectionState] = useControllableState<RowSelectionState>({
    value: rowSelectionProp,
    defaultValue: defaultRowSelection ?? {},
    onChange: onRowSelectionChange,
  });
  const [columnVisibility, setColumnVisibility] = useControllableState<VisibilityState>({
    value: columnVisibilityProp,
    defaultValue: defaultColumnVisibility ?? {},
    onChange: onColumnVisibilityChange,
  });
  const [columnPinning, setColumnPinning] = useControllableState<ColumnPinningState>({
    value: columnPinningProp,
    defaultValue: {},
    onChange: onColumnPinningChange,
  });
  const [columnSizing, setColumnSizing] = useControllableState<ColumnSizingState>({
    value: columnSizingProp,
    defaultValue: {},
    onChange: onColumnSizingChange,
  });
  const [allMatchingSelected, setAllMatchingSelected] = React.useState(false);
  const allMatchingRef = React.useRef(false);
  const lastSelectedIndexRef = React.useRef<number | null>(null);

  const setRowSelection = React.useCallback(
    (next: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)) => {
      setRowSelectionState(next);
      if (allMatchingRef.current) {
        allMatchingRef.current = false;
        setAllMatchingSelected(false);
        onSelectAllMatching?.(false);
      }
    },
    [setRowSelectionState, onSelectAllMatching],
  );

  const selectColumn = React.useMemo<ColumnDef<TData, unknown>>(
    () => ({
      id: SELECT_COLUMN_ID,
      size: 44,
      minSize: 44,
      maxSize: 44,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      enableColumnFilter: false,
      header: () => null,
      cell: () => null,
    }),
    [],
  );

  const allColumns = React.useMemo(
    () => (selectionEnabled ? [selectColumn, ...columns] : columns),
    [selectionEnabled, selectColumn, columns],
  );

  const effectivePinning = React.useMemo<ColumnPinningState>(() => {
    const left = columnPinning.left ?? [];
    if (!selectionEnabled || left.length === 0 || left.includes(SELECT_COLUMN_ID)) {
      return columnPinning;
    }
    return { ...columnPinning, left: [SELECT_COLUMN_ID, ...left] };
  }, [columnPinning, selectionEnabled]);
  const hasPinning = (effectivePinning.left?.length ?? 0) > 0;

  const options: TableOptions<TData> = {
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(virtualOptions ? {} : { getPaginationRowModel: getPaginationRowModel() }),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: setColumnSizing,
    enableRowSelection:
      typeof enableRowSelection === "function"
        ? (row: Row<TData>) => enableRowSelection(row.original)
        : selectionEnabled,
    enableColumnResizing,
    columnResizeMode: "onChange",
    columnResizeDirection: dir,
    manualSorting,
    manualFiltering,
    manualPagination,
    ...(pageCount !== undefined ? { pageCount } : {}),
    ...(rowCount !== undefined ? { rowCount } : {}),
    ...(getRowId ? { getRowId: (row: TData, index: number) => getRowId(row, index) } : {}),
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection,
      columnVisibility,
      columnPinning: effectivePinning,
      columnSizing,
    },
  };
  const table = useReactTable(options);

  const rows = table.getRowModel().rows;
  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const selectedRowIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
  const selectedCountOnData = selectedRowIds.length;
  const matchingTotal = totalCount ?? (manualPagination ? rowCount : undefined);
  const selectedCount =
    allMatchingSelected && matchingTotal !== undefined ? matchingTotal : selectedCountOnData;

  const clearSelection = React.useCallback(() => {
    lastSelectedIndexRef.current = null;
    setRowSelection({});
  }, [setRowSelection]);

  const selectionContext: DataTableSelectionContext<TData> = {
    selectedRows: table.getSelectedRowModel().rows.map((row) => row.original),
    selectedRowIds,
    selectedCount,
    allMatchingSelected,
    clearSelection,
  };

  // "Select all N" is offered once the whole page is selected and more rows match.
  const clientMatching = table.getFilteredRowModel().rows.length;
  const selectAllTarget = matchingTotal ?? clientMatching;
  const canSelectAllMatching =
    selectionEnabled &&
    !allMatchingSelected &&
    table.getIsAllPageRowsSelected() &&
    selectAllTarget > selectedCountOnData &&
    (matchingTotal !== undefined ? Boolean(onSelectAllMatching) : true);

  const handleSelectAllMatching = () => {
    if (matchingTotal !== undefined) {
      allMatchingRef.current = true;
      setAllMatchingSelected(true);
      onSelectAllMatching?.(true);
    } else {
      table.toggleAllRowsSelected(true);
      onSelectAllMatching?.(true);
    }
  };

  const toggleRow = (row: Row<TData>, index: number, shiftKey: boolean) => {
    const target = !row.getIsSelected();
    const last = lastSelectedIndexRef.current;
    if (shiftKey && last !== null && last !== index) {
      const [from, to] = last < index ? [last, index] : [index, last];
      const range = rows.slice(from, to + 1).filter((candidate) => candidate.getCanSelect());
      setRowSelection((prev) => {
        const next = { ...prev };
        for (const candidate of range) {
          if (target) next[candidate.id] = true;
          else delete next[candidate.id];
        }
        return next;
      });
    } else {
      row.toggleSelected(target);
    }
    lastSelectedIndexRef.current = index;
  };

  /* ── Virtualization ── */
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const estimateRowHeight = virtualOptions?.estimateRowHeight ?? 41;
  const viewportHeight = virtualOptions?.height ?? 480;
  const virtualizer = useVirtualizer({
    count: virtualOptions ? rows.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: virtualOptions?.overscan ?? 8,
    initialRect: {
      width: 0,
      height: typeof viewportHeight === "number" ? viewportHeight : 480,
    },
  });
  const virtualItems = virtualOptions ? virtualizer.getVirtualItems() : [];
  const paddingTop = virtualItems.length > 0 ? (virtualItems[0]?.start ?? 0) : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? virtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end ?? 0)
      : 0;

  /* ── Cell styles (pinning / sizing) ── */
  const sizeStyle = (column: Column<TData, unknown>): React.CSSProperties | undefined => {
    const pinned = column.getIsPinned() === "left";
    if (!enableColumnResizing && !pinned && column.id !== SELECT_COLUMN_ID) return undefined;
    const size = column.getSize();
    return {
      width: size,
      minWidth: size,
      maxWidth: size,
      ...(pinned ? { insetInlineStart: column.getStart("left") } : {}),
    };
  };
  const pinnedClass = (column: Column<TData, unknown>, header: boolean) =>
    column.getIsPinned() === "left"
      ? cn(
          "sticky bg-background",
          header ? "z-30" : "z-20",
          column.getIsLastColumn("left") && "border-e border-border",
        )
      : undefined;

  const stickyHeadClass = stickyHeader
    ? "sticky top-[var(--hilum-data-table-sticky-offset,0px)] z-20 bg-background"
    : undefined;

  /* ── Rendering helpers ── */
  const renderSelectCell = (row: Row<TData>, index: number) => {
    const label = labels.selectRow(getRowLabel?.(row.original), index);
    return (
      <Checkbox
        aria-label={label}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleRow(row, index, event.shiftKey);
        }}
      />
    );
  };

  const renderSelectHeader = () => {
    const all = table.getIsAllPageRowsSelected();
    const some = table.getIsSomePageRowsSelected();
    return (
      <Checkbox
        aria-label={labels.selectAll}
        checked={all ? true : some ? "indeterminate" : false}
        disabled={rows.length === 0}
        onClick={(event) => {
          event.preventDefault();
          lastSelectedIndexRef.current = null;
          table.toggleAllPageRowsSelected(!all);
        }}
      />
    );
  };

  const rowClickProps = (row: Row<TData>) =>
    onRowClick
      ? {
          tabIndex: 0,
          onClick: (event: React.MouseEvent<HTMLElement>) => {
            const target = event.target as HTMLElement;
            const ignored = target.closest(ROW_CLICK_IGNORE);
            if (
              ignored &&
              ignored !== event.currentTarget &&
              event.currentTarget.contains(ignored)
            ) {
              return;
            }
            if (window.getSelection?.()?.toString()) return;
            onRowClick(row.original);
          },
          onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onRowClick(row.original);
            }
          },
        }
      : {};

  const renderRow = (row: Row<TData>, index: number, virtualIndex?: number) => {
    const selected = row.getIsSelected();
    const clickable = Boolean(onRowClick);
    return (
      <TableRow
        key={row.id}
        data-state={selected ? "selected" : undefined}
        {...(selectionEnabled ? { "aria-selected": selected } : {})}
        {...(virtualIndex !== undefined
          ? {
              "aria-rowindex": virtualIndex + 2,
              "data-index": virtualIndex,
              ref: virtualizer.measureElement,
            }
          : {})}
        className={cn(
          selected && "bg-muted/60",
          clickable &&
            "cursor-pointer hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
        )}
        {...rowClickProps(row)}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            style={sizeStyle(cell.column)}
            className={cn(
              pinnedClass(cell.column, false),
              cell.column.id === SELECT_COLUMN_ID && "pe-0",
            )}
          >
            {cell.column.id === SELECT_COLUMN_ID ? (
              <span className="flex items-center">{renderSelectCell(row, index)}</span>
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const skeletonCount = loadingRowCount ?? Math.min(pagination.pageSize, 10);

  const renderBody = () => {
    if (loading) {
      return Array.from({ length: skeletonCount }, (_, index) => (
        <TableRow key={`skeleton-${index}`} aria-hidden="true" data-slot="data-table-skeleton-row">
          {table.getVisibleLeafColumns().map((column) => (
            <TableCell
              key={column.id}
              style={sizeStyle(column)}
              className={pinnedClass(column, false)}
            >
              <Skeleton
                className={cn("h-4", column.id === SELECT_COLUMN_ID ? "size-4" : "w-3/4")}
              />
            </TableCell>
          ))}
        </TableRow>
      ));
    }
    if (!rows.length) {
      return (
        <TableRow>
          <TableCell
            colSpan={visibleColumnCount}
            className={cn(!emptyState && "h-24 text-center text-muted-foreground")}
          >
            {emptyState ?? labels.noResults}
          </TableCell>
        </TableRow>
      );
    }
    if (virtualOptions) {
      return (
        <>
          {paddingTop > 0 && (
            <tr aria-hidden="true">
              <td colSpan={visibleColumnCount} style={{ height: paddingTop, padding: 0 }} />
            </tr>
          )}
          {virtualItems.map((item) => {
            const row = rows[item.index];
            return row ? renderRow(row, item.index, item.index) : null;
          })}
          {paddingBottom > 0 && (
            <tr aria-hidden="true">
              <td colSpan={visibleColumnCount} style={{ height: paddingBottom, padding: 0 }} />
            </tr>
          )}
        </>
      );
    }
    return rows.map((row, index) => renderRow(row, index));
  };

  const hideableColumns = table.getAllLeafColumns().filter((column) => column.getCanHide());
  const showToolbar = Boolean(
    searchKey || toolbar || (enableColumnVisibility && hideableColumns.length),
  );
  const showBulkBar = selectionEnabled && (selectedCountOnData > 0 || allMatchingSelected);

  const totalForCount = manualPagination
    ? (rowCount ?? totalCount ?? table.getRowCount())
    : table.getFilteredRowModel().rows.length;
  const pageCountValue = Math.max(table.getPageCount(), 1);

  const renderBulkActionButton = (action: DataTableBulkAction<TData>) => (
    <Button
      key={action.label}
      type="button"
      size="sm"
      variant={action.destructive ? "destructive" : "outline"}
      disabled={action.disabled}
      onClick={() => action.onAction(selectionContext)}
    >
      {action.icon && (
        <span className="inline-flex [&_svg]:size-3.5" aria-hidden="true">
          {action.icon}
        </span>
      )}
      {action.label}
    </Button>
  );

  const selectionAnnouncement = showBulkBar
    ? allMatchingSelected
      ? labels.allSelected(num(selectedCount))
      : labels.selected(num(selectedCount))
    : "";

  const tableElement = (
    <Table
      aria-busy={loading || undefined}
      {...(virtualOptions ? { "aria-rowcount": rows.length + 1 } : {})}
      className={cn(enableColumnResizing && "table-fixed")}
      style={enableColumnResizing ? { width: table.getTotalSize(), minWidth: "100%" } : undefined}
    >
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} {...(virtualOptions ? { "aria-rowindex": 1 } : {})}>
            {headerGroup.headers.map((header) => {
              const column = header.column;
              const canSort = column.getCanSort();
              const sorted = column.getIsSorted();
              return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  style={sizeStyle(column)}
                  className={cn(
                    "relative text-start",
                    stickyHeadClass,
                    pinnedClass(column, true),
                    column.id === SELECT_COLUMN_ID && "pe-0",
                  )}
                  aria-sort={
                    canSort
                      ? sorted === "asc"
                        ? "ascending"
                        : sorted === "desc"
                          ? "descending"
                          : "none"
                      : undefined
                  }
                >
                  {column.id === SELECT_COLUMN_ID ? (
                    <span className="flex items-center">{renderSelectHeader()}</span>
                  ) : header.isPlaceholder ? null : canSort ? (
                    <button
                      type="button"
                      className={cn(
                        "flex min-h-10 items-center gap-1 rounded-sm text-start transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        sorted && "text-foreground",
                      )}
                      onClick={column.getToggleSortingHandler()}
                    >
                      {flexRender(column.columnDef.header, header.getContext())}
                      {sorted === "asc" ? (
                        <ChevronUp size={12} className="text-brand-primary" aria-hidden="true" />
                      ) : sorted === "desc" ? (
                        <ChevronDown size={12} className="text-brand-primary" aria-hidden="true" />
                      ) : (
                        <ChevronsUpDown
                          size={12}
                          className="text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ) : (
                    flexRender(column.columnDef.header, header.getContext())
                  )}
                  {enableColumnResizing && column.getCanResize() && (
                    /* A focusable separator is the ARIA splitter pattern (a widget), which jsx-a11y treats as static. */
                    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
                    <div
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={labels.resizeColumn(columnLabel(column))}
                      aria-valuenow={column.getSize()}
                      aria-valuemin={column.columnDef.minSize ?? 20}
                      aria-valuemax={column.columnDef.maxSize ?? 1000}
                      tabIndex={0}
                      data-slot="data-table-resize-handle"
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      onDoubleClick={() => column.resetSize()}
                      onKeyDown={(event) => {
                        const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
                        const backward = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
                        if (event.key !== forward && event.key !== backward) return;
                        event.preventDefault();
                        const delta = (event.key === forward ? 1 : -1) * (event.shiftKey ? 50 : 10);
                        const min = column.columnDef.minSize ?? 20;
                        const max = column.columnDef.maxSize ?? 1000;
                        const next = Math.min(max, Math.max(min, column.getSize() + delta));
                        table.setColumnSizing((prev) => ({ ...prev, [column.id]: next }));
                      }}
                      className={cn(
                        "absolute inset-y-0 end-0 w-1.5 cursor-col-resize touch-none select-none",
                        "bg-transparent hover:bg-border focus-visible:bg-ring focus-visible:outline-none",
                        column.getIsResizing() && "bg-ring",
                      )}
                    />
                    /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      {/* Body text is 14px (text-sm), the size of ResourceCell's title, so the
          hierarchy reads primary → value → secondary: ResourceCell title
          (14px medium, foreground) › other cells (14px regular) › secondary
          lines (ResourceCell subtitle / caption, 12px muted). Headers stay
          13px semibold. */}
      <TableBody className="text-sm">{renderBody()}</TableBody>
    </Table>
  );

  /* ── Mobile cards ── */
  const dataColumns = table
    .getVisibleLeafColumns()
    .filter((column) => column.id !== SELECT_COLUMN_ID);
  const primaryColumnId =
    mobilePrimaryColumn && dataColumns.some((column) => column.id === mobilePrimaryColumn)
      ? mobilePrimaryColumn
      : dataColumns[0]?.id;
  const detailColumnIds = (mobileColumns ?? dataColumns.map((column) => column.id)).filter(
    (id) => id !== primaryColumnId && dataColumns.some((column) => column.id === id),
  );

  const renderCard = (row: Row<TData>, index: number) => {
    const selected = row.getIsSelected();
    const cells = new Map(row.getVisibleCells().map((cell) => [cell.column.id, cell]));
    const primary = primaryColumnId ? cells.get(primaryColumnId) : undefined;
    const details = detailColumnIds
      .map((id) => cells.get(id))
      .filter((cell): cell is NonNullable<typeof cell> => cell !== undefined);
    const labelled = details.filter((cell) => cardColumnLabel(cell.column) !== undefined);
    const unlabelled = details.filter((cell) => cardColumnLabel(cell.column) === undefined);
    return (
      <li
        key={row.id}
        data-slot="data-table-card"
        data-state={selected ? "selected" : undefined}
        className={cn(
          "flex min-w-0 items-start gap-3 rounded-lg border border-border bg-card p-3 text-sm text-foreground",
          "transition-colors motion-reduce:transition-none",
          selected && "border-brand-primary/40 bg-muted/60",
          onRowClick &&
            "cursor-pointer hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
        {...rowClickProps(row)}
      >
        {selectionEnabled && (
          <span className="flex h-5 items-center">{renderSelectCell(row, index)}</span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {primary && (
            <div data-slot="data-table-card-title" className="min-w-0 font-medium">
              {flexRender(primary.column.columnDef.cell, primary.getContext())}
            </div>
          )}
          {labelled.length > 0 && (
            <dl className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1.5">
              {labelled.map((cell) => (
                <React.Fragment key={cell.id}>
                  <dt className="caption text-muted-foreground">{cardColumnLabel(cell.column)}</dt>
                  <dd className="min-w-0 break-words text-end [&_*]:text-end">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </dd>
                </React.Fragment>
              ))}
            </dl>
          )}
          {unlabelled.map((cell) => (
            <div key={cell.id} className="min-w-0">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ))}
        </div>
      </li>
    );
  };

  const renderCards = () => {
    if (loading) {
      return (
        <ul role="list" aria-hidden="true" className="flex flex-col gap-2">
          {Array.from({ length: Math.min(skeletonCount, 5) }, (_, index) => (
            <li
              key={`skeleton-${index}`}
              data-slot="data-table-card-skeleton"
              className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3"
            >
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </li>
          ))}
        </ul>
      );
    }
    if (!rows.length) {
      return (
        <div
          className={cn(
            "rounded-lg border border-border bg-card",
            !emptyState && "p-6 text-center text-sm text-muted-foreground",
          )}
        >
          {emptyState ?? labels.noResults}
        </div>
      );
    }
    return (
      <ul role="list" data-slot="data-table-cards" className="flex flex-col gap-2">
        {rows.map((row, index) => renderCard(row, index))}
      </ul>
    );
  };

  const cardsSelectAll = selectionEnabled && rows.length > 0 && !loading && (
    <label className="flex items-center gap-2 px-3 caption text-muted-foreground">
      {renderSelectHeader()}
      <span aria-hidden="true">{labels.selectAll}</span>
    </label>
  );

  const scrollable = Boolean(
    virtualOptions || maxHeight !== undefined || hasPinning || enableColumnResizing,
  );

  return (
    <div className={cn("flex flex-col gap-4", className)} data-slot="data-table">
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-2" data-slot="data-table-toolbar">
          {searchKey && (
            <Input
              placeholder={searchPlaceholder ?? labels.search}
              aria-label={searchPlaceholder ?? labels.search}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
              className="max-w-sm"
            />
          )}
          {toolbar}
          {enableColumnVisibility && hideableColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="ms-auto">
                  <Columns3 size={14} aria-hidden="true" />
                  {labels.columns}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{labels.columns}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hideableColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                    onSelect={(event) => event.preventDefault()}
                  >
                    {columnLabel(column)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {selectionEnabled && (
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {selectionAnnouncement}
        </span>
      )}

      {showBulkBar && (
        <div
          role="group"
          aria-label={labels.bulkActions}
          data-slot="data-table-bulk-actions"
          className="flex min-h-10 flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5"
        >
          <span className="body-sm font-medium tabular-nums text-foreground">
            {selectionAnnouncement}
          </span>
          {canSelectAllMatching && (
            <Button type="button" variant="link" size="sm" onClick={handleSelectAllMatching}>
              {labels.selectAllMatching(num(selectAllTarget))}
            </Button>
          )}
          <Button type="button" variant="ghost" size="sm" onClick={clearSelection}>
            {labels.clearSelection}
          </Button>
          <div className="ms-auto flex flex-wrap items-center gap-2">
            {typeof bulkActions === "function" ? (
              bulkActions(selectionContext)
            ) : (
              <>
                {(
                  promotedBulkActions ?? (bulkActions && !promotedBulkActions ? bulkActions : [])
                ).map(renderBulkActionButton)}
                {promotedBulkActions && bulkActions && bulkActions.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        <MoreHorizontal size={14} aria-hidden="true" />
                        {labels.moreActions}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {bulkActions.map((action) => (
                        <DropdownMenuItem
                          key={action.label}
                          disabled={action.disabled ?? false}
                          className={cn(action.destructive && "text-destructive")}
                          onSelect={() => action.onAction(selectionContext)}
                        >
                          {action.icon}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {cards ? (
        <div
          className="flex flex-col gap-2"
          data-slot="data-table-mobile"
          aria-busy={loading || undefined}
        >
          {cardsSelectAll}
          {renderCards()}
        </div>
      ) : scrollable ? (
        <div
          ref={scrollRef}
          data-slot="data-table-viewport"
          className="relative min-w-0 overflow-auto"
          style={
            virtualOptions
              ? { height: toCssSize(viewportHeight) }
              : maxHeight !== undefined
                ? { maxHeight: toCssSize(maxHeight) }
                : undefined
          }
        >
          {tableElement}
        </div>
      ) : (
        tableElement
      )}

      {loading && (
        <span className="sr-only" role="status">
          {labels.loading}
        </span>
      )}

      {showPagination && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="caption tabular-nums text-muted-foreground">
            {pluralize(totalForCount, itemLabel, {
              ...locale,
              ...(itemLabelPlural ? { plural: itemLabelPlural } : {}),
            })}
          </p>
          {!virtualOptions && (
            <div className="flex items-center gap-2">
              <span className="caption tabular-nums text-muted-foreground">
                {labels.pageOf(num(pagination.pageIndex + 1), num(pageCountValue))}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage() || loading}
              >
                {labels.previous}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage() || loading}
              >
                {labels.next}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
DataTable.displayName = "DataTable";

export { DataTable, DEFAULT_LABELS as DATA_TABLE_DEFAULT_LABELS };
export type {
  DataTableProps,
  DataTableLabels,
  DataTableBulkAction,
  DataTableSelectionContext,
  DataTableVirtualizeOptions,
};
export { createColumnHelper } from "@tanstack/react-table";
export type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
};
