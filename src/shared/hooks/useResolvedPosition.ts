"use client";

import { type CurrentPosition, useCurrentPosition } from "./useCurrentPosition";

/** 권한 거부·미지원 시 쓰는 기준 좌표 — 강남역 (B 명세 §2-1, E3). */
export const FALLBACK_COORDINATES = { latitude: 37.4979, longitude: 127.0276 };

export interface ResolvedPosition {
  latitude: number;
  longitude: number;
  /** 실제 위치가 아니라 강남역 기준으로 조회하는 중인지. 화면이 안내에 쓴다. */
  isFallback: boolean;
}

/**
 * 좌표를 반드시 하나 내주는 훅.
 *
 * 권한을 거부해도 조회를 멈추지 않고 강남역 좌표로 대체한다 (E3). 권한 응답을 기다리는
 * 동안에는 `null`을 주어 호출을 미룬다 — 곧 실제 좌표가 오는데 fallback으로 한 번 더
 * 조회하면 요청이 두 번 나간다.
 */
export function useResolvedPosition(): ResolvedPosition | null {
  const position: CurrentPosition = useCurrentPosition();

  if (position.status === "pending") {
    return null;
  }

  if (position.status === "granted") {
    return { latitude: position.latitude, longitude: position.longitude, isFallback: false };
  }

  return { ...FALLBACK_COORDINATES, isFallback: true };
}
