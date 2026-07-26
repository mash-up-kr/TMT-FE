import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * TMT 디자인 토큰을 Tailwind 병합 규칙에 추가합니다.
 *
 * - `text-heading-*`, `text-body-*`: 타이포그래피 토큰
 * - `surface-*`, `content-*`, `icon-*`, `stroke-*`: theme에 정의된 semantic 색상 토큰
 * - `ds-*`: TMT spacing/radius 토큰
 * - `border-sm|md|lg`: theme의 border width 유틸 — 등록하지 않으면 twMerge가
 *   border 색상 클래스와 충돌로 오판해 제거한다.
 *
 * `clsx`는 조건에 맞는 클래스만 하나의 문자열로 합칩니다.
 * `twMerge`는 같은 CSS 속성을 바꾸는 Tailwind 클래스를 찾아 마지막 클래스를 남깁니다.
 * `cn`은 두 함수를 묶어 조건부 결합과 충돌 정리를 한 번에 처리합니다.
 */

const isTmtTextToken = (value: string) =>
  /^(heading-(xl|lg|md|sm)|body-(lg|md|sm)-(bold|medium|regular))$/.test(value);

const isTmtSpacingToken = (value: string) => /^ds-(0|2|4|8|12|16|20|24|32|40|48|64)$/.test(value);

const isTmtRadiusToken = (value: string) => /^ds-(xs|sm|md|lg|xl|full)$/.test(value);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "border-w": [{ border: ["sm", "md", "lg"] }],
    },
    theme: {
      radius: [isTmtRadiusToken],
      spacing: [isTmtSpacingToken],
      text: [isTmtTextToken],
    },
  },
});

/**
 * 조건부 클래스를 합치고, 충돌하는 Tailwind 클래스는 마지막 값으로 정리합니다.
 *
 * @example
 * cn("p-2", isLarge && "p-4", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
