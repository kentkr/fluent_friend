import { Editor } from "@tiptap/react";
import { useRef, useCallback } from "react";

export function useDebouncedOnUpdate(
  callback: (params: { editor: Editor; transaction: any }) => void,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(({ editor, transaction }: { editor: Editor; transaction: any }) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback({ editor, transaction });
    }, delay);
  }, [callback, delay]);
}

export function debounceLag<F extends (...args: any[]) => any>(
  fn: F,
  ms: number = 500
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (...args: Parameters<F>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn.apply(null, args)
      timeoutId = null;
    }, ms)
  }
}

