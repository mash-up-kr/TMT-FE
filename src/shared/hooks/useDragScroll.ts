"use client";

import { type PointerEvent, useCallback, useRef } from "react";

/**
 * 가로 스크롤 영역을 마우스 드래그로 넘길 수 있게 하는 핸들러 묶음.
 * 터치·펜은 브라우저 기본 스크롤이 이미 동작하므로 마우스에만 개입한다.
 * 사용: <ul {...useDragScroll()} className="overflow-x-auto …">
 */
export function useDragScroll<T extends HTMLElement>() {
  const drag = useRef<{ startX: number; startScrollLeft: number } | null>(null);

  const onPointerDown = useCallback((event: PointerEvent<T>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    const element = event.currentTarget;

    if (element.scrollWidth <= element.clientWidth) {
      return;
    }

    drag.current = { startX: event.clientX, startScrollLeft: element.scrollLeft };
    element.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<T>) => {
    if (!drag.current) {
      return;
    }

    event.currentTarget.scrollLeft =
      drag.current.startScrollLeft - (event.clientX - drag.current.startX);
  }, []);

  const endDrag = useCallback((event: PointerEvent<T>) => {
    if (!drag.current) {
      return;
    }

    drag.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };
}
