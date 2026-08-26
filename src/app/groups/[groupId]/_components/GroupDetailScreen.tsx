"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReviewCard, type ReviewCardData } from "@/shared/components/ReviewCard/ReviewCard";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/Button";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { ChevronLeftIcon, LogOutIcon } from "@/shared/ui/Icons";
import { GroupProfile, type GroupProfileData } from "./GroupProfile";
import { GroupTicketShortageSheet } from "./GroupTicketShortageSheet";
import { JoinGroupTicketSheet } from "./JoinGroupTicketSheet";

export type GroupDetailScreenData = GroupProfileData & {
  availableTicketCount: number;
  isJoinable: boolean;
  isMember: boolean;
};

type GroupDetailScreenProps = {
  group: GroupDetailScreenData;
  reviews: ReviewCardData[];
  hasNextReviewPage?: boolean;
  isFetchingNextReviewPage?: boolean;
  onLoadMoreReviews?: () => void;
};

export function GroupDetailScreen({
  group,
  reviews,
  hasNextReviewPage = false,
  isFetchingNextReviewPage = false,
  onLoadMoreReviews,
}: GroupDetailScreenProps) {
  const router = useRouter();
  const [isJoinSheetOpen, setIsJoinSheetOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface-secondary">
      <GNB
        title={group.name}
        className="shrink-0"
        left={
          <IconButton aria-label="그룹 목록으로 돌아가기" onClick={() => router.back()}>
            <ChevronLeftIcon size={28} />
          </IconButton>
        }
        right={
          group.isMember ? (
            <IconButton aria-label="그룹 탈퇴">
              <LogOutIcon size={28} />
            </IconButton>
          ) : undefined
        }
      />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <GroupProfile group={group} />
        <GroupReviewList
          isContentRestricted={!group.isMember}
          reviews={reviews}
          hasNextPage={hasNextReviewPage}
          isFetchingNextPage={isFetchingNextReviewPage}
          onLoadMore={onLoadMoreReviews}
        />
      </main>

      {!group.isMember ? <JoinGate onJoin={() => setIsJoinSheetOpen(true)} /> : null}

      {!group.isMember ? (
        group.isJoinable ? (
          <JoinGroupTicketSheet
            open={isJoinSheetOpen}
            onOpenChange={setIsJoinSheetOpen}
            onJoin={() => router.push(ROUTES.REVIEWS.NEW)}
            groupName={group.name}
            groupImageUrl={group.imageUrl}
            availableTicketCount={group.availableTicketCount}
          />
        ) : (
          <GroupTicketShortageSheet
            open={isJoinSheetOpen}
            onOpenChange={setIsJoinSheetOpen}
            onWriteReview={() => router.push(ROUTES.REVIEWS.NEW)}
            groupName={group.name}
            groupImageUrl={group.imageUrl}
            availableTicketCount={group.availableTicketCount}
          />
        )
      ) : null}
    </div>
  );
}

type GroupReviewListProps = {
  isContentRestricted: boolean;
  reviews: ReviewCardData[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore?: () => void;
};

function GroupReviewList({
  isContentRestricted,
  reviews,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: GroupReviewListProps) {
  return (
    <section className="mt-ds-4" aria-label="그룹 리뷰">
      <h2 className="sr-only">그룹 리뷰</h2>
      <ul className="flex flex-col gap-ds-4">
        {reviews.map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} isContentRestricted={isContentRestricted} />
          </li>
        ))}
        {hasNextPage && onLoadMore ? (
          <li className="px-ds-20 pb-ds-20">
            <Button
              className="w-full"
              variant="tertiary"
              loading={isFetchingNextPage}
              onClick={onLoadMore}
            >
              리뷰 더보기
            </Button>
          </li>
        ) : null}
      </ul>
    </section>
  );
}

function JoinGate({ onJoin }: { onJoin: () => void }) {
  return (
    <div className="shrink-0 border-t border-stroke-secondary bg-surface-primary px-ds-20 py-ds-12">
      <Button className="w-full" onClick={onJoin}>
        그룹 가입하고 리뷰 보러가기
      </Button>
    </div>
  );
}
