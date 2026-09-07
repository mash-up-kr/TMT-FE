"use client";

import Link from "next/link";
import errorTomato from "@/shared/assets/error-tomato.png";
import { Button, buttonStyles } from "@/shared/ui/Button";

type ErrorFallbackProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
  actionHref?: string;
};

export function ErrorFallback({
  title = "화면을 표시할 수 없어요.",
  description = "잠시 후 다시 시도해 주세요.",
  actionLabel = "다시 시도",
  onRetry,
  actionHref,
}: ErrorFallbackProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-ds-12 bg-surface-primary px-ds-20 py-ds-48">
      <div aria-hidden="true" className="relative h-[130px] w-[172px] shrink-0">
        {/* biome-ignore lint/performance/noImgElement: global error에서도 Figma 원본을 그대로 렌더한다. */}
        <img
          src={errorTomato.src}
          alt=""
          width={172}
          height={130}
          className="size-full object-bottom"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent from-[77.31%] to-surface-primary to-[92.81%]" />
      </div>
      <div className="flex w-full flex-col gap-ds-4 text-center">
        <h1 className="text-heading-sm text-content-primary">{title}</h1>
        <p className="text-body-md-medium text-content-tertiary">{description}</p>
      </div>
      {actionHref ? (
        <Link href={actionHref} className={buttonStyles({ variant: "tertiary", size: "md" })}>
          {actionLabel}
        </Link>
      ) : (
        <Button variant="tertiary" size="md" onClick={onRetry}>
          {actionLabel}
        </Button>
      )}
    </main>
  );
}
