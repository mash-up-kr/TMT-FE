"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Button } from "@/shared/ui/Button";

type ProfileScreenStatusProps = {
  query: Pick<UseQueryResult, "isPending" | "isError" | "refetch">;
  skeleton: ReactNode;
  errorMessage: string;
};

/** 첫 조회의 loading과 error만 가른다. 데이터가 있으면 호출부가 직접 그린다. */
export function ProfileScreenStatus({ query, skeleton, errorMessage }: ProfileScreenStatusProps) {
  if (query.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-ds-12 py-ds-48">
        <p className="text-body-md-medium text-content-tertiary">{errorMessage}</p>
        <Button variant="tertiary" size="md" onClick={() => query.refetch()}>
          다시 시도
        </Button>
      </div>
    );
  }

  return <>{skeleton}</>;
}
