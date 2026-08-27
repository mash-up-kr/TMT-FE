"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type RefObject, useCallback } from "react";
import { COOK, PEPPER } from "../_constants/motion";

/** 화면이 지금 어느 단계인지. 라우트를 바꾸지 않고 이 값으로만 갈린다. */
export type RecommendPhase = "picking" | "cooking" | "loading" | "result";

const FADING = "[data-cook-fade]";
const POT = "[data-entrance='pot']";

/** 후추 한 통이 나와 두 번 까딱이고 사라지기까지 걸리는 시간. */
export const PEPPER_RUN =
  PEPPER.fadeIn.duration + PEPPER.tiltDuration * 2 * PEPPER.taps + PEPPER.fadeOut.duration;

/** 오른쪽 후추가 나오기까지. 냄비가 다 커지고 한 박자 쉰 뒤다. */
export const PEPPER_RIGHT_DELAY = COOK.potGrow.duration + COOK.beforePepper;

/** 왼쪽 후추가 나오기까지. 오른쪽이 다 끝난 뒤다. */
export const PEPPER_LEFT_DELAY = PEPPER_RIGHT_DELAY + PEPPER_RUN;

type CookSequence = {
  /** 담기 화면을 비우고 냄비를 키웠다가 위로 올려 지운다. 끝나면 `onCleared`를 부른다. */
  run: () => void;
};

/**
 * `매장 추천받기`를 누른 뒤 로딩으로 넘어가는 연출.
 *
 * 후추 두 통은 각자 자기 타임라인을 갖고 `delay`로 순서를 잡는다. 여기서는 화면을 비우고
 * 냄비를 키웠다 지우는 것만 맡는다 — 한 타임라인이 남의 요소까지 쥐면 중간에 바꾸기 어렵다.
 */
export function useCookSequence(
  scope: RefObject<HTMLElement | null>,
  onCleared: () => void,
): CookSequence {
  const { contextSafe } = useGSAP({ scope });

  const run = contextSafe(() => {
    const media = gsap.matchMedia(scope.current ?? undefined);

    // 모션을 줄이도록 설정했으면 연출 없이 로딩으로 넘긴다.
    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(FADING, { autoAlpha: 0 });
      gsap.set(POT, { autoAlpha: 0 });
      onCleared();
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({ onComplete: onCleared });

      timeline
        // 제목·버튼·그리드가 한꺼번에 사라진다.
        .to(FADING, { autoAlpha: 0, ...COOK.clear }, 0)
        // 냄비만 남아 살짝 커진다.
        .to(POT, { ...COOK.potGrow }, 0)
        /*
         * 후추 두 통이 지나가는 동안 냄비는 그대로 기다린다.
         *
         * 이 빈 트윈은 냄비 확대(potGrow)가 끝난 시점부터 재기 시작한다. 그래서 후추가
         * 시작하는 시각(PEPPER_RIGHT_DELAY)에서 그만큼을 빼야 실제 대기 길이가 나온다.
         */
        .to(
          {},
          { duration: PEPPER_LEFT_DELAY + PEPPER_RUN + COOK.beforeExit - COOK.potGrow.duration },
        )
        // 위로 올라가며 사라진다. 시안 로딩 프레임의 냄비가 이 도착점이다.
        .to(POT, { autoAlpha: 0, ...COOK.potExit });

      return () => timeline.kill();
    });
  }) as () => void;

  return { run: useCallback(() => run(), [run]) };
}
