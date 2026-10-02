"use client";

import * as React from "react";
import { Check, ChevronRight, Minus } from "lucide-react";
import { cn } from "../lib/utils";
import { useControllableState } from "../lib/use-controllable-state";
import { Spinner } from "./spinner";

/* ─────────────────────── Types ─────────────────────── */

interface TreeNode {
  id: string;
  label: React.ReactNode;
  /** Plain text for typeahead and checkbox names when `label` isn't a string. */
  textValue?: string;
  /** Leading icon. */
  icon?: React.ReactNode;
  /** Known children. Omit and set `hasChildren` to load them with `loadChildren`. */
  children?: TreeNode[];
  /** Marks a node as expandable before its children are loaded. */
  hasChildren?: boolean;
  disabled?: boolean;
}

type TreeSelectionMode = "none" | "single" | "multiple";

interface TreeViewLabels {
  loading: string;
  loadError: string;
}

const TREE_VIEW_DEFAULT_LABELS: TreeViewLabels = {
  loading: "Loading…",
  loadError: "Couldn't load items",
};

interface TreeViewProps {
  items: TreeNode[];
  /** Default "single". `multiple` sets `aria-multiselectable`. */
  selectionMode?: TreeSelectionMode;
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /**
   * Render checkboxes (implies multiple selection). Checking a parent checks
   * its loaded descendants; parents show a mixed state when partially checked.
   */
  checkboxes?: boolean;
  /** Lazy children for nodes with `hasChildren`. Called once per node. */
  loadChildren?: (node: TreeNode) => Promise<TreeNode[]>;
  /** Enter on an item, or double-click. */
  onAction?: (node: TreeNode) => void;
  /** Indent per level in px. Default 16. */
  indent?: number;
  labels?: Partial<TreeViewLabels>;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
  ref?: React.Ref<HTMLUListElement>;
}

interface FlatNode {
  node: TreeNode;
  level: number;
  parentId: string | null;
  posInSet: number;
  setSize: number;
}

const TYPEAHEAD_TIMEOUT = 500;

function nodeText(node: TreeNode) {
  return node.textValue ?? (typeof node.label === "string" ? node.label : node.id);
}

/* ─────────────────────── TreeView ─────────────────────── */

/**
 * Accessible tree (WAI-ARIA tree pattern): arrow-key navigation, Home/End,
 * typeahead, `*` to expand siblings, single/multi selection, optional
 * tri-state checkboxes and lazily loaded children.
 */
function TreeView({
  items,
  selectionMode: selectionModeProp = "single",
  selected: selectedProp,
  defaultSelected,
  onSelectedChange,
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  checkboxes = false,
  loadChildren,
  onAction,
  indent = 16,
  labels: labelsProp,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
  ref,
}: TreeViewProps) {
  const labels = { ...TREE_VIEW_DEFAULT_LABELS, ...labelsProp };
  const selectionMode: TreeSelectionMode = checkboxes ? "multiple" : selectionModeProp;
  const [selected, setSelected] = useControllableState<string[]>({
    value: selectedProp,
    defaultValue: defaultSelected ?? [],
    onChange: onSelectedChange,
  });
  const [expanded, setExpanded] = useControllableState<string[]>({
    value: expandedProp,
    defaultValue: defaultExpanded ?? [],
    onChange: onExpandedChange,
  });
  const [loaded, setLoaded] = React.useState<Record<string, TreeNode[]>>({});
  const [loading, setLoading] = React.useState<Record<string, boolean>>({});
  const [failed, setFailed] = React.useState<Record<string, boolean>>({});
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const anchorRef = React.useRef<string | null>(null);
  const typeahead = React.useRef({ buffer: "", timer: 0 as ReturnType<typeof setTimeout> | 0 });
  const itemRefs = React.useRef(new Map<string, HTMLLIElement>());

  const expandedSet = React.useMemo(() => new Set(expanded), [expanded]);
  const selectedSet = React.useMemo(() => new Set(selected), [selected]);

  const childrenOf = React.useCallback(
    (node: TreeNode): TreeNode[] | undefined => node.children ?? loaded[node.id],
    [loaded],
  );
  const isExpandable = React.useCallback(
    (node: TreeNode) =>
      Boolean(node.children?.length || node.hasChildren || loaded[node.id]?.length),
    [loaded],
  );

  // Index of every known node, for `*` (expand siblings).
  const nodeById = React.useMemo(() => {
    const byId = new Map<string, TreeNode>();
    const walk = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        byId.set(node.id, node);
        const kids = childrenOf(node);
        if (kids) walk(kids);
      }
    };
    walk(items);
    return byId;
  }, [items, childrenOf]);

  const visible = React.useMemo(() => {
    const out: FlatNode[] = [];
    const walk = (nodes: TreeNode[], level: number, parentId: string | null) => {
      nodes.forEach((node, index) => {
        out.push({ node, level, parentId, posInSet: index + 1, setSize: nodes.length });
        const kids = childrenOf(node);
        if (expandedSet.has(node.id) && kids) walk(kids, level + 1, node.id);
      });
    };
    walk(items, 1, null);
    return out;
  }, [items, childrenOf, expandedSet]);

  const tabStopId =
    focusedId && visible.some((entry) => entry.node.id === focusedId)
      ? focusedId
      : (visible.find((entry) => selectedSet.has(entry.node.id))?.node.id ??
        visible.find((entry) => !entry.node.disabled)?.node.id ??
        null);

  const focusItem = (id: string) => {
    setFocusedId(id);
    itemRefs.current.get(id)?.focus();
  };

  /* ── Expansion ── */
  const load = async (node: TreeNode) => {
    if (!loadChildren || node.children || loaded[node.id] || loading[node.id]) return;
    setLoading((prev) => ({ ...prev, [node.id]: true }));
    setFailed((prev) => ({ ...prev, [node.id]: false }));
    try {
      const kids = await loadChildren(node);
      setLoaded((prev) => ({ ...prev, [node.id]: kids }));
    } catch {
      setFailed((prev) => ({ ...prev, [node.id]: true }));
    } finally {
      setLoading((prev) => ({ ...prev, [node.id]: false }));
    }
  };

  const setNodeExpanded = (node: TreeNode, open: boolean) => {
    if (!isExpandable(node)) return;
    if (open) void load(node);
    setExpanded((prev) => {
      const has = prev.includes(node.id);
      if (open && !has) return [...prev, node.id];
      if (!open && has) return prev.filter((id) => id !== node.id);
      return prev;
    });
  };

  /* ── Selection ── */
  const descendantIds = (node: TreeNode): string[] => {
    const kids = childrenOf(node) ?? [];
    return kids.flatMap((kid) => (kid.disabled ? [] : [kid.id, ...descendantIds(kid)]));
  };

  const normalizeCascade = (ids: Set<string>) => {
    // Bottom-up: a parent is checked iff all its (known) children are.
    const visit = (node: TreeNode): boolean => {
      const kids = childrenOf(node);
      if (!kids || kids.length === 0) return ids.has(node.id);
      const states = kids.filter((kid) => !kid.disabled).map(visit);
      const all = states.length > 0 && states.every(Boolean);
      if (all) ids.add(node.id);
      else ids.delete(node.id);
      return all;
    };
    items.forEach(visit);
    return ids;
  };

  const checkState = (node: TreeNode): boolean | "mixed" => {
    if (!checkboxes) return selectedSet.has(node.id);
    const kids = childrenOf(node)?.filter((kid) => !kid.disabled);
    if (!kids || kids.length === 0) return selectedSet.has(node.id);
    const states = kids.map(checkState);
    if (states.every((state) => state === true)) return true;
    if (states.some((state) => state === true || state === "mixed")) return "mixed";
    return false;
  };

  const toggleSelect = (node: TreeNode) => {
    if (node.disabled || selectionMode === "none") return;
    anchorRef.current = node.id;
    if (selectionMode === "single") {
      setSelected([node.id]);
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      const turnOn = checkboxes ? checkState(node) !== true : !next.has(node.id);
      const affected = checkboxes ? [node.id, ...descendantIds(node)] : [node.id];
      for (const id of affected) {
        if (turnOn) next.add(id);
        else next.delete(id);
      }
      return Array.from(checkboxes ? normalizeCascade(next) : next);
    });
  };

  const selectRange = (toId: string) => {
    if (selectionMode !== "multiple") return;
    const anchor = anchorRef.current ?? toId;
    const a = visible.findIndex((entry) => entry.node.id === anchor);
    const b = visible.findIndex((entry) => entry.node.id === toId);
    if (a < 0 || b < 0) return;
    const [from, to] = a < b ? [a, b] : [b, a];
    const range = visible
      .slice(from, to + 1)
      .filter((entry) => !entry.node.disabled)
      .map((entry) => entry.node.id);
    setSelected((prev) => {
      const next = new Set([...prev, ...range]);
      return Array.from(checkboxes ? normalizeCascade(next) : next);
    });
  };

  /* ── Keyboard ── */
  const onKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const index = visible.findIndex((entry) => entry.node.id === tabStopId);
    const current = visible[index];
    if (!current) return;
    const node = current.node;
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const openKey = rtl ? "ArrowLeft" : "ArrowRight";
    const closeKey = rtl ? "ArrowRight" : "ArrowLeft";

    const move = (to: number) => {
      const target = visible[Math.max(0, Math.min(visible.length - 1, to))];
      if (!target) return;
      focusItem(target.node.id);
      if (event.shiftKey) selectRange(target.node.id);
    };

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move(index + 1);
        return;
      case "ArrowUp":
        event.preventDefault();
        move(index - 1);
        return;
      case "Home":
        event.preventDefault();
        move(0);
        return;
      case "End":
        event.preventDefault();
        move(visible.length - 1);
        return;
      case openKey: {
        event.preventDefault();
        if (!isExpandable(node)) return;
        if (!expandedSet.has(node.id)) setNodeExpanded(node, true);
        else {
          const first = childrenOf(node)?.[0];
          if (first) focusItem(first.id);
        }
        return;
      }
      case closeKey: {
        event.preventDefault();
        if (isExpandable(node) && expandedSet.has(node.id)) setNodeExpanded(node, false);
        else if (current.parentId) focusItem(current.parentId);
        return;
      }
      case "Enter":
        event.preventDefault();
        if (selectionMode === "single") toggleSelect(node);
        onAction?.(node);
        return;
      case " ":
        event.preventDefault();
        toggleSelect(node);
        return;
      case "*": {
        event.preventDefault();
        const parent = current.parentId ? nodeById.get(current.parentId) : null;
        const siblings = parent ? (childrenOf(parent) ?? []) : items;
        const toOpen = siblings.filter((sibling) => isExpandable(sibling));
        toOpen.forEach((sibling) => void load(sibling));
        setExpanded((prev) => Array.from(new Set([...prev, ...toOpen.map((s) => s.id)])));
        return;
      }
      default:
        break;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
      if (selectionMode !== "multiple") return;
      event.preventDefault();
      const all = new Set(visible.filter((e) => !e.node.disabled).map((e) => e.node.id));
      setSelected(Array.from(checkboxes ? normalizeCascade(all) : all));
      return;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const state = typeahead.current;
      if (state.timer) clearTimeout(state.timer);
      state.buffer += event.key.toLowerCase();
      state.timer = setTimeout(() => {
        state.buffer = "";
      }, TYPEAHEAD_TIMEOUT);
      const ordered = [...visible.slice(index + 1), ...visible.slice(0, index + 1)];
      // A repeated single character cycles through matches starting after the current one.
      const search =
        state.buffer.length > 1 && state.buffer.split("").every((c) => c === state.buffer[0])
          ? state.buffer[0]!
          : state.buffer;
      const match = ordered.find((entry) => nodeText(entry.node).toLowerCase().startsWith(search));
      if (match) focusItem(match.node.id);
    }
  };

  React.useEffect(() => {
    const state = typeahead.current;
    return () => {
      if (state.timer) clearTimeout(state.timer);
    };
  }, []);

  /* ── Render ── */
  const renderNodes = (nodes: TreeNode[], level: number): React.ReactNode =>
    nodes.map((node, index) => {
      const kids = childrenOf(node);
      const expandable = isExpandable(node);
      const isExpanded = expandable && expandedSet.has(node.id);
      const isLoading = Boolean(loading[node.id]);
      const state = checkState(node);
      const selectable = selectionMode !== "none";
      return (
        <li
          key={node.id}
          ref={(element) => {
            if (element) itemRefs.current.set(node.id, element);
            else itemRefs.current.delete(node.id);
          }}
          // aria-selected / aria-checked are spread below; selection-less trees must not expose them.
          // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
          role="treeitem"
          data-slot="tree-item"
          aria-level={level}
          aria-setsize={nodes.length}
          aria-posinset={index + 1}
          {...(expandable ? { "aria-expanded": isExpanded } : {})}
          {...(selectable
            ? checkboxes
              ? { "aria-checked": state === "mixed" ? ("mixed" as const) : state === true }
              : { "aria-selected": state === true }
            : {})}
          {...(node.disabled ? { "aria-disabled": true } : {})}
          {...(isLoading ? { "aria-busy": true } : {})}
          tabIndex={node.id === tabStopId ? 0 : -1}
          onFocus={(event) => {
            if (event.target === event.currentTarget) setFocusedId(node.id);
          }}
          className="outline-none [&:focus-visible>div]:ring-2 [&:focus-visible>div]:ring-ring"
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- keyboard handled on the tree */}
          <div
            className={cn(
              "body-sm flex min-h-8 cursor-default items-center gap-1.5 rounded-md pe-2 text-foreground transition-colors",
              "hover:bg-muted",
              state === true && !checkboxes && selectable && "bg-muted font-medium",
              node.disabled && "cursor-not-allowed opacity-50",
            )}
            style={{ paddingInlineStart: (level - 1) * indent + 4 }}
            onClick={(event) => {
              event.stopPropagation();
              focusItem(node.id);
              if (event.shiftKey && selectionMode === "multiple") selectRange(node.id);
              else toggleSelect(node);
            }}
            onDoubleClick={() => onAction?.(node)}
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground",
                expandable && "hover:bg-background hover:text-foreground",
              )}
              onClick={(event) => {
                if (!expandable) return;
                event.stopPropagation();
                focusItem(node.id);
                setNodeExpanded(node, !isExpanded);
              }}
            >
              {expandable &&
                (isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <ChevronRight
                    size={14}
                    className={cn(
                      "transition-transform duration-150 rtl:rotate-180",
                      isExpanded && "rotate-90 rtl:rotate-90",
                    )}
                  />
                ))}
            </span>
            {checkboxes && (
              <span
                aria-hidden="true"
                data-state={state === "mixed" ? "indeterminate" : state ? "checked" : "unchecked"}
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded border border-border bg-card text-primary-foreground",
                  state !== false && "border-brand-primary bg-brand-primary",
                )}
              >
                {state === "mixed" ? (
                  <Minus size={11} strokeWidth={3} />
                ) : state ? (
                  <Check size={11} strokeWidth={3} />
                ) : null}
              </span>
            )}
            {node.icon && (
              <span
                aria-hidden="true"
                className="flex shrink-0 text-muted-foreground [&_svg]:size-4"
              >
                {node.icon}
              </span>
            )}
            <span className="min-w-0 truncate">{node.label}</span>
          </div>
          {isExpanded && (
            <ul role="group" className="flex flex-col gap-px">
              {kids && kids.length > 0 ? (
                renderNodes(kids, level + 1)
              ) : isLoading || failed[node.id] ? (
                <li
                  role="none"
                  className={cn(
                    "caption py-1.5",
                    failed[node.id] ? "text-destructive-text" : "text-muted-foreground",
                  )}
                  style={{ paddingInlineStart: level * indent + 28 }}
                >
                  {failed[node.id] ? labels.loadError : labels.loading}
                </li>
              ) : null}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul
      ref={ref}
      role="tree"
      data-slot="tree-view"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      {...(selectionMode === "multiple" ? { "aria-multiselectable": true } : {})}
      onKeyDown={onKeyDown}
      className={cn("flex flex-col gap-px", className)}
    >
      {renderNodes(items, 1)}
    </ul>
  );
}
TreeView.displayName = "TreeView";

export { TreeView, TREE_VIEW_DEFAULT_LABELS };
export type { TreeViewProps, TreeNode, TreeSelectionMode, TreeViewLabels };
