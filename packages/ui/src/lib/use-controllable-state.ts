import * as React from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

type SetStateAction<T> = T | ((previous: T) => T);

/**
 * Controlled/uncontrolled state in one hook. When `value` is defined the
 * component is controlled and `setValue` only calls `onChange`; otherwise the
 * hook keeps internal state seeded from `defaultValue`.
 *
 * `setValue` accepts an updater function (TanStack Table's `Updater<T>` shape)
 * which is resolved against the current value before `onChange` is called, so
 * consumers always receive a plain value.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T | undefined;
  defaultValue: T;
  onChange?: ((value: T) => void) | undefined;
}): [T, (next: SetStateAction<T>) => void] {
  const [internal, setInternal] = React.useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : internal;

  const currentRef = React.useRef(current);
  const onChangeRef = React.useRef(onChange);
  useIsomorphicLayoutEffect(() => {
    currentRef.current = current;
    onChangeRef.current = onChange;
  });

  const setValue = React.useCallback(
    (next: SetStateAction<T>) => {
      const resolved =
        typeof next === "function" ? (next as (previous: T) => T)(currentRef.current) : next;
      if (Object.is(resolved, currentRef.current)) return;
      currentRef.current = resolved;
      if (!controlled) setInternal(resolved);
      onChangeRef.current?.(resolved);
    },
    [controlled],
  );

  return [current, setValue];
}
