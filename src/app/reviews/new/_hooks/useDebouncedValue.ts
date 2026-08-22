"use client";

import { useEffect, useState } from "react";

/**
 * 값이 잠잠해진 뒤에야 따라오는 사본.
 *
 * 첫 렌더는 지연 없이 원래 값을 그대로 돌려준다. 이후 값이 바뀔 때마다 타이머를 다시 걸어,
 * `delayMs` 동안 변화가 없을 때만 반영한다.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
