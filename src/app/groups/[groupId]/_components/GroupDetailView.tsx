"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ReviewCard } from "@/shared/components/ReviewCard/ReviewCard";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/Button";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { ChevronLeftIcon } from "@/shared/ui/Icons";
import type { GroupJoinAction, GroupJoinInfo, GroupReviewListState } from "../_model/groupDetail";
import { GroupProfile, type GroupProfileData } from "./GroupProfile";
import { GroupTicketShortageSheet } from "./GroupTicketShortageSheet";
import { JoinGroupTicketSheet } from "./JoinGroupTicketSheet";

export type GroupDetailViewData = GroupProfileData & {
  availableTicketCount: number;
  isJoinable: boolean;
  isMember: boolean;
};

type GroupDetailViewProps = {
  group: GroupDetailViewData;
  reviewList: GroupReviewListState;
  joinAction: GroupJoinAction;
};

export function GroupDetailView({ group, reviewList, joinAction }: GroupDetailViewProps) {
  const router = useRouter();
  const [isJoinSheetOpen, setIsJoinSheetOpen] = useState(false);
  const isNonMember = !group.isMember;

  const sheetJoinAction: GroupJoinAction = {
    ...joinAction,
    onJoin: async () => {
      const didJoin = await joinAction.onJoin();

      if (didJoin) {
        setIsJoinSheetOpen(false);
      }

      return didJoin;
    },
  };

  const groupJoinInfo: GroupJoinInfo = {
    name: group.name,
    imageUrl: group.imageUrl,
    availableTicketCount: group.availableTicketCount,
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface-secondary">
      <GNB
        title={group.name}
        className="shrink-0"
        left={
          <IconButton aria-label="뒤로 가기" onClick={() => router.back()}>
            <ChevronLeftIcon size={28} />
          </IconButton>
        }
      />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <GroupProfile group={group} />
        <GroupReviewList isContentRestricted={isNonMember} reviewList={reviewList} />
      </main>

      {isNonMember && <JoinGate onJoin={() => setIsJoinSheetOpen(true)} />}

      {isNonMember &&
        (group.isJoinable ? (
          <JoinGroupTicketSheet
            open={isJoinSheetOpen}
            onOpenChangeAction={setIsJoinSheetOpen}
            group={groupJoinInfo}
            joinAction={sheetJoinAction}
          />
        ) : (
          <GroupTicketShortageSheet
            open={isJoinSheetOpen}
            onOpenChangeAction={setIsJoinSheetOpen}
            onWriteReviewAction={() => router.push(ROUTES.REVIEWS.NEW)}
            group={groupJoinInfo}
          />
        ))}
    </div>
  );
}

type GroupReviewListProps = {
  isContentRestricted: boolean;
  reviewList: GroupReviewListState;
};

function GroupReviewList({ isContentRestricted, reviewList }: GroupReviewListProps) {
  return (
    <section className="mt-ds-4" aria-label="그룹 리뷰">
      <h2 className="sr-only">그룹 리뷰</h2>
      <ul className="flex flex-col gap-ds-4">
        {reviewList.reviews.map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} isContentRestricted={isContentRestricted} />
          </li>
        ))}
        {reviewList.hasNextPage ? (
          <li className="px-ds-20 pb-ds-20">
            <Button
              className="w-full"
              variant="tertiary"
              loading={reviewList.isFetchingNextPage}
              onClick={reviewList.onLoadMore}
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
