import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { MascotImage } from "@/shared/components/MascotImage";
import { cn } from "@/shared/utils/cn";

type EmptyNoticeBaseProps = {
  title: string;
  /** 문구 위 이미지. 생략하면 이미지 없이 표시한다. */
  src?: StaticImageData;
  /** 다음 행동으로 보내는 control. 있을 때만 문구 아래에 놓인다. */
  action?: ReactNode;
};

type EmptyNoticeProps = EmptyNoticeBaseProps &
  (
    | {
        variant?: "default";
        eyebrow?: never;
        children?: string;
      }
    | {
        variant: "prominent";
        eyebrow: string;
        children?: never;
      }
  );

/** 빈 상태의 내용만 그린다. 남은 높이와 정렬, 바깥 여백은 사용처가 정한다. */
export function EmptyNotice({
  title,
  variant = "default",
  src,
  eyebrow,
  children,
  action,
}: EmptyNoticeProps) {
  const isProminent = variant === "prominent";

  return (
    <div data-slot="empty-notice" className="flex shrink-0 flex-col items-center gap-ds-12">
      <div className="flex flex-col items-center gap-[6px]">
        {src ? <MascotImage src={src} /> : null}
        <div className={cn("flex flex-col text-center", isProminent ? "gap-ds-8" : "gap-ds-4")}>
          {eyebrow ? <p className="text-body-lg-regular text-content-primary">{eyebrow}</p> : null}
          <p
            className={cn(
              "whitespace-pre-line text-content-primary",
              isProminent ? "text-heading-lg" : "text-heading-sm",
            )}
          >
            {title}
          </p>
          {isProminent ? null : (
            <div className="min-h-ds-20">
              {children ? (
                <p className="text-body-md-regular text-content-tertiary">{children}</p>
              ) : null}
            </div>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}
