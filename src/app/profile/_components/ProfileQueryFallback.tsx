"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { Button } from "@/shared/ui/Button";

type ProfileQueryFallbackProps = {
  query: Pick<UseQueryResult, "isError" | "refetch">;
  errorMessage: string;
};

/**
 * 첫 조회가 아직 데이터를 주지 않았을 때 그 자리에 놓인다.
 * 오류면 재시도 control을, 아니면 skeleton을 그린다. 데이터가 있으면 호출부가 직접 그린다.
 */
export function ProfileQueryFallback({ query, errorMessage }: ProfileQueryFallbackProps) {
  if (query.isError) {
    return (
      <div
        role="alert"
        className="flex flex-1 flex-col items-center justify-center gap-ds-12 py-ds-48"
      >
        <p className="text-body-md-medium text-content-tertiary">{errorMessage}</p>
        <Button variant="tertiary" size="md" onClick={() => query.refetch()}>
          다시 시도
        </Button>
      </div>
    );
  }

  return <ProfileTabSkeleton />;
}

const SKELETON_ROWS = [0, 1, 2];

function ProfileTabSkeleton() {
  return (
    <div aria-busy="true" className="content-container flex flex-col gap-ds-12 py-ds-16">
      {SKELETON_ROWS.map((row) => (
        <div key={row} className="h-[80px] animate-pulse rounded-ds-md bg-surface-secondary" />
      ))}
    </div>
  );
}
