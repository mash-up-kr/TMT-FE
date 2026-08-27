"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { LADLE } from "../_constants/motion";
import LadleShape from "./assets/ladle.svg?react";

type StirringLadleProps = Readonly<{
  /** 다 젓고 사라진 뒤. 여기서 제목이 돌아온다. */
  onDone: () => void;
}>;

const EASE = "sine.inOut";

/**
 * 국자가 냄비 위에 드러나 두 번 젓고 다시 사라진다.
 *
 * 자리를 옮겨 들어오지 않는다. 처음부터 제자리에 투명하게 있다가 투명도만 풀린다.
 * 그래서 세로 이동이 없고, 이 자리에서 그릇은 냄비 테두리에 걸쳐 손잡이가 주로 보인다.
 *
 * 냄비 그림보다 뒤에 놓여서, 그릇이 냄비 안에 잠긴 것처럼 보인다.
 * 마운트되면 스스로 한 바퀴 돌고 끝나면 알린다. 화면이 `key`를 갈아 새로 마운트한다.
 */
export function StirringLadle({ onDone }: StirringLadleProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const element = ref.current;

      if (!element) {
        return;
      }

      const media = gsap.matchMedia();

      // 모션을 줄이도록 설정했으면 젓지 않는다. 결과만 이어가면 된다.
      media.add("(prefers-reduced-motion: reduce)", () => {
        onDone();
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({ onComplete: onDone });
        const full = LADLE.swingDuration;
        const half = full / 2;

        timeline
          .set(element, { x: 0, rotate: 0, transformOrigin: LADLE.pivot, autoAlpha: 0 })
          .to(element, { autoAlpha: 1, ...LADLE.fadeIn })
          /*
           * 좌우로 두 번 왕복하며 젓는다.
           *
           * 중앙에서 출발해 중앙으로 돌아오므로 양 끝 구간은 절반 거리라 절반 시간이다.
           * yoyo로 돌리면 한쪽 끝에서 시작해야 해서 드러나자마자 옆으로 튄다.
           */
          .to(element, {
            keyframes: [
              { x: LADLE.sway, rotate: LADLE.swing, duration: half },
              { x: -LADLE.sway, rotate: -LADLE.swing, duration: full },
              { x: LADLE.sway, rotate: LADLE.swing, duration: full },
              { x: -LADLE.sway, rotate: -LADLE.swing, duration: full },
              { x: 0, rotate: 0, duration: half },
            ],
            ease: EASE,
          })
          .to(element, { autoAlpha: 0, ...LADLE.fadeOut });

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
      // 젓는 도중에 `매장 추천받기`를 누르면 제목·버튼·그리드와 같은 트윈으로 함께 사라진다.
      data-cook-fade
      className="invisible absolute block"
      style={{
        left: LADLE.left,
        top: LADLE.top,
        width: LADLE.width,
        height: LADLE.height,
      }}
    >
      <LadleShape className="absolute inset-0 size-full" />
    </span>
  );
}
