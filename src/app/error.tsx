"use client";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/Button";
import { getActiveBottomNav } from "@/shared/utils/bottomNavigationPolicy";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error: _error, reset }: AppErrorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { reset: resetQueries } = useQueryErrorResetBoundary();
  const showHomeButton = getActiveBottomNav(pathname) === null;

  function handleRetry() {
    resetQueries();
    reset();
  }

  function handleHome() {
    resetQueries();
    reset();
    router.push(ROUTES.ROOT);
  }

  return (
    <ScreenLayout header={null}>
      <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-ds-12">
        <p className="text-body-md-regular text-content-secondary">화면을 불러오지 못했어요.</p>
        <Button variant="primary" size="md" onClick={handleRetry}>
          다시 시도
        </Button>
        {showHomeButton ? (
          <Button variant="tertiary" size="md" onClick={handleHome}>
            홈으로
          </Button>
        ) : null}
      </div>
    </ScreenLayout>
  );
}
