"use client";

import { type MouseEvent, type PointerEvent, useCallback, useRef } from "react";

/** 이 거리를 넘겨 움직이면 클릭이 아니라 드래그로 본다. */
const DRAG_THRESHOLD_PX = 5;

/**
 * 가로 스크롤 영역을 마우스 드래그로 넘길 수 있게 하는 핸들러 묶음.
 * 터치·펜은 브라우저 기본 스크롤이 이미 동작하므로 마우스에만 개입한다.
 * 사용: <ul {...useDragScroll()} className="overflow-x-auto …">
 */
export function useDragScroll<T extends HTMLElement>() {
  const drag = useRef<{ startX: number; startScrollLeft: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const onPointerDown = useCallback((event: PointerEvent<T>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    const element = event.currentTarget;

    if (element.scrollWidth <= element.clientWidth) {
      return;
    }

    drag.current = { startX: event.clientX, startScrollLeft: element.scrollLeft, moved: false };
    element.setPointerCapture(event.pointerId);
    // 이미지 고스트 드래그와 텍스트 선택이 스크롤을 가로채지 않게 한다.
    event.preventDefault();
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<T>) => {
    if (!drag.current) {
      return;
    }

    const distance = event.clientX - drag.current.startX;

    if (Math.abs(distance) > DRAG_THRESHOLD_PX) {
      drag.current.moved = true;
    }

    event.currentTarget.scrollLeft = drag.current.startScrollLeft - distance;
  }, []);

  const endDrag = useCallback((event: PointerEvent<T>) => {
    if (!drag.current) {
      return;
    }

    suppressClick.current = drag.current.moved;
    drag.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  // 드래그로 스크롤한 직후의 click은 자식(링크·버튼)에 닿기 전에 삼킨다.
  const onClickCapture = useCallback((event: MouseEvent<T>) => {
    if (!suppressClick.current) {
      return;
    }

    suppressClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onClickCapture,
  };
}
