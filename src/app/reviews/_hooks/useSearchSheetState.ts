"use client";

import { useEffect, useRef, useState } from "react";

/** 한글 조합 중간 상태가 100ms 안팎으로 지나가므로 그보다 넉넉히 잡는다. */
const DEFAULT_DEBOUNCE_MS = 300;

/**
 * 검색 시트마다 호출 억제 강도가 다르다. 내부 DB를 보는 매장 검색은 기본값으로 충분하지만,
 * 외부 주소 API는 승인키를 서비스 전체가 공유해 더 세게 눌러야 한다.
 */
export type SearchSheetOptions = Readonly<{
  debounceMs?: number;
  /** 이 길이 미만이면 요청 자체를 보내지 않는다. */
  minQueryLength?: number;
}>;

export type SearchSheetState = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  query: string;
  enabled: boolean;
}>;

export function useSearchSheetState({
  debounceMs = DEFAULT_DEBOUNCE_MS,
  minQueryLength = 1,
}: SearchSheetOptions = {}): SearchSheetState {
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
    if (nextQuery.length < minQueryLength) {
      setQuery("");
      return;
    }

    timerRef.current = setTimeout(() => {
      setQuery(nextQuery);
      timerRef.current = null;
    }, debounceMs);
  };

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      clearTimer();
      setValueState("");
      setQuery("");
    }
  };

  return { open, onOpenChange, value, setValue, query, enabled: query.length >= minQueryLength };
}
