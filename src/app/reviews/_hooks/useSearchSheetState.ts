"use client";

import { useEffect, useRef, useState } from "react";

/** 한글 조합 중간 상태가 100ms 안팎으로 지나가므로 그보다 넉넉히 잡는다. */
const SEARCH_DEBOUNCE_MS = 300;

export type SearchSheetState = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 입력 원문. 화면에 그대로 보여주는 값이라 `SearchField`와 같은 이름을 쓴다. */
  value: string;
  setValue: (value: string) => void;
  /** 공백을 다듬은 검색어. 타이핑이 멎은 뒤에 따라온다. 요청과 상태 판정은 이 값을 쓴다. */
  query: string;
  /** 시트가 열려 있고 검색어가 있을 때만 요청한다. */
  enabled: boolean;
}>;

/**
 * 검색 시트 한 벌의 상태.
 *
 * 요청 자체는 여기서 하지 않는다. `useSearchPlaces`와 `useSearchAddresses`는 params 타입이
 * 달라(`userId` 유무) 하나로 감싸면 제네릭만 복잡해지고 얻는 게 없다. 상태만 공통으로 두고
 * 어떤 endpoint를 부를지는 페이지가 정한다.
 *
 * 입력은 즉시 반영하고 검색어만 늦춘다. 요청 키가 되는 값을 여기서 늦춰야 호출부가
 * 디바운스를 알 필요가 없다.
 */
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
