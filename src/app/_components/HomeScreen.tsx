"use client";

import { useCurrentPosition } from "@/shared/hooks/useCurrentPosition";
import { LoadingIcon } from "@/shared/ui/Icons";
import { useHomeFeed } from "../_hooks/useHomeFeed";
import { useHomeSummary } from "../_hooks/useHomeSummary";
import { HomeShell } from "./HomeShell";
import { HomeView } from "./HomeView";

export function HomeScreen() {
  const { data, isPending, isError, refetch } = useHomeSummary();
  const hasGroups = (data?.myGroups.length ?? 0) > 0;
  const position = useCurrentPosition({ enabled: hasGroups });
  const feed = useHomeFeed(position);

  if (isPending) {
    return (
      <HomeShell>
        <output className="flex flex-1 items-center justify-center">
          <LoadingIcon className="animate-spin text-icon-tertiary" />
        </output>
      </HomeShell>
    );
  }

  if (isError) {
    return (
      <HomeShell>
        <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-ds-12">
          <p className="text-body-md-regular text-content-secondary">
            홈 정보를 불러오지 못했어요.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-body-md-bold text-content-interactive-primary"
          >
            다시 시도
          </button>
        </div>
      </HomeShell>
    );
  }

  const isFeedListVisible = hasGroups && (feed.data?.length ?? 0) > 0;

  return (
    <HomeShell hideNav={isFeedListVisible}>
      <HomeView
        summary={data}
        position={position}
        feedIsPending={feed.isPending}
        feedIsError={feed.isError}
        reviews={feed.data}
      />
    </HomeShell>
  );
}
