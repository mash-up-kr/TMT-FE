"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { CAPTION_COLOR, CAPTION_GLOW, LOADING_CAPTION } from "../_constants/loading";
import { CAPTION_WAVE } from "../_constants/motion";

const CHAR = "[data-caption-char]";

/** 글자를 자리마다 하나씩 떼어 둔다. 같은 글자가 반복돼 값만으로는 구분되지 않는다. */
const LETTERS = [...LOADING_CAPTION].map((char, index) => ({
  key: `${index}-${char}`,
  char,
  blank: char === " ",
}));

/**
 * 로딩 문구와 그 뒤에서 번지는 빛.
 *
 * 글자를 하나씩 쪼개 차례로 띄운다. 공백은 띄울 것이 없어 건너뛴다 — 시안도 공백 프레임이 없다.
 *
 * 쪼갠 글자를 스크린리더가 한 자씩 읽으면 못 알아듣는다. 그래서 쪼갠 쪽은 `aria-hidden`으로
 * 감추고, 문구 전체를 읽을 수 있는 텍스트를 따로 둔다.
 */
export function LoadingCaption() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia(root.current ?? undefined);

      // 모션을 줄이도록 설정했으면 문구만 띄우고 웨이브는 돌리지 않는다.
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(root.current, { autoAlpha: 1, y: 0 });
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const appear = gsap.fromTo(
          root.current,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, ...CAPTION_WAVE.fadeIn },
        );

        /*
         * 한 글자씩 올랐다 내려오며 왼쪽에서 오른쪽으로 지나간다. 데이터가 올 때까지 반복한다.
         *
         * 오르내림을 글자마다 keyframes로 쥔다. tween 레벨에 yoyo/repeat를 걸면 스태거 전체가
         * 역재생되어 파도가 끝까지 갔다가 되돌아온다 — 늘 왼쪽에서 다시 출발해야 한다.
         * 반복은 timeline이 쥐고 있어야 한 줄을 다 지난 뒤 `gap`만큼 쉬었다 처음부터 간다.
         */
        const wave = gsap.timeline({ repeat: -1, repeatDelay: CAPTION_WAVE.gap }).to(CHAR, {
          keyframes: [
            { y: -CAPTION_WAVE.lift, duration: CAPTION_WAVE.duration / 2, ease: "sine.out" },
            { y: 0, duration: CAPTION_WAVE.duration / 2, ease: "sine.in" },
          ],
          stagger: CAPTION_WAVE.step,
        });

        return () => {
          appear.kill();
          wave.kill();
        };
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="invisible relative flex items-center justify-center">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute rounded-ds-full"
        style={{
          width: CAPTION_GLOW.size,
          height: CAPTION_GLOW.size,
          top: `calc(50% + ${CAPTION_GLOW.offsetY}px)`,
          left: "50%",
          marginTop: -CAPTION_GLOW.size / 2,
          marginLeft: -CAPTION_GLOW.size / 2,
          background: CAPTION_GLOW.background,
        }}
      />
      <p
        aria-hidden="true"
        className="relative whitespace-nowrap text-center text-heading-md"
        style={{ color: CAPTION_COLOR }}
      >
        {LETTERS.map((letter) =>
          letter.blank ? (
            <span key={letter.key}>&nbsp;</span>
          ) : (
            <span key={letter.key} data-caption-char className="inline-block">
              {letter.char}
            </span>
          ),
        )}
      </p>
      <p className="sr-only">{LOADING_CAPTION}</p>
    </div>
  );
}
