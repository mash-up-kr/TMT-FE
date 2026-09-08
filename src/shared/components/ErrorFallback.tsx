"use client";

import Link from "next/link";
import errorMascot from "@/shared/components/assets/mascot-empty.png";
import { MascotImage } from "@/shared/components/MascotImage";
import { Button, buttonStyles } from "@/shared/ui/Button";

type ErrorFallbackProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
  actionHref?: string;
  secondaryAction?: { label: string; onClick: () => void };
};

export function ErrorFallback({
  title = "화면을 표시할 수 없어요.",
  description = "잠시 후 다시 시도해 주세요.",
  actionLabel = "다시 시도",
  onRetry,
  actionHref,
  secondaryAction,
}: ErrorFallbackProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-ds-12 bg-surface-primary px-ds-20 py-ds-48">
      {/* 전역 오류 화면은 이미지 최적화 요청 없이 정적 에셋을 바로 표시한다. */}
      <MascotImage src={errorMascot} unoptimized />
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
      {secondaryAction ? (
        <Button variant="ghost" size="md" onClick={secondaryAction.onClick}>
          {secondaryAction.label}
        </Button>
      ) : null}
    </main>
  );
}
