"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Filter, Search } from "lucide-react";
import { Button } from "./button";
import { EmptyState } from "./empty-state";
import { InputGroup } from "./input-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { StackedList, StackedListItem } from "./stacked-list";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { cn } from "../lib/utils";

interface SearchableTableFilterOption {
  value: string;
  label: string;
}

interface SearchableTableColumn<T = unknown> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  sortAccessor?: (item: T) => string | number | Date | null | undefined;
  className?: string;
}

interface SearchableTableProps<T extends { id: string | number }> {
  data: T[];
  columns: SearchableTableColumn<T>[];
  searchPlaceholder?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters?: Record<
    string,
    {
      value: string;
      onChange: (value: string) => void;
      options: SearchableTableFilterOption[];
      placeholder: string;
    }
  >;
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: {
      label: string;
      href?: string;
      onClick?: () => void;
    };
  };
  actions?: (item: T) => React.ReactNode;
  mobileCard?: (item: T) => React.ReactNode;
  tableClassName?: string;
  pagination?: {
    pageSize?: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  };
}

function appendSearchableValue(value: unknown, parts: string[], depth = 0) {
  if (value == null || depth > 2) return;

  if (value instanceof Date) {
    parts.push(value.toISOString());
    return;
  }

  if (["string", "number", "boolean"].includes(typeof value)) {
    parts.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => appendSearchableValue(entry, parts, depth + 1));
    return;
  }

  if (typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((entry) =>
      appendSearchableValue(entry, parts, depth + 1),
    );
  }
}

function getSearchableText(item: unknown) {
  const parts: string[] = [];
  appendSearchableValue(item, parts);
  return parts.join(" ").toLowerCase();
}

function normalizeEmptyStateIcon(icon: React.ReactNode) {
  return icon ? <span className="flex [&_svg]:size-5">{icon}</span> : undefined;
}

function SearchableTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchTerm,
  onSearchChange,
  filters = {},
  emptyState,
  actions,
  mobileCard,
  tableClassName,
  pagination,
}: SearchableTableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const rows = React.useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredRows = React.useMemo(() => {
    if (!normalizedSearchTerm) return rows;
    return rows.filter((item) => getSearchableText(item).includes(normalizedSearchTerm));
  }, [normalizedSearchTerm, rows]);

  const sortedData = React.useMemo(() => {
    if (!sort) return filteredRows;

    const column = columns.find((candidate) => candidate.key === sort.key);
    if (!column || (!column.sortable && !column.sortAccessor)) return filteredRows;

    const directionMultiplier = sort.direction === "asc" ? 1 : -1;
    const getSortValue = (item: T) =>
      column.sortAccessor?.(item) ?? (item as Record<string, unknown>)[column.key];

    return [...filteredRows].sort((left, right) => {
      const leftValue = getSortValue(left);
      const rightValue = getSortValue(right);

      if (leftValue == null && rightValue == null) return 0;
      if (leftValue == null) return 1;
      if (rightValue == null) return -1;

      const leftComparable = leftValue instanceof Date ? leftValue.getTime() : leftValue;
      const rightComparable = rightValue instanceof Date ? rightValue.getTime() : rightValue;

      if (typeof leftComparable === "number" && typeof rightComparable === "number") {
        return (leftComparable - rightComparable) * directionMultiplier;
      }

      return (
        String(leftComparable).localeCompare(String(rightComparable), undefined, {
          numeric: true,
          sensitivity: "base",
        }) * directionMultiplier
      );
    });
  }, [columns, filteredRows, sort]);

  const pageSize = pagination?.pageSize ?? 10;
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const displayData = pagination ? sortedData.slice(startIndex, startIndex + pageSize) : sortedData;

  const toggleSort = (column: SearchableTableColumn<T>) => {
    if (!column.sortable && !column.sortAccessor) return;

    setSort((current) =>
      current?.key === column.key
        ? { key: column.key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key: column.key, direction: "asc" },
    );
  };

  const renderEmptyState = (className?: string) => (
    <EmptyState
      title={emptyState?.title ?? "No results found"}
      description={emptyState?.description ?? "Try changing the search or filters."}
      {...(className ? { className } : {})}
      {...(emptyState?.icon ? { icon: normalizeEmptyStateIcon(emptyState.icon) } : {})}
      {...(emptyState?.action ? { action: emptyState.action } : {})}
    />
  );

  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;

    const pages: Array<number | "ellipsis-start" | "ellipsis-end"> = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      pages.push(1);
      if (currentPage > 4) pages.push("ellipsis-start");

      for (let page = Math.max(2, currentPage - 1); page <= Math.min(totalPages - 1, currentPage + 1); page++) {
        pages.push(page);
      }

      if (currentPage < totalPages - 3) pages.push("ellipsis-end");
      pages.push(totalPages);
    } else {
      for (let page = 1; page <= totalPages; page++) pages.push(page);
    }

    return (
      <div className="mt-6 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => pagination.onPageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {pages.map((page, index) => (
              <PaginationItem key={`${page}-${index}`}>
                {page === "ellipsis-start" || page === "ellipsis-end" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => pagination.onPageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => pagination.onPageChange(Math.min(totalPages, currentPage + 1))}
                className={
                  currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="md:rounded-lg md:border md:border-border md:bg-muted/30 md:p-3">
        <div className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:items-center md:justify-start md:gap-3">
          <InputGroup
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            leadingIcon={<Search className="size-4" />}
            wrapperClassName="w-full min-w-0 md:min-w-[280px] md:max-w-[520px] md:flex-1 md:basis-[340px]"
            className="h-9 bg-background"
          />
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
            {Object.entries(filters).map(([key, filter]) => (
              <Select key={key} value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger className="h-9 w-full bg-background sm:w-[180px]">
                  <Filter className="mr-2 size-4" />
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        </div>
      </div>

      <StackedList bordered={false} className="rounded-none bg-transparent md:hidden">
        {displayData.length === 0
          ? renderEmptyState("px-0 py-9")
          : displayData.map((item) => {
              if (mobileCard) {
                return (
                  <StackedListItem key={item.id} className="px-0 py-0">
                    {mobileCard(item)}
                  </StackedListItem>
                );
              }

              const primaryColumn = columns.find((column) => column.label.trim()) ?? columns[0];
              const secondaryColumns = columns
                .filter((column) => column.key !== primaryColumn?.key && column.label)
                .slice(0, 5);

              return (
                <StackedListItem key={item.id} className="px-0 py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {primaryColumn && (
                        <div className="min-w-0 text-sm font-semibold text-foreground [&_*]:min-w-0">
                          {primaryColumn.render
                            ? primaryColumn.render(item)
                            : (item as Record<string, React.ReactNode>)[primaryColumn.key]}
                        </div>
                      )}
                    </div>
                    {actions && <div className="shrink-0">{actions(item)}</div>}
                  </div>
                  {secondaryColumns.length > 0 && (
                    <dl className="mt-2 divide-y divide-border/70 border-y border-border/70 text-xs">
                      {secondaryColumns.map((column) => (
                        <div
                          key={column.key}
                          className="grid min-w-0 grid-cols-[6.25rem_minmax(0,1fr)] gap-2 py-1.5"
                        >
                          <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {column.label}
                          </dt>
                          <dd className="min-w-0 break-words text-foreground">
                            {column.render
                              ? column.render(item)
                              : (item as Record<string, React.ReactNode>)[column.key]}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </StackedListItem>
              );
            })}
      </StackedList>

      {displayData.length === 0 ? (
        <div className="hidden min-h-[18rem] items-center justify-center border-t border-border/60 md:flex">
          {renderEmptyState("px-6 py-12")}
        </div>
      ) : (
        <Table containerClassName="hidden overflow-x-auto md:block" className={cn("min-w-full", tableClassName)}>
          <TableHeader>
            <TableRow className="relative border-b-0 bg-muted/80 transition-colors hover:bg-muted/80">
              {columns.map((column) => {
                const isSortable = Boolean(column.sortable || column.sortAccessor);
                const isSorted = sort?.key === column.key;
                const SortIcon = !isSorted ? ChevronsUpDown : sort.direction === "asc" ? ArrowUp : ArrowDown;

                return (
                  <TableHead
                    key={column.key}
                    className={cn(
                      "cursor-default select-none whitespace-nowrap px-4 py-3 text-xs font-medium text-muted-foreground transition-colors",
                      column.className,
                    )}
                    aria-sort={
                      isSortable
                        ? isSorted
                          ? sort.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                        : undefined
                    }
                  >
                    {isSortable ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="-ml-2 h-auto px-2 py-1 text-xs font-medium"
                        onClick={() => toggleSort(column)}
                        aria-label={`Sort by ${column.label}`}
                      >
                        <span>{column.label}</span>
                        <SortIcon className="size-3.5" />
                      </Button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                );
              })}
              {actions && (
                <TableHead className="w-32 cursor-default select-none whitespace-nowrap px-4 py-3 text-xs font-medium text-muted-foreground">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((item, index) => (
              <TableRow key={item.id} className={cn(index === 0 && "border-t-0")}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={cn("py-3", column.className)}>
                    {column.render
                      ? column.render(item)
                      : (item as Record<string, React.ReactNode>)[column.key]}
                  </TableCell>
                ))}
                {actions && <TableCell className="w-32 whitespace-nowrap py-3">{actions(item)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {renderPagination()}
    </div>
  );
}

export { SearchableTable };
export type { SearchableTableColumn, SearchableTableFilterOption, SearchableTableProps };
