"use client";

import { useEffect, useState } from "react";

const DEFAULT_DELAY_MS = 300;

/** 값 변경을 지연해 반영한다. 검색어처럼 입력은 즉시 보여 주되, 후속 작업은 늦춰야 할 때 쓴다. */
export function useDebouncedValue<T>(value: T, delayMs = DEFAULT_DELAY_MS): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, value]);

  return debouncedValue;
}
