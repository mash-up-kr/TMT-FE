"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type RefObject, useCallback, useRef, useState } from "react";
import { HEADING_ROTATION } from "../_constants/motion";

type HeadingRotation = {
  /** 지금 보여줄 문구의 인덱스. */
  index: number;
  /** 순환을 끊고 제목을 비운다. 다시 채울 때까지 비어 있다. */
  hide: () => void;
  /**
   * 제목에 걸린 것을 전부 죽인다. 되돌릴 수 없다.
   *
   * `hide`는 멈추기만 해서, 담기 단계를 떠난 뒤에도 예약이 남아 있으면 뒤늦게 되살아난다.
   * 화면이 다른 단계로 넘어갈 때는 이걸 쓴다.
   */
  stop: () => void;
  /**
   * 지정한 문구를 한 번 보여준 뒤 다시 순환으로 돌아간다.
   * `holdOut`(초)만큼 비운 채로 더 머문 뒤에 올라온다.
   */
  announce: (index: number, holdOut?: number) => void;
};

/**
 * 제목을 일정 간격으로 바꾼다.
 *
 * 앞 문구를 완전히 내보낸 뒤에 다음 문구를 넣는 순차 교체라, DOM에는 언제나 한 문구만 있다.
 * 세 문구를 겹쳐두고 투명도로 바꾸면 스크린리더가 셋을 다 읽어버린다.
 *
 * 모션을 줄이도록 설정한 사용자에게는 세로 이동 없이 투명도로만 바꾼다. 문구가 아예 안 바뀌면
 * 나머지 두 문구를 영영 못 보게 되므로, 움직임만 걷어내고 내용은 지킨다.
 */
export function useHeadingRotation(
  ref: RefObject<HTMLElement | null>,
  count: number,
): HeadingRotation {
  const [index, setIndex] = useState(0);
  const rotation = useRef<gsap.core.Timeline>(null);
  // as const 상수라 그대로 넘기면 리터럴 타입으로 굳는다. 모션 설정에 따라 0도 들어간다.
  const travel = useRef<number>(HEADING_ROTATION.travel);
  /** 예약된 복귀. 연달아 담으면 이걸 취소하고 다시 잡아 복귀 시점만 미룬다. */
  const restore = useRef<gsap.core.Tween>(null);
  /** 지금 제목이 비워져 있는지. 사라지는 트윈을 겹쳐 걸지 않기 위한 것이다. */
  const hidden = useRef(false);

  useGSAP(
    () => {
      const element = ref.current;

      if (!element || count < 2) {
        return;
      }

      const media = gsap.matchMedia();

      const start = (distance: number) => {
        travel.current = distance;

        const timeline = gsap.timeline({ repeat: -1, delay: HEADING_ROTATION.startDelay });

        timeline
          .to(element, {
            y: -distance,
            autoAlpha: 0,
            ...HEADING_ROTATION.out,
            delay: HEADING_ROTATION.hold,
          })
          .call(() => setIndex((current) => (current + 1) % count))
          // fromTo는 타임라인 뒤쪽에 놓아도 생성 즉시 시작 상태를 그려버려(immediateRender),
          // 마운트하자마자 제목이 사라지고 진입 트윈과 부딪힌다. 타임라인 안의 set은 재생
          // 헤드가 닿을 때만 적용되므로 그 문제가 없다.
          .set(element, { y: distance })
          .to(element, { y: 0, autoAlpha: 1, ...HEADING_ROTATION.in });

        rotation.current = timeline;

        return () => {
          timeline.kill();
          rotation.current = null;
        };
      };

      media.add("(prefers-reduced-motion: no-preference)", () => start(HEADING_ROTATION.travel));
      media.add("(prefers-reduced-motion: reduce)", () => start(0));

      return () => media.revert();
    },
    { scope: ref, dependencies: [count] },
  );

  /**
   * 순환을 멈추고 제목을 비운다.
   *
   * 이미 비어 있으면 다시 시작하지 않는다. 매번 되감으면 투명도가 덜컥거린다 —
   * 연달아 담을 때 제목이 떨렸던 원인이다. 반환값은 비우는 데 실제로 쓴 시간이다.
   */
  const hide = useCallback((): number => {
    const element = ref.current;

    if (!element) {
      return 0;
    }

    rotation.current?.pause(0);
    // 예약된 복귀를 취소한다. 연달아 부르면 복귀 시점만 뒤로 밀린다.
    restore.current?.kill();

    if (hidden.current) {
      return 0;
    }

    hidden.current = true;
    gsap.to(element, { y: -travel.current, autoAlpha: 0, ...HEADING_ROTATION.out });

    return HEADING_ROTATION.out.duration;
  }, [ref]);

  /**
   * 매장을 담은 직후처럼 지금 문구를 밀어내고 특정 문구를 보여줘야 할 때 쓴다.
   * 비우고 `holdOut`만큼 기다린 뒤 새 문구를 올리고, 끝나면 순환으로 돌아간다.
   */
  const announce = useCallback(
    (target: number, holdOut = 0) => {
      const element = ref.current;

      if (!element) {
        return;
      }

      const fading = hide();

      restore.current = gsap.delayedCall(fading + holdOut, () => {
        hidden.current = false;
        setIndex(target);

        gsap
          .timeline()
          .set(element, { y: travel.current })
          .to(element, { y: 0, autoAlpha: 1, ...HEADING_ROTATION.in })
          .call(() => rotation.current?.restart(true));
      });
    },
    [ref, hide],
  );

  /**
   * 순환 타임라인, 예약된 복귀, 제목에 걸린 트윈까지 모두 죽인다.
   *
   * 여기서 투명도를 직접 건드리지는 않는다. 뒤이어 도는 연출(요리 시퀀스)이 제목을 함께
   * 지우므로, 값을 고정해버리면 그 페이드가 잘린다. 남은 것을 치우기만 한다.
   */
  const stop = useCallback(() => {
    rotation.current?.kill();
    rotation.current = null;
    restore.current?.kill();
    restore.current = null;

    if (ref.current) {
      gsap.killTweensOf(ref.current);
    }

    hidden.current = true;
  }, [ref]);

  return { index, hide, stop, announce };
}
