"use client";

import { useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

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
  debounceMs,
  minQueryLength = 1,
}: SearchSheetOptions = {}): SearchSheetState {
  const [open, setOpen] = useState(false);
  const [value, setValueState] = useState("");
  const debouncedValue = useDebouncedValue(value, debounceMs);
  const valueWithoutSpace = value.trim();
  const query = debouncedValue.trim();
  const enabled = valueWithoutSpace.length >= minQueryLength && query.length >= minQueryLength;

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setValueState("");
    }
  };

  return {
    open,
    onOpenChange,
    value,
    setValue: setValueState,
    query: enabled ? query : "",
    enabled,
  };
}
