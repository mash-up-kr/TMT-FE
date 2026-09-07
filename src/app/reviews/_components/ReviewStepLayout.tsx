import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type ReviewStepLayoutProps = Readonly<{
  children: ReactNode;
  footer: ReactNode;
  className?: string;
  footerClassName?: string;
}>;

/**
 * 리뷰 플로우 한 화면의 본문·하단 버튼 배치.
 *
 * 스크롤은 본문이 소유한다. `app-frame`이 높이를 화면에 고정하고 넘치는 부분을 잘라내므로,
 * 본문이 `min-h-0` 없이 늘어나면 하단 버튼이 프레임 밖으로 밀려 사라진다.
 */
export function ReviewStepLayout({
  children,
  footer,
  className,
  footerClassName,
}: ReviewStepLayoutProps) {
  return (
    <>
      <div
        className={cn("content-container flex min-h-0 flex-1 flex-col overflow-y-auto", className)}
      >
        {children}
      </div>

      <div className={cn("content-container shrink-0 pt-ds-12 pb-ds-32", footerClassName)}>
        {footer}
      </div>
    </>
  );
}
