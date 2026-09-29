"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../lib/utils";
import {
  controlInvalidWithinClasses,
  controlSurfaceClasses,
  controlTextClass,
  inputFocusWithinClasses,
  motionClasses,
} from "../lib/interaction";
import { useShape } from "../lib/shape-context";
import { isAriaInvalid, useFieldControl } from "../lib/field-context";
import { useControllableState } from "../lib/use-controllable-state";

/* ─────────────────────── Tag ─────────────────────── */

interface TagProps extends Omit<React.ComponentProps<"span">, "children"> {
  children: React.ReactNode;
  /** Show a remove (×) button that calls this. */
  onRemove?: () => void;
  /** Accessible name of the remove button. Default: "Remove {children}" for text children. */
  removeLabel?: string;
  /** Dims the tag and hides the remove button. */
  disabled?: boolean;
}

/**
 * A compact, optionally removable chip (Polaris Tag): the selected values of
 * TagInput and MultiCombobox, or filter tokens. Long text truncates.
 */
function Tag({ children, onRemove, removeLabel, disabled, className, ref, ...props }: TagProps) {
  const label =
    removeLabel ??
    (typeof children === "string" || typeof children === "number"
      ? `Remove ${children}`
      : "Remove");
  const removable = Boolean(onRemove) && !disabled;
  return (
    <span
      ref={ref}
      data-slot="tag"
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "inline-flex h-6 min-w-0 max-w-full items-center gap-0.5 rounded-md bg-muted ps-2 text-sm leading-5 text-foreground",
        removable ? "pe-0.5" : "pe-2",
        disabled && "opacity-60",
        "compact:h-5 compact:ps-1.5 compact:text-[12px]",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 truncate">{children}</span>
      {removable && (
        <button
          type="button"
          aria-label={label}
          onClick={onRemove}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground",
            "transition-colors duration-150 motion-reduce:transition-none",
            "hover:bg-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "compact:size-4",
          )}
        >
          <X size={12} aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
Tag.displayName = "Tag";

/* ─────────────────────── TagInput ─────────────────────── */

/** Localizable strings. Every entry has an English default. */
interface TagInputLabels {
  /** Accessible name of a tag's remove button. */
  remove: (tag: string) => string;
  /** Announced after tags are added. */
  added: (tags: string[]) => string;
  /** Announced after a tag is removed. */
  removed: (tag: string) => string;
  /** Announced when `maxTags` stops an addition. */
  limitReached: (max: number) => string;
  /** Accessible name of the suggestion list. */
  suggestions: string;
}

const TAG_INPUT_DEFAULT_LABELS: TagInputLabels = {
  remove: (tag) => `Remove ${tag}`,
  added: (tags) => (tags.length === 1 ? `${tags[0]} added` : `${tags.length} tags added`),
  removed: (tag) => `${tag} removed`,
  limitReached: (max) => `You can add up to ${max} tags`,
  suggestions: "Suggestions",
};

/** ARIA attributes the tag input manages itself and therefore doesn't accept. */
type ManagedAria =
  | "aria-expanded"
  | "aria-controls"
  | "aria-activedescendant"
  | "aria-autocomplete"
  | "aria-haspopup";

interface TagInputProps extends Omit<React.AriaAttributes, ManagedAria> {
  /** Controlled tags. */
  value?: string[];
  /** Initial tags (uncontrolled). */
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  /** id of the text input. Inside a `<Field>` it is wired automatically. */
  id?: string;
  /** Form field name: every tag posts as a hidden input with this name. */
  name?: string;
  /** Most tags allowed; further additions are ignored and announced. */
  maxTags?: number;
  /** Longest tag, in characters. Longer text is cut to this length. */
  maxLength?: number;
  /** Characters that end a tag while typing or pasting (Enter always does). Default `[","]`. */
  separators?: string[];
  /** Treat "Sale" and "sale" as different tags. Default false (duplicates are dropped case-insensitively). */
  caseSensitive?: boolean;
  /** Transform each tag before it's added (after trimming), e.g. lower-casing. */
  normalize?: (tag: string) => string;
  /** Existing tags to suggest while typing; picked with the arrow keys and Enter, or a click. */
  suggestions?: string[];
  /** Called with the text being typed (e.g. to fetch suggestions). */
  onInputChange?: (text: string) => void;
  /** Add the typed text as a tag when the field loses focus. Default true. */
  addOnBlur?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Classes for the field wrapper. */
  className?: string;
  /** Override the English UI strings (i18n). */
  labels?: Partial<TagInputLabels>;
  ref?: React.Ref<HTMLInputElement> | undefined;
}

function splitOn(text: string, separators: string[]): string[] {
  let normalized = text.replace(/\r\n|\r|\n|\t/g, "\n");
  for (const separator of separators) normalized = normalized.split(separator).join("\n");
  return normalized.split("\n");
}

/**
 * Free-text tags (Polaris-style): type and press Enter or a separator (comma)
 * to add, Backspace on an empty field removes the last tag, pasted text is
 * split on separators and new lines, duplicates are dropped, and an optional
 * suggestion list offers existing tags. Works inside `<Field>`.
 */
function TagInput({
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled: disabledProp,
  id,
  name,
  maxTags,
  maxLength,
  separators = [","],
  caseSensitive = false,
  normalize,
  suggestions,
  onInputChange,
  addOnBlur = true,
  onBlur,
  onFocus,
  className,
  labels: labelsProp,
  ref,
  ...ariaProps
}: TagInputProps) {
  const shape = useShape();
  const labels = { ...TAG_INPUT_DEFAULT_LABELS, ...labelsProp };
  const fieldProps = useFieldControl({
    id,
    disabled: disabledProp,
    "aria-describedby": ariaProps["aria-describedby"],
    "aria-invalid": ariaProps["aria-invalid"],
    "aria-required": ariaProps["aria-required"],
  });
  const disabled = fieldProps.disabled ?? false;
  const [tags, setTags] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange,
  });
  const [draft, setDraftState] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [announcement, setAnnouncement] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);
  const listboxId = React.useId();

  const keyOf = (tag: string) => (caseSensitive ? tag : tag.toLocaleLowerCase());
  const clean = (raw: string) => {
    let tag = raw.trim();
    if (normalize) tag = normalize(tag).trim();
    if (maxLength !== undefined) tag = tag.slice(0, maxLength).trim();
    return tag;
  };

  const setDraft = (text: string) => {
    setDraftState(text);
    onInputChange?.(text);
  };

  const addTags = (raws: string[]) => {
    if (disabled) return;
    const seen = new Set(tags.map(keyOf));
    const next = [...tags];
    const added: string[] = [];
    let limited = false;
    for (const raw of raws) {
      const tag = clean(raw);
      if (!tag || seen.has(keyOf(tag))) continue;
      if (maxTags !== undefined && next.length >= maxTags) {
        limited = true;
        break;
      }
      seen.add(keyOf(tag));
      next.push(tag);
      added.push(tag);
    }
    if (added.length > 0) setTags(next);
    const messages = [
      ...(added.length > 0 ? [labels.added(added)] : []),
      ...(limited && maxTags !== undefined ? [labels.limitReached(maxTags)] : []),
    ];
    if (messages.length > 0) setAnnouncement(messages.join(". "));
  };

  const removeAt = (index: number) => {
    const tag = tags[index];
    if (tag === undefined || disabled) return;
    setTags(tags.filter((_, i) => i !== index));
    setAnnouncement(labels.removed(tag));
  };

  const selected = new Set(tags.map(keyOf));
  const query = keyOf(draft.trim());
  const filtered = (suggestions ?? []).filter(
    (suggestion) => !selected.has(keyOf(suggestion)) && keyOf(suggestion).includes(query),
  );
  const hasSuggestions = suggestions !== undefined;
  const showList = hasSuggestions && open && !disabled && filtered.length > 0;

  React.useEffect(() => {
    setActiveIndex(-1);
  }, [query, open]);

  React.useEffect(() => {
    if (!showList || activeIndex < 0) return;
    document
      .getElementById(`${listboxId}-option-${activeIndex}`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [showList, activeIndex, listboxId]);

  const commitDraft = () => {
    if (draft.trim()) addTags([draft]);
    setDraft("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && hasSuggestions) {
      event.preventDefault();
      if (!open) setOpen(true);
      else setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp" && hasSuggestions && open) {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      const suggestion = showList && activeIndex >= 0 ? filtered[activeIndex] : undefined;
      if (suggestion !== undefined) {
        event.preventDefault();
        addTags([suggestion]);
        setDraft("");
      } else if (draft.trim()) {
        event.preventDefault();
        commitDraft();
      }
    } else if (event.key === "Escape" && showList) {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      event.preventDefault();
      removeAt(tags.length - 1);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    if (separators.some((separator) => text.includes(separator))) {
      const parts = splitOn(text, separators);
      const rest = parts.pop() ?? "";
      addTags(parts);
      setDraft(rest);
    } else {
      setDraft(text);
    }
    if (hasSuggestions) setOpen(true);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text");
    if (!/[\r\n\t]/.test(pasted) && !separators.some((separator) => pasted.includes(separator))) {
      return;
    }
    event.preventDefault();
    const input = event.currentTarget;
    const start = input.selectionStart ?? draft.length;
    const end = input.selectionEnd ?? draft.length;
    addTags(splitOn(draft.slice(0, start) + pasted + draft.slice(end), separators));
    setDraft("");
  };

  const invalid = isAriaInvalid(fieldProps["aria-invalid"]);

  return (
    <div data-slot="tag-input" className="relative w-full min-w-0">
      {/* Clicking the field's padding focuses the text input. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- pointer convenience; the input inside is the keyboard target */}
      <div
        data-invalid={invalid ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        onClick={(event) => {
          if (event.target === event.currentTarget) inputRef.current?.focus();
        }}
        className={cn(
          "flex min-h-9 w-full cursor-text flex-wrap items-center gap-1 px-1.5 py-[5px]",
          shape.input,
          controlSurfaceClasses,
          motionClasses,
          inputFocusWithinClasses,
          controlInvalidWithinClasses,
          disabled && "cursor-not-allowed bg-muted opacity-50",
          "compact:min-h-6 compact:gap-0.5 compact:px-1 compact:py-0.5 compact:rounded-[5px]",
          className,
        )}
      >
        {tags.map((tag, index) => (
          <Tag
            key={`${keyOf(tag)}-${index}`}
            disabled={disabled}
            onRemove={() => {
              removeAt(index);
              inputRef.current?.focus();
            }}
            removeLabel={labels.remove(tag)}
          >
            {tag}
          </Tag>
        ))}
        <input
          {...ariaProps}
          {...fieldProps}
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={draft}
          placeholder={tags.length === 0 ? placeholder : undefined}
          {...(maxLength !== undefined ? { maxLength } : {})}
          {...(hasSuggestions
            ? {
                role: "combobox",
                "aria-expanded": showList,
                "aria-controls": showList ? listboxId : undefined,
                "aria-autocomplete": "list" as const,
                "aria-activedescendant":
                  showList && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined,
              }
            : {})}
          onChange={handleChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onFocus={(event) => {
            if (hasSuggestions) setOpen(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setOpen(false);
            if (addOnBlur) commitDraft();
            onBlur?.(event);
          }}
          className={cn(
            "h-6 min-w-24 flex-1 bg-transparent px-1.5 text-foreground outline-none placeholder:text-muted-foreground",
            controlTextClass,
            "disabled:cursor-not-allowed",
            "compact:h-5 compact:px-1 compact:text-[12px]",
          )}
        />
      </div>
      {name !== undefined &&
        tags.map((tag, index) => (
          <input key={`${keyOf(tag)}-${index}`} type="hidden" name={name} value={tag} />
        ))}
      {showList && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={labels.suggestions}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-card py-1 shadow-elevated"
        >
          {filtered.map((suggestion, index) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- aria-activedescendant listbox: the input handles the keyboard
            <li
              key={suggestion}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => {
                addTags([suggestion]);
                setDraft("");
              }}
              className={cn(
                "flex min-h-9 cursor-pointer select-none items-center px-3 py-1.5 body text-foreground transition-colors motion-reduce:transition-none",
                index === activeIndex ? "bg-muted" : "hover:bg-muted",
              )}
            >
              <span className="truncate">{suggestion}</span>
            </li>
          ))}
        </ul>
      )}
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
TagInput.displayName = "TagInput";

export { Tag, TagInput, TAG_INPUT_DEFAULT_LABELS };
export type { TagProps, TagInputProps, TagInputLabels };
