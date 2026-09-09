"use client";

import { type PointerEvent, type TouchEvent, useRef, useState } from "react";

/** 이 거리를 넘겨 당긴 채 놓으면 새로고침한다. 인디케이터 높이이기도 하다. */
export const PULL_THRESHOLD_PX = 64;
/** 손가락 이동에 대한 본문 이동 비율. 끝까지 따라오지 않아야 당김이 무겁게 느껴진다. */
const PULL_RESISTANCE = 0.5;
/** 아무리 당겨도 이 이상은 내려가지 않는다. */
const PULL_MAX_PX = 96;

export type PullToRefreshStatus = "idle" | "pulling" | "ready" | "refreshing";

type UsePullToRefreshOptions = {
  onRefresh: () => Promise<unknown>;
  disabled?: boolean;
};

/**
 * 세로 스크롤 영역을 맨 위에서 아래로 당겨 새로고침하는 핸들러 묶음.
 *
 * 터치는 touch 이벤트로 받는다 — 스크롤을 시도하는 동안에도 끊기지 않아야 당기는
 * 거리를 끝까지 따라갈 수 있다. 마우스는 pointer 이벤트로 받아 데스크탑 프레임에서도
 * 같은 흐름을 재현한다.
 * 사용: <div {...handlers} style={{ translate: `0 ${pullDistance}px` }} className="overflow-y-auto …">
 */
export function usePullToRefresh<T extends HTMLElement>({
  onRefresh,
  disabled = false,
}: UsePullToRefreshOptions) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const latestDistance = useRef(0);

  function begin(clientY: number, element: T) {
    if (disabled || isRefreshing || element.scrollTop > 0) {
      return;
    }

    startY.current = clientY;
  }

  function move(clientY: number, element: T) {
    if (startY.current === null) {
      return;
    }

    const delta = clientY - startY.current;

    // 위로 밀거나 그새 스크롤이 내려갔으면 당김을 접고 브라우저 스크롤에 맡긴다.
    if (delta <= 0 || element.scrollTop > 0) {
      startY.current = null;
      latestDistance.current = 0;
      setPullDistance(0);
      return;
    }

    const distance = Math.min(delta * PULL_RESISTANCE, PULL_MAX_PX);

    latestDistance.current = distance;
    setPullDistance(distance);
  }

  function end() {
    if (startY.current === null) {
      return;
    }

    startY.current = null;

    if (latestDistance.current < PULL_THRESHOLD_PX) {
      latestDistance.current = 0;
      setPullDistance(0);
      return;
    }

    // 새로고침 동안은 인디케이터 높이만큼 내려둔 채 기다린다.
    latestDistance.current = PULL_THRESHOLD_PX;
    setPullDistance(PULL_THRESHOLD_PX);
    setIsRefreshing(true);

    void onRefresh()
      .catch(() => undefined)
      .finally(() => {
        latestDistance.current = 0;
        setIsRefreshing(false);
        setPullDistance(0);
      });
  }

  function onTouchStart(event: TouchEvent<T>) {
    const touch = event.touches[0];

    if (touch !== undefined) {
      begin(touch.clientY, event.currentTarget);
    }
  }

  function onTouchMove(event: TouchEvent<T>) {
    const touch = event.touches[0];

    if (touch !== undefined) {
      move(touch.clientY, event.currentTarget);
    }
  }

  function onPointerDown(event: PointerEvent<T>) {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    // 여기서 캡처하면 안 된다. 캡처 중엔 click이 pointerdown·pointerup 타깃의 공통 조상인
    // 이 컨테이너로 가서, 안쪽 버튼·링크가 마우스 클릭을 받지 못한다.
    begin(event.clientY, event.currentTarget);
  }

  function onPointerMove(event: PointerEvent<T>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    move(event.clientY, event.currentTarget);

    // 당김이 실제로 시작된 뒤에만 캡처한다. 요소 밖에서 놓아도 끝맺기 위해서다.
    if (
      startY.current !== null &&
      latestDistance.current > 0 &&
      !event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function onPointerEnd(event: PointerEvent<T>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    end();
  }

  const status: PullToRefreshStatus = isRefreshing
    ? "refreshing"
    : pullDistance >= PULL_THRESHOLD_PX
      ? "ready"
      : pullDistance > 0
        ? "pulling"
        : "idle";

  return {
    status,
    pullDistance,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd: end,
      onTouchCancel: end,
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
    },
  };
}
