import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * TMT 디자인 토큰을 Tailwind 병합 규칙에 추가합니다.
 *
 * - `text-heading-*`, `text-body-*`: 타이포그래피 토큰
 * - `surface-*`, `content-*`, `icon-*`, `stroke-*`: semantic 색상 토큰
 * - `ds-*`: TMT spacing/radius 토큰
 *
 * 각 `isTmt*Token` 함수는 `tailwind-merge`가 전달한 토큰 값이 해당 그룹에 속하는지 판별합니다.
 * 덕분에 `text-heading-md`와 `text-content-primary`는 함께 유지되고,
 * `p-4`와 `p-ds-16`처럼 같은 CSS 속성을 바꾸는 값은 마지막 인자만 남습니다.
 */

const isTmtTextToken = (value: string) =>
  /^(heading-(xl|lg|md|sm)|body-(lg|md|sm)-(bold|medium|regular))$/.test(value);

const isTmtColorToken = (value: string) => /^(surface|content|icon|stroke)-[a-z-]+$/.test(value);

const isTmtSpacingToken = (value: string) => /^ds-(0|2|4|8|12|16|20|24|32|40|48|64)$/.test(value);

const isTmtRadiusToken = (value: string) => /^ds-(xs|sm|md|lg|xl|full)$/.test(value);

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [isTmtColorToken],
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
