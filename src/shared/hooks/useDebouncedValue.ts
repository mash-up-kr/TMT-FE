"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_DELAY_MS = 300;

/** 값 변경을 지연해 반영한다. 검색어처럼 입력은 즉시 보여 주되, 후속 작업은 늦춰야 할 때 쓴다. */
export function useDebouncedValue<T>(value: T, delayMs = DEFAULT_DELAY_MS) {
  const [debouncedValue, setDebouncedValue] = useState(() => value);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    timer.current = setTimeout(() => {
      timer.current = undefined;
      setDebouncedValue(() => value);
    }, delayMs);

    return () => clearTimeout(timer.current);
  }, [delayMs, value]);

  /** 예약된 반영을 취소하고 지정한 값으로 즉시 초기화한다. 입력값 변경은 호출부가 맡는다. */
  const reset = useCallback((nextValue: T) => {
    clearTimeout(timer.current);
    timer.current = undefined;
    setDebouncedValue(() => nextValue);
  }, []);

  return { debouncedValue, reset };
}
