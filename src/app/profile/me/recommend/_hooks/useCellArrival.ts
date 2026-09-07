"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type RefObject, useRef } from "react";
import { CELL_LABEL, CELL_POP, RISE_AT } from "../_constants/motion";

const CELL = "[data-arrival='cell']";
const LABEL = "[data-arrival='label']";

/**
 * 조회가 끝나 뒤늦게 붙는 매장 칸을 한 번 튀어오르게 한다.
 *
 * 진입 연출(`useRecommendEntrance`)은 마운트 시점에 셀렉터를 해석해서, 그때 판에 있던
 * 빈 점과 `+`만 잡는다. 매장 칸은 응답이 온 뒤에 생기므로 그 타임라인에 실리지 않는다.
 * 대상이 갈려 있어 두 연출이 같은 노드를 다투지 않는다.
 *
 * 응답이 진입 연출보다 빨리 오면 매장 칸이 빈 점보다 먼저 튀어 순서가 뒤집힌다. 그래서
 * 마운트 이후 흐른 시간을 재서, 판이 튀어오르기로 한 시각(`RISE_AT.cells`)까지 기다린다.
 */
export function useCellArrival(scope: RefObject<HTMLElement | null>, storeCount: number) {
  const mountedAt = useRef(performance.now());
  const isMountRun = useRef(true);
  const hasArrived = useRef(false);

  useGSAP(
    () => {
      // 캐시가 있으면 첫 렌더부터 칸이 있다. 그건 진입 연출이 이미 잡았으므로 여기서 또 튀기면
      // 같은 노드가 두 번 튄다.
      if (isMountRun.current) {
        isMountRun.current = false;
        hasArrived.current = storeCount > 0;
        return;
      }

      if (hasArrived.current || storeCount === 0) {
        return;
      }

      hasArrived.current = true;

      const media = gsap.matchMedia(scope.current ?? undefined);
      const elapsed = (performance.now() - mountedAt.current) / 1000;
      const delay = Math.max(0, RISE_AT.cells - elapsed);

      // 모션을 줄이도록 설정했으면 칸은 그대로 놔둔다. 줄여만 두고 트윈이 없으면 영영 안 보인다.
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(CELL, CELL_POP.from);

        const timeline = gsap
          .timeline({ delay })
          .to(CELL, { keyframes: [...CELL_POP.keyframes], stagger: CELL_POP.stagger })
          .from(
            LABEL,
            {
              y: CELL_LABEL.y,
              autoAlpha: 0,
              duration: CELL_LABEL.duration,
              ease: CELL_LABEL.ease,
              stagger: CELL_POP.stagger,
            },
            CELL_LABEL.delay,
          );

        return () => timeline.kill();
      });

      return () => media.revert();
    },
    { scope, dependencies: [storeCount] },
  );
}
