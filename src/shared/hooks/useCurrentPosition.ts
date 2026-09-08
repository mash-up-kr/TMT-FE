"use client";

import { useQuery } from "@tanstack/react-query";

export type CurrentPosition =
  | { status: "pending" }
  | { status: "granted"; latitude: number; longitude: number }
  | { status: "unavailable" };

type UseCurrentPositionOptions = {
  enabled?: boolean;
};

/**
 * 좌표를 약 110m 격자로 묶는다.
 *
 * 좌표는 queryKey에 그대로 들어가는데, GPS는 가만히 있어도 소수점 아랫자리가 흔들린다.
 * 묶지 않으면 마운트마다 새 키가 만들어져 조회 결과의 staleTime이 한 번도 발동하지 못한다.
 */
const COORDINATE_FRACTION_DIGITS = 3;

const POSITION_QUERY_KEY = ["geolocation"] as const;

function snapToGrid(value: number) {
  return Number(value.toFixed(COORDINATE_FRACTION_DIGITS));
}

/** 권한 거부·미지원도 실패가 아니라 하나의 결과다. reject하지 않아야 재시도·에러 분기가 필요 없다. */
function requestPosition(): Promise<CurrentPosition> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve({ status: "unavailable" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({
          status: "granted",
          latitude: snapToGrid(coords.latitude),
          longitude: snapToGrid(coords.longitude),
        }),
      () => resolve({ status: "unavailable" }),
    );
  });
}

/**
 * 현재 좌표. 캐시에 지난 좌표가 있으면 그것으로 즉시 시작하고 뒤에서 다시 잰다.
 *
 * 위치를 컴포넌트 state에 두면 화면을 옮길 때마다 pending부터 시작해, 조회 결과가 캐시에
 * 있어도 측위가 끝날 때까지 로딩을 보게 된다. 캐시를 공유하면 재진입이 즉시 끝나고,
 * 여러 화면이 동시에 물어도 측위는 한 번만 일어난다.
 *
 * `staleTime: 0`이라 진입할 때마다 갱신은 그대로 일어난다 — 기다리지 않을 뿐이다.
 */
export function useCurrentPosition({
  enabled = true,
}: UseCurrentPositionOptions = {}): CurrentPosition {
  const { data } = useQuery({
    queryKey: POSITION_QUERY_KEY,
    queryFn: requestPosition,
    enabled,
    staleTime: 0,
    retry: false,
  });

  return data ?? { status: "pending" };
}
