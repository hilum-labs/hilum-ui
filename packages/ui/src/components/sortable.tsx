"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "../lib/utils";

/* ─────────────────────── Labels ─────────────────────── */

interface SortableLabels {
  /** Read once by screen readers when a drag handle is focused. */
  instructions: string;
  pickedUp: (item: string, position: number, total: number) => string;
  movedTo: (item: string, position: number, total: number) => string;
  dropped: (item: string, position: number, total: number) => string;
  cancelled: (item: string, position: number) => string;
  /** Accessible name of a drag handle. */
  handle: (item: string) => string;
}

const SORTABLE_DEFAULT_LABELS: SortableLabels = {
  instructions:
    "To pick up an item, press Space or Enter. Use the arrow keys to move it. Press Space or Enter again to drop it, or Escape to cancel.",
  pickedUp: (item, position, total) => `Picked up ${item}. Position ${position} of ${total}.`,
  movedTo: (item, position, total) => `${item} moved to position ${position} of ${total}.`,
  dropped: (item, position, total) => `${item} dropped at position ${position} of ${total}.`,
  cancelled: (item, position) => `Reordering cancelled. ${item} returned to position ${position}.`,
  handle: (item) => `Reorder ${item}`,
};

/* ─────────────────────── Contexts ─────────────────────── */

interface SortableListContextValue {
  orientation: "vertical" | "horizontal";
  labels: SortableLabels;
  labelFor: (id: UniqueIdentifier) => string;
  disabled: boolean;
}

const SortableListContext = React.createContext<SortableListContextValue | null>(null);

interface SortableItemContextValue {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  setActivatorNodeRef: (element: HTMLElement | null) => void;
  isDragging: boolean;
  label: string;
}

const SortableItemContext = React.createContext<SortableItemContextValue | null>(null);

/* ─────────────────────── SortableList ─────────────────────── */

interface SortableListProps<T> {
  items: T[];
  /** Stable id per item. */
  getItemId: (item: T) => string;
  /** Receives the reordered array after a drop. */
  onReorder: (items: T[], move: { id: string; from: number; to: number }) => void;
  /** Human name per item for screen-reader announcements. Default: the id. */
  getItemLabel?: (item: T) => string;
  /** Renders each item — typically a `<SortableItem id=…>`. */
  children: (item: T, index: number) => React.ReactNode;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  labels?: Partial<SortableLabels>;
  /** Accessible name of the list. */
  "aria-label"?: string;
  className?: string;
  ref?: React.Ref<HTMLUListElement>;
}

/**
 * Reorderable list on dnd-kit with pointer, touch and keyboard sensors and
 * localized screen-reader announcements. Render `<SortableItem>` children and
 * (optionally) a `<SortableHandle>` inside each item.
 *
 *   <SortableList items={rows} getItemId={(r) => r.id} onReorder={setRows}>
 *     {(row) => (
 *       <SortableItem id={row.id} handle>
 *         <SortableHandle /> {row.name}
 *       </SortableItem>
 *     )}
 *   </SortableList>
 */
function SortableList<T>({
  items,
  getItemId,
  onReorder,
  getItemLabel,
  children,
  orientation = "vertical",
  disabled = false,
  labels: labelsProp,
  "aria-label": ariaLabel,
  className,
  ref,
}: SortableListProps<T>) {
  const labels = React.useMemo(() => ({ ...SORTABLE_DEFAULT_LABELS, ...labelsProp }), [labelsProp]);
  const ids = React.useMemo(() => items.map(getItemId), [items, getItemId]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const labelFor = React.useCallback(
    (id: UniqueIdentifier) => {
      const item = items[ids.indexOf(String(id))];
      return item !== undefined && getItemLabel ? getItemLabel(item) : String(id);
    },
    [items, ids, getItemLabel],
  );
  const position = (id: UniqueIdentifier) => ids.indexOf(String(id)) + 1;

  // dnd-kit fires onDragOver right after onDragStart with `over` = the item
  // itself, which would immediately replace "Picked up…" in the live region.
  // Only announce when the drop target actually changes.
  const lastOverId = React.useRef<UniqueIdentifier | null>(null);
  const announcements: Announcements = {
    onDragStart: ({ active }) => {
      lastOverId.current = active.id;
      return labels.pickedUp(labelFor(active.id), position(active.id), ids.length);
    },
    onDragOver: ({ active, over }) => {
      if (!over || over.id === lastOverId.current) return undefined;
      lastOverId.current = over.id;
      return labels.movedTo(labelFor(active.id), position(over.id), ids.length);
    },
    onDragEnd: ({ active, over }) =>
      over ? labels.dropped(labelFor(active.id), position(over.id), ids.length) : undefined,
    onDragCancel: ({ active }) => labels.cancelled(labelFor(active.id), position(active.id)),
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    onReorder(arrayMove(items, from, to), { id: String(active.id), from, to });
  };

  const context = React.useMemo(
    () => ({ orientation, labels, labelFor, disabled }),
    [orientation, labels, labelFor, disabled],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={{
        announcements,
        screenReaderInstructions: { draggable: labels.instructions },
      }}
    >
      <SortableContext
        items={ids}
        strategy={
          orientation === "vertical" ? verticalListSortingStrategy : horizontalListSortingStrategy
        }
        disabled={disabled}
      >
        <SortableListContext.Provider value={context}>
          <ul
            ref={ref}
            aria-label={ariaLabel}
            data-slot="sortable-list"
            data-orientation={orientation}
            className={cn(
              "flex gap-2",
              orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
              className,
            )}
          >
            {items.map((item, index) => (
              <React.Fragment key={ids[index]}>{children(item, index)}</React.Fragment>
            ))}
          </ul>
        </SortableListContext.Provider>
      </SortableContext>
    </DndContext>
  );
}
SortableList.displayName = "SortableList";

/* ─────────────────────── SortableItem ─────────────────────── */

interface SortableItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, "id"> {
  id: string;
  /**
   * Drag only from a `<SortableHandle>` inside the item (recommended when the
   * item has other interactive content). Otherwise the whole item is the
   * drag target and is keyboard-focusable.
   */
  handle?: boolean;
  disabled?: boolean;
  ref?: React.Ref<HTMLLIElement>;
}

function SortableItem({
  id,
  handle = false,
  disabled,
  className,
  style,
  children,
  ref,
  ...props
}: SortableItemProps) {
  const list = React.useContext(SortableListContext);
  const sortable = useSortable({ id, disabled: disabled ?? list?.disabled ?? false });
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable;
  const label = list?.labelFor(id) ?? id;

  const mergedRef = (element: HTMLLIElement | null) => {
    setNodeRef(element);
    if (typeof ref === "function") ref(element);
    else if (ref) (ref as React.MutableRefObject<HTMLLIElement | null>).current = element;
  };

  const itemContext = React.useMemo(
    () => ({ attributes, listeners, setActivatorNodeRef, isDragging, label }),
    [attributes, listeners, setActivatorNodeRef, isDragging, label],
  );

  return (
    <SortableItemContext.Provider value={itemContext}>
      <li
        ref={mergedRef}
        data-slot="sortable-item"
        data-dragging={isDragging || undefined}
        style={{
          ...style,
          transform: CSS.Translate.toString(transform),
          transition,
        }}
        className={cn(
          "relative flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2",
          isDragging && "z-10 shadow-elevated",
          !handle &&
            "has-[[data-sortable-activator]:focus-visible]:ring-2 has-[[data-sortable-activator]:focus-visible]:ring-ring",
          className,
        )}
        {...props}
      >
        {handle ? (
          children
        ) : (
          // The activator is an inner element so the <li> keeps its listitem role.
          <div
            ref={setActivatorNodeRef}
            data-sortable-activator=""
            {...attributes}
            {...listeners}
            aria-label={list?.labels.handle(label) ?? `Reorder ${label}`}
            className="flex min-w-0 flex-1 cursor-grab touch-none items-center gap-2 outline-none active:cursor-grabbing"
          >
            {children}
          </div>
        )}
      </li>
    </SortableItemContext.Provider>
  );
}
SortableItem.displayName = "SortableItem";

/* ─────────────────────── SortableHandle ─────────────────────── */

interface SortableHandleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: React.Ref<HTMLButtonElement>;
}

/** Drag handle for a `<SortableItem handle>`. Keyboard: Space/Enter to lift, arrows to move. */
function SortableHandle({ className, children, ref, ...props }: SortableHandleProps) {
  const item = React.useContext(SortableItemContext);
  const list = React.useContext(SortableListContext);
  if (!item) throw new Error("SortableHandle must be used within a SortableItem");

  const mergedRef = (element: HTMLButtonElement | null) => {
    item.setActivatorNodeRef(element);
    if (typeof ref === "function") ref(element);
    else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = element;
  };

  return (
    <button
      ref={mergedRef}
      type="button"
      data-slot="sortable-handle"
      {...item.attributes}
      {...item.listeners}
      aria-label={list?.labels.handle(item.label) ?? `Reorder ${item.label}`}
      className={cn(
        "flex size-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing",
        className,
      )}
      {...props}
    >
      {children ?? <GripVertical size={14} aria-hidden="true" />}
    </button>
  );
}
SortableHandle.displayName = "SortableHandle";

export { SortableList, SortableItem, SortableHandle, SORTABLE_DEFAULT_LABELS, arrayMove };
export type { SortableListProps, SortableItemProps, SortableHandleProps, SortableLabels };
