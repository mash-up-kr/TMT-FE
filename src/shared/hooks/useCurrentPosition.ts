"use client";

import { type QueryClient, useQuery } from "@tanstack/react-query";

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

/**
 * 좌표를 이 시간 동안 같은 값으로 본다.
 *
 * 좌표는 조회 queryKey의 일부라, 자주 다시 재면 키가 흔들려 조회 캐시가 따라서 깨진다.
 * 최신성은 조회 쪽이 매번 서버를 재검증해 책임지므로, 좌표는 안정적인 편이 낫다.
 */
const POSITION_STALE_TIME_MS = 5 * 60_000;

/** 재진입이 즉시 끝나려면 좌표가 낡은 뒤에도 캐시에 남아 있어야 한다. */
const POSITION_GC_TIME_MS = 30 * 60_000;

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
 * 현재 좌표. 캐시에 최근 좌표가 있으면 다시 재지 않고 그대로 쓴다.
 *
 * 위치를 컴포넌트 state에 두면 화면을 옮길 때마다 pending부터 시작해, 조회 결과가 캐시에
 * 있어도 측위가 끝날 때까지 로딩을 보게 된다. 캐시를 공유하면 재진입이 즉시 끝나고,
 * 여러 화면이 동시에 물어도 측위는 한 번만 일어난다.
 */
/** 사용자가 직접 새로고침할 때만 쓴다. staleTime을 무시하고 지금 다시 잰다. */
export function invalidateCurrentPosition(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: POSITION_QUERY_KEY });
}

export function useCurrentPosition({
  enabled = true,
}: UseCurrentPositionOptions = {}): CurrentPosition {
  const { data } = useQuery({
    queryKey: POSITION_QUERY_KEY,
    queryFn: requestPosition,
    enabled,
    staleTime: POSITION_STALE_TIME_MS,
    gcTime: POSITION_GC_TIME_MS,
    retry: false,
  });

  return data ?? { status: "pending" };
}
