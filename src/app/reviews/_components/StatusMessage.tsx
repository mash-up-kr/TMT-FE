import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type StatusMessageProps = Readonly<{
  tone?: "default" | "error";
  className?: string;
  children: ReactNode;
}>;

/**
 * 로딩·에러·빈 결과 같은 상태 한 줄. 검색 시트, 태그 단계, 초안 로딩이 같은 생김새를 쓴다.
 * 여백은 놓이는 자리마다 달라 호출부가 `className`으로 준다.
 */
export function StatusMessage({ tone = "default", className, children }: StatusMessageProps) {
  return (
    <p
      role="status"
      className={cn(
        "text-center text-body-md-medium",
        tone === "error" ? "text-content-error" : "text-content-tertiary",
        className,
      )}
    >
      {children}
    </p>
  );
}
