"use client";

import Link from "next/link";
import dummyProfile from "@/shared/assets/dummy-profile.png";
import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import { userProfilePath } from "@/shared/constants/routes";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { MembersIcon, ReviewsIcon } from "@/shared/ui/Icons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { RetryNotice } from "@/shared/ui/RetryNotice";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useUserRankings } from "../_hooks/useUserRankings";
import type { RankRow } from "../_model/rank";
import { toRankRows } from "../_utils/rankMapper";

/** 이 순위까지는 배지로 띄운다. 그 아래는 숫자만 둔다. */
const TOP_RANK_LIMIT = 3;
const STAT_ICON_SIZE = 16;
const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f"] as const;

export function RankView() {
  const rankings = useUserRankings();

  if (rankings.isPending) {
    return <RankListSkeleton />;
  }

  if (rankings.isError) {
    return (
      <RetryNotice message="랭킹을 불러오지 못했어요." onRetry={() => void rankings.refetch()} />
    );
  }

  const rows = toRankRows(rankings.data.pages);

  if (rows.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-ds-20 py-[60px]">
        <EmptyNotice title="아직 랭킹이 없어요.">리뷰를 남기면 여기에 올라와요</EmptyNotice>
      </div>
    );
  }

  return (
    <section className="flex flex-col" aria-label="유저 랭킹">
      <h2 className="sr-only">유저 랭킹</h2>
      <ol className="flex flex-col">
        {rows.map((row) => (
          <RankRowItem key={row.userId} row={row} />
        ))}
      </ol>
      {rankings.hasNextPage ? (
        <div className="px-ds-20 py-ds-20">
          <Button
            className="w-full"
            variant="tertiary"
            loading={rankings.isFetchingNextPage}
            onClick={() => void rankings.fetchNextPage()}
          >
            더보기
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function RankRowItem({ row }: Readonly<{ row: RankRow }>) {
  return (
    <li className="border-stroke-secondary border-b bg-surface-primary">
      {/* 피드 리뷰 카드의 작성자 링크와 같다. 행 전체가 탭 영역이라 li가 아니라 링크가 레이아웃을 가진다. */}
      <Link
        href={userProfilePath(row.userId)}
        aria-label={`${row.nickname}님의 프로필`}
        className="flex items-center gap-ds-12 px-ds-20 py-ds-12 text-content-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-stroke-interactive-primary active:bg-surface-secondary"
      >
        {/* span에는 aria-label이 붙지 않는다. "위"를 숨겨 두어 숫자만 덜렁 읽히지 않게 한다. */}
        <span className="flex w-ds-32 shrink-0 justify-center">
          {row.rank <= TOP_RANK_LIMIT ? (
            <Badge size="xs">
              {row.rank}
              <span className="sr-only">위</span>
            </Badge>
          ) : (
            <span className="text-body-md-bold text-content-tertiary tabular-nums">
              {row.rank}
              <span className="sr-only">위</span>
            </span>
          )}
        </span>
        <ImageWithFallback
          src={row.profileImageUrl}
          fallbackSrc={dummyProfile}
          alt=""
          width={48}
          height={48}
          className="size-ds-48 shrink-0 rounded-ds-full object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-ds-4">
          <p className="truncate text-body-lg-bold text-content-primary">{row.nickname}</p>
          {/* GroupCard의 Stat과 같은 마크업이다. 멤버만 보이는 문구가 "N명"이라 무엇의 수인지
            드러나지 않아 읽히는 문구를 따로 준다. */}
          <ul className="flex gap-ds-12">
            <li className="flex items-center gap-ds-4 text-body-sm-medium text-content-tertiary">
              <ReviewsIcon size={STAT_ICON_SIZE} className="shrink-0" />
              {`리뷰 ${row.reviewCount}개`}
            </li>
            <li
              aria-label={`멤버 ${row.memberCount}명`}
              className="flex items-center gap-ds-4 text-body-sm-medium text-content-tertiary"
            >
              <MembersIcon size={STAT_ICON_SIZE} className="shrink-0" />
              {`${row.memberCount}명`}
            </li>
          </ul>
        </div>
      </Link>
    </li>
  );
}

function RankListSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-ds-12 bg-surface-primary px-ds-20 py-ds-20"
    >
      {SKELETON_KEYS.map((key) => (
        <Skeleton key={key} className="h-ds-64 w-full" />
      ))}
    </div>
  );
}
