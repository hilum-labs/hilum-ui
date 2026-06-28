"use client";

import * as React from "react";
import { Link2, Unlink2 } from "lucide-react";
import { Button, InputNumber, cn } from "@hilum/ui";

type DesignerControlValue = number | null;

interface DesignerValueItem<K extends string> {
  key: K;
  label: React.ReactNode;
  ariaLabel?: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  unit?: string;
  disabled?: boolean;
}

interface DesignerValueControlBaseProps<K extends string> {
  label?: React.ReactNode;
  values: Record<K, DesignerControlValue>;
  items: readonly DesignerValueItem<K>[];
  onChange: (key: K, value: number) => void;
  onChangeAll?: (value: number) => void;
  onCommit?: () => void;
  linked?: boolean;
  onLinkedChange?: (linked: boolean) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  readOnly?: boolean;
  mixedLabel?: string;
  hideSteppers?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  controlsClassName?: string;
  linkButtonClassName?: string;
  linkLabel?: string;
  unlinkLabel?: string;
}

interface TwoValueControlProps<K extends string = string>
  extends DesignerValueControlBaseProps<K> {
  items: readonly [DesignerValueItem<K>, DesignerValueItem<K>];
}

interface FourValueControlProps<K extends string = string>
  extends DesignerValueControlBaseProps<K> {
  items: readonly [
    DesignerValueItem<K>,
    DesignerValueItem<K>,
    DesignerValueItem<K>,
    DesignerValueItem<K>,
  ];
  layout?: "grid" | "single-when-linked";
}

type SpacingSide = "top" | "right" | "bottom" | "left";
type CornerSide = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

type SpacingControlProps = Omit<
  FourValueControlProps<SpacingSide>,
  "items" | "values" | "onChange" | "onChangeAll"
> & {
  values: Record<SpacingSide, DesignerControlValue>;
  onChange: (side: SpacingSide, value: number) => void;
  onChangeAll?: (value: number) => void;
};

type CornerRadiusControlProps = Omit<
  FourValueControlProps<CornerSide>,
  "items" | "values" | "onChange" | "onChangeAll"
> & {
  values: Record<CornerSide, DesignerControlValue>;
  onChange: (side: CornerSide, value: number) => void;
  onChangeAll?: (value: number) => void;
};

function getSharedValue<K extends string>(
  items: readonly DesignerValueItem<K>[],
  values: Record<K, DesignerControlValue>,
) {
  const first = values[items[0].key];
  if (first === null) return null;
  return items.every((item) => values[item.key] === first) ? first : null;
}

function DesignerValueField<K extends string>({
  item,
  value,
  unit,
  min,
  max,
  step,
  precision,
  disabled,
  readOnly,
  mixedLabel,
  hideSteppers,
  inputClassName,
  onChange,
  onCommit,
}: {
  item: DesignerValueItem<K>;
  value: DesignerControlValue;
  unit?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  precision?: number | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  mixedLabel?: string | undefined;
  hideSteppers?: boolean | undefined;
  inputClassName?: string | undefined;
  onChange: (value: number) => void;
  onCommit?: (() => void) | undefined;
}) {
  return (
    <div className="relative min-w-0">
      <span className="caption-xs pointer-events-none absolute left-2 top-1/2 z-10 -translate-y-1/2 select-none font-semibold uppercase text-muted-foreground">
        {item.label}
      </span>
      <InputNumber
        value={value}
        onChange={onChange}
        min={item.min ?? min}
        max={item.max ?? max}
        step={item.step ?? step}
        precision={item.precision ?? precision}
        unit={item.unit ?? unit}
        mixedLabel={mixedLabel}
        commitOnChange
        hideSteppers={hideSteppers}
        disabled={disabled || item.disabled}
        readOnly={readOnly}
        aria-label={item.ariaLabel}
        onBlur={onCommit}
        className={cn("h-9 w-full bg-muted/60", inputClassName)}
        inputMode="decimal"
      />
    </div>
  );
}

function DesignerValueControl<K extends string>({
  label,
  values,
  items,
  onChange,
  onChangeAll,
  onCommit,
  linked,
  onLinkedChange,
  unit,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision = 0,
  disabled = false,
  readOnly = false,
  mixedLabel = "Mixed",
  hideSteppers = true,
  className,
  labelClassName,
  inputClassName,
  controlsClassName,
  linkButtonClassName,
  linkLabel = "Link values",
  unlinkLabel = "Unlink values",
  singleWhenLinked = false,
}: DesignerValueControlBaseProps<K> & { singleWhenLinked?: boolean }) {
  const hasLinkControl = typeof linked === "boolean" && Boolean(onLinkedChange);
  const sharedValue = getSharedValue(items, values);
  const showSingleInput = singleWhenLinked && linked;

  const handleChange = (key: K, value: number) => {
    if (linked) {
      if (onChangeAll) {
        onChangeAll(value);
      } else {
        items.forEach((item) => onChange(item.key, value));
      }
      return;
    }

    onChange(key, value);
  };

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      {(label || hasLinkControl) && (
        <div className="flex min-w-0 items-center justify-between gap-2">
          {label && (
            <div className={cn("caption select-none text-muted-foreground", labelClassName)}>
              {label}
            </div>
          )}
          {hasLinkControl && (
            <Button
              type="button"
              variant={linked ? "secondary" : "ghost"}
              size="icon-xs"
              aria-label={linked ? unlinkLabel : linkLabel}
              title={linked ? unlinkLabel : linkLabel}
              aria-pressed={linked}
              disabled={disabled || readOnly}
              onClick={() => onLinkedChange?.(!linked)}
              className={linkButtonClassName}
            >
              {linked ? <Link2 size={12} /> : <Unlink2 size={12} />}
            </Button>
          )}
        </div>
      )}

      {showSingleInput ? (
        <DesignerValueField
          item={{ ...items[0], label: "All", ariaLabel: "All values" }}
          value={sharedValue}
          unit={unit}
          min={min}
          max={max}
          step={step}
          precision={precision}
          disabled={disabled}
          readOnly={readOnly}
          mixedLabel={mixedLabel}
          hideSteppers={hideSteppers}
          inputClassName={inputClassName}
          onChange={(value) => handleChange(items[0].key, value)}
          onCommit={onCommit}
        />
      ) : (
        <div
          className={cn(
            "grid min-w-0 gap-2",
            items.length === 2 ? "grid-cols-2" : "grid-cols-2",
            controlsClassName,
          )}
        >
          {items.map((item) => (
            <DesignerValueField
              key={item.key}
              item={item}
              value={values[item.key]}
              unit={unit}
              min={min}
              max={max}
              step={step}
              precision={precision}
              disabled={disabled}
              readOnly={readOnly}
              mixedLabel={mixedLabel}
              hideSteppers={hideSteppers}
              inputClassName={inputClassName}
              onChange={(value) => handleChange(item.key, value)}
              onCommit={onCommit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TwoValueControl<K extends string = string>(props: TwoValueControlProps<K>) {
  return <DesignerValueControl {...props} />;
}

function FourValueControl<K extends string = string>({
  layout = "single-when-linked",
  ...props
}: FourValueControlProps<K>) {
  return <DesignerValueControl {...props} singleWhenLinked={layout === "single-when-linked"} />;
}

const spacingItems = [
  { key: "top", label: "T", ariaLabel: "Top" },
  { key: "right", label: "R", ariaLabel: "Right" },
  { key: "bottom", label: "B", ariaLabel: "Bottom" },
  { key: "left", label: "L", ariaLabel: "Left" },
] as const satisfies readonly [
  DesignerValueItem<SpacingSide>,
  DesignerValueItem<SpacingSide>,
  DesignerValueItem<SpacingSide>,
  DesignerValueItem<SpacingSide>,
];

const cornerItems = [
  { key: "topLeft", label: "TL", ariaLabel: "Top left radius" },
  { key: "topRight", label: "TR", ariaLabel: "Top right radius" },
  { key: "bottomLeft", label: "BL", ariaLabel: "Bottom left radius" },
  { key: "bottomRight", label: "BR", ariaLabel: "Bottom right radius" },
] as const satisfies readonly [
  DesignerValueItem<CornerSide>,
  DesignerValueItem<CornerSide>,
  DesignerValueItem<CornerSide>,
  DesignerValueItem<CornerSide>,
];

function SpacingControl(props: SpacingControlProps) {
  return <FourValueControl {...props} items={spacingItems} />;
}

function CornerRadiusControl(props: CornerRadiusControlProps) {
  return <FourValueControl {...props} items={cornerItems} min={props.min ?? 0} />;
}

export {
  CornerRadiusControl,
  FourValueControl,
  SpacingControl,
  TwoValueControl,
};
export type {
  CornerRadiusControlProps,
  CornerSide,
  DesignerControlValue,
  DesignerValueItem,
  FourValueControlProps,
  SpacingControlProps,
  SpacingSide,
  TwoValueControlProps,
};
