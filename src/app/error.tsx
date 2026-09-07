"use client";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorFallback } from "@/shared/components/ErrorFallback";
import { ScreenLayout } from "@/shared/components/ScreenLayout";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error: _error, reset }: AppErrorProps) {
  const { reset: resetQueries } = useQueryErrorResetBoundary();

  function handleRetry() {
    resetQueries();
    reset();
  }

  return (
    <ScreenLayout header={null}>
      <ErrorFallback onRetry={handleRetry} />
    </ScreenLayout>
  );
}
