"use client";

import { useSearchParams } from "next/navigation";
import { type CompositionEvent, useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

const SEARCH_DELAY_MS = 200;

type SearchQueryOptions = {
  /** 입력을 비울 때 검색어와 함께 제거할 URL 파라미터. */
  clearOnEmpty?: readonly string[];
};

/** 입력은 즉시, 검색은 200ms 뒤에 반영한다. URL 기록만 한글 조합 완료를 기다린다. */
export function useSearchQuery({ clearOnEmpty }: SearchQueryOptions = {}) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const { debouncedValue: query, reset: resetQuery } = useDebouncedValue(value, SEARCH_DELAY_MS);
  const [isComposing, setIsComposing] = useState(false);
  const lastWrittenQuery = useRef(urlQuery);

  useEffect(() => {
    const currentUrlQuery = new URL(window.location.href).searchParams.get("q") ?? "";
    // Next.js가 이전 주소를 뒤늦게 반영하는 동안에는 현재 입력을 유지한다.
    if (urlQuery !== currentUrlQuery) return;

    // 직접 기록한 주소의 반영은 무시하고, 뒤로가기·외부 탐색만 복원한다.
    if (urlQuery !== lastWrittenQuery.current) {
      lastWrittenQuery.current = urlQuery;
      setValue(urlQuery);
      resetQuery(urlQuery);
      setIsComposing(false);
      return;
    }

    if (isComposing || value !== query || value === urlQuery) return;

    lastWrittenQuery.current = value;
    replaceQuery(value);
  }, [isComposing, query, resetQuery, urlQuery, value]);

  function changeSearch(nextValue: string) {
    setValue(nextValue);
    if (nextValue !== "") return;

    // 이전 검색값도 비워야 지운 직후 입력해도 예전 검색이 되살아나지 않는다.
    resetQuery("");
    setIsComposing(false);
    lastWrittenQuery.current = "";
    replaceQuery("", clearOnEmpty);
  }

  function startComposition() {
    setIsComposing(true);
  }

  function endComposition(event: CompositionEvent<HTMLInputElement>) {
    setIsComposing(false);
    changeSearch(event.currentTarget.value);
  }

  return {
    value,
    query: query.trim() || null,
    changeSearch,
    startComposition,
    endComposition,
  };
}

function replaceQuery(query: string, paramsToClear: readonly string[] = []) {
  const url = new URL(window.location.href);
  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  for (const param of paramsToClear) url.searchParams.delete(param);
  window.history.replaceState(null, "", url);
}
