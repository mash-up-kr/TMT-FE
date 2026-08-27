"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "@/shared/ui/Toast";
import type { FoodCategory, RecommendStore } from "../_model/recommend";

/** 한 번에 담을 수 있는 매장 수. */
export const MAX_PICKED = 5;

/** 추천을 받으려면 최소 이만큼 담아야 한다. 시안 토스트가 이 값을 말한다. */
export const MIN_PICKED = 2;

/** 지금 냄비로 떨어지고 있는 공. 연타하면 여러 개가 동시에 떨어진다. */
export type FallingBall = { id: number; category: FoodCategory };

/**
 * 냄비에 담긴 매장과, 담는 순간 떨어지는 공을 함께 소유한다.
 *
 * 담긴 매장을 다시 탭하면 취소한다. 취소는 되돌리는 동작이라 공을 떨어뜨리지 않는다.
 *
 * 판단은 setState 업데이터 밖에서 한다. 업데이터는 순수해야 하고, 안에서 토스트를 띄우면
 * StrictMode의 이중 호출에 그대로 두 번 뜬다.
 */
export function useStorePot() {
  const [picked, setPicked] = useState<readonly string[]>([]);
  const [falling, setFalling] = useState<readonly FallingBall[]>([]);
  const nextBallId = useRef(0);

  /** 새로 담았으면 true. 화면은 이때만 공을 떨어뜨리고 헤딩을 바꾼다. */
  const toggle = useCallback(
    (store: RecommendStore): boolean => {
      if (picked.includes(store.placeId)) {
        setPicked(picked.filter((id) => id !== store.placeId));
        return false;
      }

      if (picked.length >= MAX_PICKED) {
        toast.warning(`매장은 ${MAX_PICKED}곳까지 담을 수 있어요`);
        return false;
      }

      nextBallId.current += 1;
      const id = nextBallId.current;

      setPicked([...picked, store.placeId]);
      setFalling((current) => [...current, { id, category: store.category }]);

      return true;
    },
    [picked],
  );

  const settleBall = useCallback((id: number) => {
    setFalling((current) => current.filter((ball) => ball.id !== id));
  }, []);

  return { picked, falling, toggle, settleBall };
}
