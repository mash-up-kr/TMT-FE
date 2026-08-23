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
      {/* 세로로 긴 원본(854×1024)을 가로 프레임에 담는다. 비율을 지킨 채 위를 기준으로
          맞춰 아래(다리)만 잘리게 하고, 잘린 경계는 gradient로 배경에 녹인다. */}
      <div aria-hidden="true" className="relative h-[130px] w-[172px] shrink-0">
        <Image
          src={tomatoPencil}
          alt=""
          width={172}
          height={130}
          sizes="172px"
          className="h-full w-full object-[center_-7px]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent from-[77.31%] to-surface-primary to-[92.81%]" />
      </div>
      <div className="flex flex-col gap-ds-4 text-center">
        <p className="text-heading-sm text-content-primary">{title}</p>
        {children ? (
          <p className="text-body-md-regular text-content-tertiary">
            {children}
          </p>
        ) : null}
      </div>
    </div>
  );
}
