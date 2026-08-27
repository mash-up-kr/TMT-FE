import Image from "next/image";
import type { ReactNode } from "react";
import tomatoEmpty from "@/shared/components/assets/tomato-mascot-empty.png";
import { cn } from "@/shared/utils/cn";

type EmptyNoticeBaseProps = {
  title: string;
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
  eyebrow,
  children,
  action,
}: EmptyNoticeProps) {
  const isProminent = variant === "prominent";

  return (
    <div data-slot="empty-notice" className="flex shrink-0 flex-col items-center gap-ds-12">
      {/* 시안 실측값. 세로로 긴 원본을 폭에 맞춰 확대하면 프레임(130px)보다 높아지므로
          위로 밀어 다리를 잘라내고, 잘린 경계는 gradient로 배경에 녹인다. */}
      <div aria-hidden="true" className="relative h-[130px] w-[172px] shrink-0">
        <Image
          src={tomatoEmpty}
          alt=""
          width={172}
          height={130}
          sizes="172px"
          className="h-full w-full object-cover object-[center_-34.254px]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent from-[77.31%] to-surface-primary to-[92.81%]" />
      </div>
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
      {action}
    </div>
  );
}
