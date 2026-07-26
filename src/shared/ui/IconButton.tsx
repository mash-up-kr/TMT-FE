import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type IconButtonProps = Readonly<
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    /** 아이콘 단독 버튼이므로 접근 가능한 이름을 반드시 받는다. */
    "aria-label": string;
    children: ReactNode;
  }
>;

/**
 * 아이콘 단독 버튼.
 *
 * 아이콘이 24라 터치 영역이 부족해 `::after`로 32까지 넓힌다. 가상 요소는 레이아웃에
 * 참여하지 않아 아이콘 크기와 간격은 그대로다. 아이콘 중심 거리가 32라 더 키우면 이웃과 겹친다.
 */
export function IconButton({ className, children, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "relative text-icon-primary",
        className,
        "after:-translate-x-1/2 after:-translate-y-1/2 after:absolute after:top-1/2 after:left-1/2 after:size-ds-32 after:content-['']",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
