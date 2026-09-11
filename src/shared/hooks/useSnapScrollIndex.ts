"use client";

import { type UIEvent, useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * 한 장씩 넘기는 가로 스냅 스크롤에서 지금 보이는 장의 번호를 추적한다.
 * 사용: <section ref={ref} onScroll={onScroll} className="snap-x snap-mandatory overflow-x-auto …">
 */
export function useSnapScrollIndex<T extends HTMLElement>(count: number, initialIndex = 0) {
  const ref = useRef<T>(null);
  const [index, setIndex] = useState(initialIndex);

  // 첫 페인트 전에 옮겨야 0번 장이 잠깐 보였다가 넘어가지 않는다.
  useLayoutEffect(() => {
    const element = ref.current;

    if (element && initialIndex > 0) {
      element.scrollLeft = initialIndex * element.clientWidth;
    }
  }, [initialIndex]);

  const onScroll = useCallback(
    (event: UIEvent<T>) => {
      const { scrollLeft, clientWidth } = event.currentTarget;

      if (clientWidth > 0) {
        setIndex(Math.max(0, Math.min(count - 1, Math.round(scrollLeft / clientWidth))));
      }
    },
    [count],
  );

  return { index, ref, onScroll };
}
