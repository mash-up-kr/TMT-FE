"use client";

import { useEffect, useRef } from "react";

type FeedScrollOptions = {
  query: string | null;
  curationTagId: string | null;
  enabled: boolean;
};

type FeedScrollPosition = Pick<FeedScrollOptions, "query" | "curationTagId"> & {
  top: number;
};

// 상세 화면 왕복에 필요한 마지막 검색 위치 하나만 브라우저 메모리에 보관한다.
let lastPosition: FeedScrollPosition | null = null;

export function useFeedScroll({ query, curationTagId, enabled }: FeedScrollOptions) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (!enabled || !body) return;

    const saved = lastPosition;
    const top =
      saved && saved.query === query && saved.curationTagId === curationTagId ? saved.top : 0;
    const rememberPosition = () => {
      lastPosition = { query, curationTagId, top: body.scrollTop };
    };
    const finishRestoring = () => {
      observer.disconnect();
      rememberPosition();
      body.addEventListener("scroll", rememberPosition, { passive: true });
    };
    const restorePosition = () => {
      body.scrollTo({ top });
      if (body.scrollTop === top) finishRestoring();
    };

    // 로딩 UI가 결과로 교체되어 충분한 높이가 생긴 뒤 위치를 복원한다.
    const observer = new ResizeObserver(restorePosition);
    if (body.firstElementChild) observer.observe(body.firstElementChild);
    restorePosition();
    // 복원 중 사용자가 직접 조작하면 그 위치를 우선한다.
    body.addEventListener("wheel", finishRestoring, { passive: true });
    body.addEventListener("pointerdown", finishRestoring);
    body.addEventListener("keydown", finishRestoring);
    return () => {
      observer.disconnect();
      body.removeEventListener("scroll", rememberPosition);
      body.removeEventListener("wheel", finishRestoring);
      body.removeEventListener("pointerdown", finishRestoring);
      body.removeEventListener("keydown", finishRestoring);
    };
  }, [query, curationTagId, enabled]);

  return bodyRef;
}
