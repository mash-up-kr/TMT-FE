import type { ComponentPropsWithRef } from "react";
import { AlertCircleIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";

export type NoticeProps = ComponentPropsWithRef<"p"> & {
  /** 한 줄 안내 문구. */
  children: string;
};

/**
 * ⓘ 아이콘이 붙은 한 줄 안내 박스. 리뷰 쓰기의 선택 항목 안내와 랭킹의 순위 기준 안내가 함께 쓴다.
 *
 * 박스 모양(배경·여백·글자·아이콘 크기)은 여기 한 곳이 정한다. 화면마다 같은 클래스를 적어 두면
 * 디자인이 바뀔 때 한쪽만 바뀌어도 오류 없이 통과한다.
 */
export function Notice({ className, children, ...props }: NoticeProps) {
  return (
    <p
      data-slot="notice"
      className={cn(
        "flex w-full items-center gap-ds-4 rounded-ds-xs bg-surface-secondary px-ds-12 py-ds-8 text-body-md-medium text-content-tertiary",
        className,
      )}
      {...props}
    >
      <AlertCircleIcon size={16} className="shrink-0" />
      {children}
    </p>
  );
}
