"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { BALL_DROP } from "../_constants/motion";
import type { FoodCategory } from "../_model/recommend";
import { FoodCategorySticker } from "./FoodCategorySticker";

type DroppingBallProps = Readonly<{
  category: FoodCategory;
  /** 냄비 뒤로 사라진 뒤. 여기서 DOM에서 걷어낸다. */
  onSettle: () => void;
}>;

/**
 * 담은 매장의 스티커가 공이 되어 냄비로 떨어진다.
 *
 * 냄비 그림보다 **앞이 아니라 뒤에** 놓인다(DOM에서 냄비보다 먼저 온다). 그래서 닿는 순간
 * 가려지며 "안으로 들어갔다"로 읽힌다. 시안(Figma 1821:43434)의 레이어 순서가 그렇다.
 *
 * 마운트되면 스스로 떨어지고 끝나면 스스로 물러난다. 연타로 여러 개가 동시에 떨어져도
 * 서로 간섭하지 않게 하려는 것이다.
 */
export function DroppingBall({ category, onSettle }: DroppingBallProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const element = ref.current;

      if (!element) {
        return;
      }

      const media = gsap.matchMedia();

      // 모션을 줄이도록 설정했으면 떨어뜨리지 않는다. 담긴 결과만 남기면 된다.
      media.add("(prefers-reduced-motion: reduce)", () => {
        onSettle();
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({ delay: BALL_DROP.headingLead, onComplete: onSettle });

        timeline
          .set(element, { y: -BALL_DROP.travel, autoAlpha: 1 })
          .to(element, { y: 0, ...BALL_DROP.fall })
          // 냄비 뒤에 가려진 상태로 잠깐 더 내려가 완전히 안 보이게 한다.
          .to(element, { y: BALL_DROP.size, autoAlpha: 0, duration: 0.18, ease: "power1.in" });

        return () => timeline.kill();
      });

      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <span
      ref={ref}
      aria-hidden="true"
      // 가운데 정렬을 transform으로 하면 GSAP이 y를 쓸 때 통째로 덮어써 좌우가 틀어진다.
      // margin으로 잡아두면 transform은 낙하에만 쓰인다.
      className="invisible absolute left-1/2 flex items-center justify-center rounded-ds-full bg-surface-primary"
      style={{
        top: BALL_DROP.landing,
        marginLeft: -BALL_DROP.size / 2,
        width: BALL_DROP.size,
        height: BALL_DROP.size,
      }}
    >
      <FoodCategorySticker category={category} size={BALL_DROP.size} />
    </span>
  );
}
