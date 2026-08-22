"use client";

import { LoadingIcon } from "@/shared/ui/Icons";
import { useCurrentPosition } from "../_hooks/useCurrentPosition";
import { useHomeFeed } from "../_hooks/useHomeFeed";
import { useHomeSummary } from "../_hooks/useHomeSummary";
import { EmptyNotice } from "./EmptyNotice";
import { HomeFeed } from "./HomeFeed";
import { HomeShell } from "./HomeShell";
import { MyGroupList } from "./MyGroupList";

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
      <main className="flex flex-1 flex-col bg-surface-secondary">
        <h1 className="truncate bg-surface-primary px-ds-20 py-ds-12 text-heading-lg text-content-primary">
          {data.nickname}님 안녕하세요
        </h1>

        <MyGroupList groups={data.myGroups} />

        {hasGroups ? (
          <HomeFeed
            position={position}
            isPending={feed.isPending}
            isError={feed.isError}
            reviews={feed.data}
          />
        ) : (
          <EmptyFeed />
        )}
      </main>
    </HomeShell>
  );
}

function EmptyFeed() {
  return (
    <section className="mt-ds-4 flex min-h-0 flex-1 flex-col gap-ds-12 bg-surface-primary px-ds-20 py-ds-20">
      <h2 className="text-heading-sm text-content-primary">최근 게시물</h2>
      <EmptyNotice title="아직 가입한 그룹이 없어요.">
        그룹에 가입하고 내 취향 가게 리뷰를 모아보세요!
      </EmptyNotice>
    </section>
  );
}
