"use client";

import { useState } from "react";

export type SearchSheetState = Readonly<{
  open: boolean;
  setOpen: (open: boolean) => void;
  /** 입력 원문. 화면에 그대로 보여주는 값이라 `SearchField`와 같은 이름을 쓴다. */
  value: string;
  setValue: (value: string) => void;
  /** 공백을 다듬은 검색어. 요청과 상태 판정은 이 값을 쓴다. */
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
 */
export function useSearchSheetState(): SearchSheetState {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const query = value.trim();

  return { open, setOpen, value, setValue, query, enabled: open && query.length > 0 };
}
