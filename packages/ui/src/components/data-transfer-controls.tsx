"use client";

import * as React from "react";
import { Download, Loader2, MoreHorizontal, Upload } from "lucide-react";
import { Button } from "./button";
import { ButtonGroup, ButtonGroupItem } from "./button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { cn } from "../lib/utils";

interface DataTransferScopeOption {
  value: string;
  label: string;
}

interface DataTransferAction {
  label: string;
  shortLabel?: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

interface DataTransferControlsProps {
  scopeValue?: string;
  onScopeChange?: (value: string) => void;
  scopeOptions?: DataTransferScopeOption[];
  scopePlaceholder?: string;
  actions: DataTransferAction[];
  compact?: boolean;
  compactLabel?: string;
  className?: string;
  selectClassName?: string;
  actionGroupClassName?: string;
}

function normalizeIcon(icon: React.ReactNode, fallback: React.ReactNode, loading?: boolean) {
  if (loading) return <Loader2 className="size-4 animate-spin" aria-hidden="true" />;
  return icon ?? fallback;
}

function DataTransferControls({
  scopeValue,
  onScopeChange,
  scopeOptions = [],
  scopePlaceholder = "Scope",
  actions,
  compact = false,
  compactLabel = "Import and export actions",
  className,
  selectClassName,
  actionGroupClassName,
}: DataTransferControlsProps) {
  const hasScope = scopeOptions.length > 0 && scopeValue !== undefined && onScopeChange;

  const renderScopeSelect = () => {
    if (!hasScope) return null;

    return (
      <Select value={scopeValue} onValueChange={onScopeChange}>
        <SelectTrigger
          aria-label={scopePlaceholder}
          className={cn("min-h-10 w-full max-w-full bg-background sm:w-[180px]", selectClassName)}
        >
          <SelectValue placeholder={scopePlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {scopeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const defaultActionIcon = (index: number) =>
    index === 0 ? (
      <Upload className="size-4" aria-hidden="true" />
    ) : (
      <Download className="size-4" aria-hidden="true" />
    );

  return (
    <div
      className={cn(
        compact
          ? "grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2"
          : "grid w-full min-w-0 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center",
        className,
      )}
    >
      {renderScopeSelect()}

      {compact ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-9"
              aria-label={compactLabel}
            >
              <MoreHorizontal className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {actions.map((action, index) => {
              const disabled = Boolean(action.disabled || action.loading);

              return (
                <DropdownMenuItem
                  key={`${action.label}-${index}`}
                  disabled={disabled}
                  onClick={action.onSelect}
                >
                  {normalizeIcon(action.icon, defaultActionIcon(index), action.loading)}
                  {action.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <ButtonGroup className={cn("grid w-full grid-cols-3 sm:inline-flex sm:w-auto", actionGroupClassName)}>
          {actions.map((action, index) => (
            <ButtonGroupItem
              key={`${action.label}-${index}`}
              className="min-h-10 justify-center px-3 disabled:pointer-events-none disabled:opacity-50"
              onClick={action.onSelect}
              disabled={action.disabled || action.loading}
              aria-label={action.ariaLabel ?? action.label}
            >
              {normalizeIcon(action.icon, defaultActionIcon(index), action.loading)}
              {action.shortLabel ?? action.label}
            </ButtonGroupItem>
          ))}
        </ButtonGroup>
      )}
    </div>
  );
}

DataTransferControls.displayName = "DataTransferControls";

export { DataTransferControls };
export type { DataTransferAction, DataTransferControlsProps, DataTransferScopeOption };
