"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { Button } from "@/shared/ui/Button";

type ProfileQueryFallbackProps = {
  query: Pick<UseQueryResult, "isError" | "refetch">;
  errorMessage: string;
};

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
