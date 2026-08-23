"use client";

import { useEffect, useRef, useState } from "react";

/** 한글 조합 중간 상태가 100ms 안팎으로 지나가므로 그보다 넉넉히 잡는다. */
const SEARCH_DEBOUNCE_MS = 300;

export type SearchSheetState = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  query: string;
  enabled: boolean;
}>;

export function useSearchSheetState(): SearchSheetState {
  const [open, setOpen] = useState(false);
  const [value, setValueState] = useState("");
  const [query, setQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const setValue = (nextValue: string) => {
    setValueState(nextValue);
    clearTimer();

    const nextQuery = nextValue.trim();
    if (nextQuery.length === 0) {
      setQuery("");
      return;
    }

    timerRef.current = setTimeout(() => {
      setQuery(nextQuery);
      timerRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
  };

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      clearTimer();
      setValueState("");
      setQuery("");
    }
  };

  return { open, onOpenChange, value, setValue, query, enabled: query.length > 0 };
}
