"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type RefObject, useCallback, useRef } from "react";
import {
  CELL_LABEL,
  CELL_POP,
  POT_IDLE,
  POT_TILT,
  RISE,
  RISE_AT,
  RISE_DISTANCE,
} from "../_constants/motion";

const TITLE = "[data-entrance='title']";
const POT = "[data-entrance='pot']";
const POT_TILT_TARGET = "[data-entrance='pot-tilt']";
const BUTTON = "[data-entrance='button']";
const CELL = "[data-entrance='cell-pop']";
const CELL_LABEL_TARGET = "[data-entrance='cell-label']";

const ALL = [TITLE, POT, POT_TILT_TARGET, BUTTON, CELL, CELL_LABEL_TARGET];

/** 냄비는 바닥을 딛고 흔들려야 냄비처럼 보인다. 박스가 곧 그림이라 아랫변이 100%다. */
const POT_PIVOT = "50% 100%";

/** 대기 흔들림을 멈출 때 똑바로 세우는 데 쓰는 시간. */
const SETTLE = { duration: 0.25, ease: "sine.out" } as const;

type RecommendEntrance = {
  /** 대기 흔들림을 멈추고 냄비를 똑바로 세운다. */
  stopIdle: () => void;
  /** 다시 흔들리게 한다. 0도에서 다시 시작한다. */
  startIdle: () => void;
};

/**
 * 진입 연출과, 그것이 끝난 뒤 이어지는 대기 상태의 냄비 흔들림.
 *
 * 타이밍은 전부 `_constants/motion.ts`가 소유한다. 여기서는 순서와 대상만 정한다.
 *
 * 흔들림을 밖에서 멈출 수 있게 열어둔다. 매장을 담는 동안에는 공과 국자가 냄비 위에서
 * 움직이는데, 냄비까지 같이 흔들리면 볼 곳이 셋이 되어 산만하다.
 */
export function useRecommendEntrance(scope: RefObject<HTMLElement | null>): RecommendEntrance {
  const idle = useRef<gsap.core.Timeline>(null);
  const tilt = useRef<Element>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia(scope.current ?? undefined);
      tilt.current = scope.current?.querySelector(POT_TILT_TARGET) ?? null;

      // 모션을 줄이도록 설정한 사용자에게는 완성된 화면을 그대로 보여준다.
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ALL, { clearProps: "all" });
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(POT_TILT_TARGET, { transformOrigin: POT_PIVOT });
        // keyframes 트윈은 from 상태를 미리 그려주지 않아 여기서 한 번 줄여 둔다.
        // scale 0이면 이미 보이지 않으므로 opacity는 건드리지 않는다 — 되돌리는 걸 잊으면
        // 칸이 영영 안 보인다.
        gsap.set(CELL, CELL_POP.from);

        const timeline = gsap
          .timeline()
          .from(TITLE, { y: RISE_DISTANCE.title, autoAlpha: 0, ...RISE }, RISE_AT.title)
          .from(POT, { y: RISE_DISTANCE.pot, autoAlpha: 0, ...RISE }, RISE_AT.pot)
          .fromTo(
            POT_TILT_TARGET,
            { rotate: POT_TILT.from },
            { keyframes: [...POT_TILT.keyframes], ease: POT_TILT.ease },
            RISE_AT.pot,
          )
          .from(BUTTON, { y: RISE_DISTANCE.button, autoAlpha: 0, ...RISE }, RISE_AT.button)
          .to(
            CELL,
            { keyframes: [...CELL_POP.keyframes], stagger: CELL_POP.stagger },
            RISE_AT.cells,
          )
          .from(
            CELL_LABEL_TARGET,
            {
              y: CELL_LABEL.y,
              autoAlpha: 0,
              duration: CELL_LABEL.duration,
              ease: CELL_LABEL.ease,
              stagger: CELL_POP.stagger,
            },
            RISE_AT.cells + CELL_LABEL.delay,
          )
          .call(() => {
            if (tilt.current) {
              idle.current = potIdleLoop(tilt.current);
            }
          });

        return () => {
          idle.current?.kill();
          idle.current = null;
          timeline.kill();
        };
      });

      return () => media.revert();
    },
    { scope },
  );

  const stopIdle = useCallback(() => {
    idle.current?.pause();

    // 기울어진 채로 멈추면 냄비가 삐딱하게 서 있는다. 똑바로 세우고 나서 멈춘다.
    if (tilt.current) {
      gsap.to(tilt.current, { rotate: 0, ...SETTLE });
    }
  }, []);

  const startIdle = useCallback(() => {
    // 루프는 0도에서 출발한다. 멈출 때 똑바로 세워뒀으므로 이어 붙어도 튀지 않는다.
    // invalidate로 트윈이 기억한 시작값을 지워야 지금 각도에서 다시 계산한다.
    idle.current?.invalidate().restart();
  }, []);

  return { stopIdle, startIdle };
}

/**
 * 0도에서 한쪽으로 기운 뒤, 양 끝 사이를 무한히 오간다.
 *
 * 전체를 반복시키면 이음매가 0도에 놓인다. `sine.inOut`은 구간 끝에서 속도가 0이라, 가장 빨리
 * 지나가야 할 가운데에서 냄비가 멈췄다 출발한다 — 끊겨 보이던 원인이다.
 * 왕복 자체를 yoyo로 돌리면 멈추는 지점이 진자처럼 양 끝(±rotate)에만 생긴다.
 */
function potIdleLoop(target: Element): gsap.core.Timeline {
  return gsap
    .timeline()
    .to(target, { rotate: POT_IDLE.rotate, duration: POT_IDLE.duration / 2, ease: POT_IDLE.ease })
    .to(target, {
      rotate: -POT_IDLE.rotate,
      duration: POT_IDLE.duration,
      ease: POT_IDLE.ease,
      yoyo: true,
      repeat: -1,
    });
}
