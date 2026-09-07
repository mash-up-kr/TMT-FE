"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { RetryNotice } from "@/shared/ui/RetryNotice";
import { Skeleton } from "@/shared/ui/Skeleton";

type ProfileQueryFallbackProps = {
  query: Pick<UseQueryResult, "isError" | "refetch">;
  errorMessage: string;
};

export function ProfileQueryFallback({ query, errorMessage }: ProfileQueryFallbackProps) {
  if (query.isError) {
    return <RetryNotice message={errorMessage} onRetry={() => query.refetch()} />;
  }

  return <ProfileTabSkeleton />;
}

const SKELETON_ROWS = [0, 1, 2];

function ProfileTabSkeleton() {
  return (
    <div aria-busy="true" className="content-container flex flex-col gap-ds-12 py-ds-16">
      {SKELETON_ROWS.map((row) => (
        <Skeleton key={row} className="h-[80px]" />
      ))}
    </div>
  );
}
