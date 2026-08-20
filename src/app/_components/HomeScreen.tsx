"use client";

import { LoadingIcon } from "@/shared/ui/Icons";
import { useHomeSummary } from "../_hooks/useHomeSummary";
import { EmptyNotice } from "./EmptyNotice";
import { HomeFeed } from "./HomeFeed";
import { MyGroupList } from "./MyGroupList";

export function HomeScreen() {
  const { data, isPending, isError, refetch } = useHomeSummary();

  if (isPending) {
    return (
      <output className="flex flex-1 items-center justify-center">
        <LoadingIcon className="animate-spin text-icon-tertiary" />
      </output>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-ds-12">
        <p className="text-body-md-regular text-content-secondary">홈 정보를 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-body-md-bold text-content-interactive-primary"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-surface-secondary">
      <h1 className="truncate bg-surface-primary px-ds-20 py-ds-12 text-heading-lg text-content-primary">
        {data.nickname}님 안녕하세요
      </h1>

      <MyGroupList groups={data.myGroups} />

      {data.myGroups.length === 0 ? <EmptyFeed /> : <HomeFeed />}
    </main>
  );
}

function EmptyFeed() {
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-ds-12 bg-surface-primary px-ds-20 py-ds-20">
      <h2 className="text-heading-sm text-content-primary">최근 게시물</h2>
      <EmptyNotice title="아직 가입한 그룹이 없어요.">
        그룹에 가입하고 내 취향 가게 리뷰를 모아보세요!
      </EmptyNotice>
    </section>
  );
}
