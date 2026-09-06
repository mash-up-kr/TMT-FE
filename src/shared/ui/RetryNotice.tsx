"use client";

import { Button } from "./Button";

type RetryNoticeProps = {
  message: string;
  onRetry: () => void;
};

export function RetryNotice({ message, onRetry }: RetryNoticeProps) {
  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-ds-12 py-ds-48"
    >
      <p className="text-body-md-medium text-content-tertiary">{message}</p>
      <Button variant="tertiary" size="md" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}
