"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { PEPPER } from "../_constants/motion";
import PepperShape from "./assets/pepper.svg?react";

type PepperShakerProps = Readonly<{
  /** 어느 쪽에서 나오는지. 왼쪽은 각도를 좌우 대칭으로 뒤집는다. */
  side: "left" | "right";
  /** 나오기까지 기다리는 시간(초). */
  delay: number;
  /** 다 뿌리고 사라진 뒤. */
  onDone?: () => void;
}>;

/**
 * 후추통이 냄비 위쪽에서 나와 두 번 기울이고 사라진다.
 *
 * 서 있지 않고 뚜껑이 냄비를 향하도록 기울어 있다(−135°). 시안에서 8.86×17.01 에셋을 담은
 * 프레임이 18.3 정사각인데, 그건 45° 계열로 돌렸을 때만 나오는 크기다.
 *
 * 시안에는 후추 그라인더만 있고 떨어지는 가루 에셋이 없다. 그래서 가루를 그리지 않고 통이
 * 냄비 쪽으로 두 번 까딱이는 것으로 "뿌렸다"를 읽힌다.
 */
export function PepperShaker({ side, delay, onDone }: PepperShakerProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // 왼쪽은 각도를 뒤집어 대칭으로 세운다. 뒤집으면 까딱이는 방향도 함께 반대가 된다.
  const mirror = side === "left" ? -1 : 1;
  const rest = PEPPER.rest * mirror;
  const tapped = rest + PEPPER.tilt * mirror;

  useGSAP(
    () => {
      const element = ref.current;

      if (!element) {
        return;
      }

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: reduce)", () => {
        onDone?.();
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({ delay, onComplete: onDone });

        timeline
          /*
           * 회전축은 중심이어야 한다.
           *
           * 시안에서 이 후추를 담은 프레임이 8.86×17.01 에셋을 담고도 18.3 정사각인 건
           * 45° 계열로 돌린 바운딩 박스이고, 배치 기준은 그 박스의 중심이다. 축을 아래쪽
           * (50% 80%)에 두면 −135° 회전이 요소를 26.6px 아래로 밀어 냄비 몸통에 겹친다.
           */
          .set(element, { rotate: rest, transformOrigin: "50% 50%", autoAlpha: 0 })
          .to(element, { autoAlpha: 1, ...PEPPER.fadeIn });

        // 툭, 툭. 뚜껑이 냄비 쪽으로 더 꺾였다 돌아온다.
        for (let tap = 0; tap < PEPPER.taps; tap += 1) {
          timeline
            .to(element, { rotate: tapped, duration: PEPPER.tiltDuration, ease: "power2.out" })
            .to(element, { rotate: rest, duration: PEPPER.tiltDuration, ease: "power2.inOut" });
        }

        timeline.to(element, { autoAlpha: 0, ...PEPPER.fadeOut });

        return () => timeline.kill();
      });

      return () => media.revert();
    },
    { scope: ref, dependencies: [delay, rest, tapped] },
  );

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="invisible absolute block"
      style={{
        top: PEPPER.top,
        [side]: PEPPER.inset,
        width: PEPPER.width,
        height: PEPPER.height,
      }}
    >
      <PepperShape className="absolute inset-0 size-full" />
    </span>
  );
}
