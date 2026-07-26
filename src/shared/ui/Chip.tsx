import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type ChipSize = "sm" | "md" | "lg";

/* Figma stroke는 inside 정렬이라 border 1px를 padding에서 상쇄해
   시안 높이(sm 26 / md 28 / lg 36)를 유지한다. */
const sizeStyles: Record<ChipSize, string> = {
  sm: "py-[calc(var(--spacing-ds-4)-1px)] text-body-sm-medium [&_svg]:size-ds-16",
  md: "py-[calc(var(--spacing-ds-4)-1px)] text-body-md-medium [&_svg]:size-ds-16",
  lg: "py-[calc(var(--spacing-ds-8)-1px)] text-body-md-medium [&_svg]:size-ds-20",
};

/* Figma 시안이 pressed 상태에 한 단계 약한 램프 값(tertiary/hovered,
   interactive-secondary-hovered)을 쓰므로 active에 -hovered 토큰이 온다. */
const unselectedStyles =
  "border-stroke-primary bg-surface-primary text-content-primary " +
  "hover:border-stroke-interactive-secondary hover:bg-surface-interactive-tertiary hover:text-content-secondary " +
  "active:border-stroke-interactive-secondary-hovered active:bg-surface-interactive-tertiary-hovered active:text-content-tertiary";

const selectedStyles =
  "border-stroke-interactive-primary bg-surface-selected text-content-interactive-primary " +
  "hover:border-stroke-interactive-primary-hovered hover:bg-surface-selected-hovered hover:text-content-interactive-primary-hovered " +
  "active:border-stroke-interactive-primary-pressed active:bg-surface-selected-pressed active:text-content-interactive-primary-pressed";

type ChipProps = ComponentProps<"button"> & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  selected?: boolean;
  size?: ChipSize;
};

/**
 * 필터·태그 선택에 쓰는 알약형 Chip. 전체가 하나의 button이고
 * 아이콘 슬롯은 장식이다 — 탭하면 onClick 하나만 발생한다.
 *
 * children은 라벨만 담고, 아이콘은 슬롯으로 넣는다. 슬롯의 svg는
 * size별 크기와 currentColor를 따른다:
 * `<Chip leftIcon={<PlaceIcon />} rightIcon={<CancelIcon />}>라벨</Chip>`
 *
 * `selected`를 넘기면 토글로 간주해 `aria-pressed`를 반영하고,
 * 넘기지 않으면 일반 버튼으로 동작한다. Hovered/Pressed는 prop이 아니라
 * CSS 상태(hover/active)로 표현한다.
 */
function Chip({
  children,
  className,
  leftIcon,
  rightIcon,
  selected,
  size = "md",
  type = "button",
  ...props
}: ChipProps) {
  return (
    <button
      data-slot="chip"
      aria-pressed={selected}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-ds-4 whitespace-nowrap rounded-ds-full border-sm px-ds-12 outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-interactive-primary",
        "disabled:pointer-events-none disabled:border-stroke-disabled disabled:bg-surface-disabled disabled:text-content-disabled",
        "[&_svg]:shrink-0",
        sizeStyles[size],
        selected ? selectedStyles : unselectedStyles,
        className,
      )}
      type={type}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

export { Chip };
