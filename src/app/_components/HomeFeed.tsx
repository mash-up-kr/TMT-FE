"use client";

import { useCurrentPosition } from "../_hooks/useCurrentPosition";
import { useHomeFeed } from "../_hooks/useHomeFeed";
import { EmptyNotice } from "./EmptyNotice";
import { ReviewCard } from "./ReviewCard";

export function HomeFeed() {
  const position = useCurrentPosition();
  const { data, isPending, isError } = useHomeFeed(position);

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-ds-4">
      <h2 className="bg-surface-primary px-ds-20 pt-ds-20 pb-ds-12 text-heading-sm text-content-primary">
        최근 게시물
      </h2>
      <FeedBody position={position} isPending={isPending} isError={isError} reviews={data} />
    </section>
  );
}

type FeedBodyProps = {
  position: ReturnType<typeof useCurrentPosition>;
  isPending: boolean;
  isError: boolean;
  reviews: ReturnType<typeof useHomeFeed>["data"];
};

function FeedBody({ position, isPending, isError, reviews }: FeedBodyProps) {
  if (position.status === "unavailable") {
    return (
      <FeedNotice title="위치를 확인할 수 없어요.">
        가까운 순으로 보여드리려면 위치 권한이 필요해요.
      </FeedNotice>
    );
  }

  if (position.status === "pending" || isPending) {
    return <FeedNotice title="게시물을 불러오는 중이에요." />;
  }

  if (isError) {
    return <FeedNotice title="게시물을 불러오지 못했어요." />;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <FeedNotice title="아직 올라온 게시물이 없어요.">
        그룹에 리뷰가 공유되면 여기에 모아드릴게요!
      </FeedNotice>
    );
  }

  return (
    <ul className="flex flex-1 flex-col gap-ds-4">
      {reviews.map((review) => (
        <li key={review.id}>
          <ReviewCard review={review} />
        </li>
      ))}
    </ul>
  );
}

type FeedNoticeProps = {
  title: string;
  children?: string;
};

function FeedNotice({ title, children }: FeedNoticeProps) {
  return (
    <EmptyNotice className="bg-surface-primary px-ds-20" title={title}>
      {children}
    </EmptyNotice>
  );
}
