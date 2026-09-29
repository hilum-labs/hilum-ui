import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  Button,
  DensityProvider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
  type Density,
} from "@hilum/ui";

/** A font family the picker can offer (e.g. from Google Fonts or the theme). */
interface FontPickerFont {
  /** CSS family name, e.g. "Inter" or "Playfair Display". */
  family: string;
  /** Generic category, used for the fallback stack: "sans-serif", "serif", "display", "handwriting", "monospace". */
  category: string;
  /** Available weights (shown as a style count). */
  weights?: number[];
}

/** Localizable strings. Every entry has an English default. */
interface FontPickerLabels {
  /** Trigger text when no family is selected. */
  placeholder: string;
  /** Search field placeholder and accessible name. */
  search: string;
  /** Shown when the search matches nothing. */
  empty: string;
  /** Accessible name of the list of fonts. */
  list: string;
  /** Style-count hint for a font with `weights`. */
  styles: (count: number) => string;
}

const FONT_PICKER_DEFAULT_LABELS: FontPickerLabels = {
  placeholder: "Choose a font",
  search: "Search fonts",
  empty: "No fonts found",
  list: "Fonts",
  styles: (count) => `${count} ${count === 1 ? "style" : "styles"}`,
};

interface FontPickerProps {
  /**
   * Families to offer, in display order. Search matches family names; a
   * query naming a category exactly ("serif") adds that category's fonts
   * after the name matches.
   */
  fonts: FontPickerFont[];
  /** Selected family (controlled). */
  value: string | null | undefined;
  onChange: (family: string, font: FontPickerFont) => void;
  /**
   * Called once per font when its option is about to be shown, so the app can
   * load that face lazily (e.g. inject a Google Fonts stylesheet). Previews
   * switch to the face as soon as it loads and use the category's generic
   * family until then.
   */
  onLoadFont?: (font: FontPickerFont) => void;
  /** Control density. Default: `compact` (editor chrome). */
  density?: Density;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** Localizable strings; unspecified keys fall back to English. */
  labels?: Partial<FontPickerLabels>;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

const GENERIC_FALLBACK: Record<string, string> = {
  "sans-serif": "sans-serif",
  sans: "sans-serif",
  serif: "serif",
  display: "sans-serif",
  handwriting: "cursive",
  script: "cursive",
  monospace: "monospace",
  mono: "monospace",
};

/** Lower-cased, with spaces, hyphens and underscores removed: "Sans Serif" → "sansserif". */
const normalizeCategory = (text: string) => text.toLowerCase().replace(/[\s_-]+/g, "");

/**
 * Search: the query matches family names (substring, case-insensitive), in
 * the order of `fonts`. Category text isn't searched ("play" doesn't find
 * every "display" font); a query that names a category exactly ("serif",
 * "Display", "sans serif") adds that category's other fonts after the name
 * matches.
 */
function searchFonts(fonts: FontPickerFont[], query: string): FontPickerFont[] {
  const q = query.trim().toLowerCase();
  if (!q) return fonts;
  const byName = fonts.filter((font) => font.family.toLowerCase().includes(q));
  const category = normalizeCategory(q);
  const byCategory = fonts.filter(
    (font) => normalizeCategory(font.category) === category && !byName.includes(font),
  );
  return byCategory.length > 0 ? [...byName, ...byCategory] : byName;
}

/** A safe `font-family` value: the quoted family, then the category's generic family. */
function fontStack(font: Pick<FontPickerFont, "family" | "category">) {
  const family = font.family.replace(/["\\]/g, "\\$&");
  return `"${family}", ${GENERIC_FALLBACK[font.category.toLowerCase()] ?? "sans-serif"}`;
}

function FontPickerOption({
  font,
  id,
  selected,
  active,
  labels,
  onSelect,
  onHover,
  onVisible,
}: {
  font: FontPickerFont;
  id: string;
  selected: boolean;
  active: boolean;
  labels: FontPickerLabels;
  onSelect: () => void;
  onHover: () => void;
  onVisible: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const onVisibleRef = React.useRef(onVisible);
  React.useEffect(() => {
    onVisibleRef.current = onVisible;
  });

  // Ask the app to load the face when the option scrolls into view.
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      onVisibleRef.current();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        onVisibleRef.current();
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    // Focus stays in the search field; the active option is conveyed with
    // aria-activedescendant, so options are not focusable themselves.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- aria-activedescendant pattern: Arrow/Enter handled by the search input
    <div
      ref={ref}
      id={id}
      role="option"
      aria-selected={selected}
      data-active={active || undefined}
      data-slot="font-picker-option"
      onMouseDown={(event) => event.preventDefault()}
      onMouseMove={onHover}
      onClick={onSelect}
      className={cn(
        "flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-foreground",
        "compact:min-h-7 compact:rounded-[4px] compact:px-1.5",
        active && "bg-active",
      )}
    >
      <span
        className="min-w-0 flex-1 truncate text-[14px] leading-snug compact:text-[13px]"
        style={{ fontFamily: fontStack(font) }}
      >
        {font.family}
      </span>
      {font.weights && font.weights.length > 0 && (
        <span className="shrink-0 caption-sm text-muted-foreground">
          {labels.styles(font.weights.length)}
        </span>
      )}
      <Check
        aria-hidden="true"
        className={cn("size-3.5 shrink-0", selected ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}

/**
 * Font-family picker for editor panels: a field-style trigger showing the
 * selected family in its own face, and a searchable list previewing each
 * family (loaded on demand via `onLoadFont`, with a generic fallback).
 */
function FontPicker({
  fonts,
  value,
  onChange,
  onLoadFont,
  density = "compact",
  disabled,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  labels: labelsProp,
  className,
  ref,
}: FontPickerProps) {
  const labels = { ...FONT_PICKER_DEFAULT_LABELS, ...labelsProp };
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const listboxId = React.useId();
  const listRef = React.useRef<HTMLDivElement>(null);
  const requested = React.useRef(new Set<string>());

  const selected = fonts.find((font) => font.family === value);
  const filtered = searchFonts(fonts, query);
  const safeActive = filtered.length === 0 ? -1 : Math.min(activeIndex, filtered.length - 1);
  const optionId = (index: number) => `${listboxId}-option-${index}`;

  const requestFont = React.useCallback(
    (font: FontPickerFont) => {
      if (!onLoadFont || requested.current.has(font.family)) return;
      requested.current.add(font.family);
      onLoadFont(font);
    },
    [onLoadFont],
  );

  // The selected face is needed for the trigger itself.
  React.useEffect(() => {
    if (selected) requestFont(selected);
  }, [selected, requestFont]);

  React.useEffect(() => {
    if (safeActive < 0) return;
    document.getElementById(optionId(safeActive))?.scrollIntoView?.({ block: "nearest" });
    // optionId is derived from the stable listboxId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeActive]);

  const openPicker = (next: boolean) => {
    setOpen(next);
    if (next) {
      setQuery("");
      const selectedIndex = selected ? fonts.indexOf(selected) : 0;
      setActiveIndex(Math.max(0, selectedIndex));
    }
  };

  const choose = (font: FontPickerFont) => {
    onChange(font.family, font);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (filtered.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((safeActive + 1) % filtered.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((safeActive - 1 + filtered.length) % filtered.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(filtered.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const font = filtered[safeActive];
      if (font) choose(font);
    }
  };

  return (
    <DensityProvider density={density}>
      <Popover open={open} onOpenChange={openPicker}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            id={id}
            type="button"
            variant="field"
            disabled={disabled}
            aria-haspopup="listbox"
            {...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {})}
            {...(ariaLabelledBy !== undefined ? { "aria-labelledby": ariaLabelledBy } : {})}
            data-slot="font-picker-trigger"
            className={cn("w-full min-w-0", className)}
          >
            <span
              className={cn("min-w-0 flex-1 truncate", !selected && "text-muted-foreground")}
              style={selected ? { fontFamily: fontStack(selected) } : undefined}
            >
              {selected?.family ?? value ?? labels.placeholder}
            </span>
            <ChevronDown aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          data-slot="font-picker-content"
          className="w-64 p-0 compact:w-60"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            (event.currentTarget as HTMLElement | null)
              ?.querySelector<HTMLInputElement>("input")
              ?.focus();
          }}
        >
          <div className="flex items-center gap-2 border-b border-border px-2.5">
            <Search aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              role="combobox"
              aria-label={labels.search}
              aria-expanded={true}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={safeActive >= 0 ? optionId(safeActive) : undefined}
              autoComplete="off"
              spellCheck={false}
              placeholder={labels.search}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onKeyDown}
              className="h-9 min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground compact:h-8 compact:text-[12px]"
            />
          </div>
          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={labels.list}
            className="max-h-72 overflow-y-auto overscroll-contain p-1"
          >
            {filtered.length === 0 ? (
              <p
                role="presentation"
                className="px-2 py-3 text-center caption text-muted-foreground"
              >
                {labels.empty}
              </p>
            ) : (
              filtered.map((font, index) => (
                <FontPickerOption
                  key={font.family}
                  font={font}
                  id={optionId(index)}
                  selected={font.family === value}
                  active={index === safeActive}
                  labels={labels}
                  onSelect={() => choose(font)}
                  onHover={() => {
                    if (index !== safeActive) setActiveIndex(index);
                  }}
                  onVisible={() => requestFont(font)}
                />
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </DensityProvider>
  );
}

FontPicker.displayName = "FontPicker";

export { FontPicker, FONT_PICKER_DEFAULT_LABELS, fontStack };
export type { FontPickerFont, FontPickerLabels, FontPickerProps };
