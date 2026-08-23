import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import tomatoPencil from "./assets/tomato-pencil.png";

type EmptyNoticeProps = {
  title: string;
  children?: string;
  className?: string;
};

export function EmptyNotice({ title, children, className }: EmptyNoticeProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-ds-12 py-ds-32",
        className,
      )}
    >
      {/* 시안 실측값. 원본 비율(854×1024)을 유지한 채 위로 밀어 다리를 잘라내고,
          잘린 경계는 아래쪽 gradient로 배경에 녹인다. */}
      <div aria-hidden="true" className="relative h-[130px] w-[172px] shrink-0 overflow-hidden">
        <Image
          src={tomatoPencil}
          alt=""
          width={172}
          height={206}
          sizes="172px"
          className="absolute top-[-34.254px] left-0 w-full"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent from-[77.31%] to-surface-primary to-[92.81%]" />
      </div>
      <div className="flex flex-col gap-ds-4 text-center">
        <p className="text-heading-sm text-content-primary">{title}</p>
        {children ? <p className="text-body-md-regular text-content-tertiary">{children}</p> : null}
      </div>
    </div>
  );
}
