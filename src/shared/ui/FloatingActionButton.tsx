"use client";

import { useRender } from "@base-ui/react/use-render";
import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

/**
 * FAB이 놓이는 맥락. 둘의 차이는 오프셋 하나지만 이유가 달라 이름으로 드러낸다.
 * - floating: `ScreenLayout`의 `floating` 레이어 안. 레이어가 이벤트를 먹지 않고(`pointer-events-none`)
 *   바닥을 내브 높이만큼 올려 두므로, 버튼이 이벤트를 다시 켜고 `bottom-ds-0`에 놓인다.
 * - standalone: 레이어 없이 화면에 직접. 내브가 없는 화면이라 `bottom-ds-20`으로 띄운다.
 */
type FloatingActionButtonPlacement = "floating" | "standalone";

const placementStyles = {
  floating: "pointer-events-auto bottom-ds-0",
  standalone: "bottom-ds-20",
} satisfies Record<FloatingActionButtonPlacement, string>;

export type FloatingActionButtonProps = useRender.ComponentProps<"button"> & {
  /** 아이콘 단독 버튼이므로 접근 가능한 이름을 반드시 받는다. */
  "aria-label": string;
  placement: FloatingActionButtonPlacement;
  children: ReactNode;
};

/**
 * 화면 우하단에 떠 있는 아이콘 버튼. 피드의 전환, 그룹 상세의 리뷰 남기기, 마이페이지의 랭킹이
 * 함께 쓴다.
 *
 * 모양(자리·색·여백)은 여기 한 곳이 정한다. 화면마다 같은 클래스를 적어 두면 한쪽만 바뀌어도
 * 오류 없이 통과한다. 기본은 `<button>`이고, 이동이 목적이면 `render={<Link href=… />}`로
 * 링크가 된다 — Base UI의 `render` 합성이다.
 */
export function FloatingActionButton({
  placement,
  className,
  render,
  children,
  ...props
}: FloatingActionButtonProps) {
  return useRender({
    render: render ?? <button type="button" />,
    props: {
      className: cn(
        "absolute right-ds-20 z-overlay rounded-ds-md bg-surface-interactive-secondary p-ds-8 text-icon-interactive-inverse",
        placementStyles[placement],
        className,
      ),
      children,
      ...props,
    },
  });
}
