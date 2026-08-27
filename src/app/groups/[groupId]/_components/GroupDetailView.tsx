"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import { ReviewCard } from "@/shared/components/ReviewCard/ReviewCard";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/Button";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { ChevronLeftIcon, LeaveGroupIcon } from "@/shared/ui/Icons";
import { toast } from "@/shared/ui/Toast";
import type {
  GroupDetailViewData,
  GroupJoinAction,
  GroupJoinInfo,
  GroupLeaveAction,
  GroupReviewListState,
} from "../_model/groupDetail";
import { GroupFirstReviewSheet } from "./GroupFirstReviewSheet";
import { GroupLeaveModal } from "./GroupLeaveModal";
import { GroupProfile } from "./GroupProfile";
import { GroupTicketShortageSheet } from "./GroupTicketShortageSheet";
import { JoinGroupTicketSheet } from "./JoinGroupTicketSheet";

type GroupDetailViewProps = {
  group: GroupDetailViewData;
  reviewList: GroupReviewListState;
  joinAction: GroupJoinAction;
  leaveAction: GroupLeaveAction;
  initialFirstReviewSheetOpen?: boolean;
};

export function GroupDetailView({
  group,
  reviewList,
  joinAction,
  leaveAction,
  initialFirstReviewSheetOpen = false,
}: GroupDetailViewProps) {
  const router = useRouter();
  const [isJoinSheetOpen, setIsJoinSheetOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isFirstReviewSheetOpen, setIsFirstReviewSheetOpen] = useState(
    initialFirstReviewSheetOpen && group.isOwner && reviewList.reviews.length === 0,
  );
  const isNonMember = !group.isMember;

  const sheetJoinAction: GroupJoinAction = {
    ...joinAction,
    onJoin: async () => {
      const didJoin = await joinAction.onJoin();

      if (didJoin) {
        setIsJoinSheetOpen(false);
        toast.success("그룹 가입이 완료되었어요.");
      } else {
        toast.error("그룹 가입에 실패했어요. 다시 시도해 주세요.");
      }

      return didJoin;
    },
  };

  const groupJoinInfo: GroupJoinInfo = {
    name: group.name,
    imageUrl: group.imageUrl,
    availableTicketCount: group.availableTicketCount,
  };
  const leaveModalAction: GroupLeaveAction = {
    ...leaveAction,
    onLeaveAction: async () => {
      const result = await leaveAction.onLeaveAction();

      if (result.success) {
        setIsLeaveModalOpen(false);
        toast.success("그룹 탈퇴가 완료되었어요.");
        router.replace(ROUTES.GROUPS.ROOT);
      } else {
        toast.error(result.errorTitle ?? "그룹 탈퇴에 실패했어요. 다시 시도해 주세요.");
      }

      return result;
    },
  };
  const handleLeaveModalOpenChange = (open: boolean) => {
    if (!leaveAction.isPending) {
      setIsLeaveModalOpen(open);
    }
  };
  const handleFirstReviewSheetOpenChange = (open: boolean) => {
    setIsFirstReviewSheetOpen(open);

    if (!open && initialFirstReviewSheetOpen) {
      const url = new URL(window.location.href);
      url.searchParams.delete("created");
      window.history.replaceState(
        window.history.state,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface-secondary">
      <GNB
        title="그룹"
        className="shrink-0"
        left={
          <IconButton aria-label="뒤로 가기" onClick={() => router.back()}>
            <ChevronLeftIcon size={28} />
          </IconButton>
        }
        right={
          group.isMember ? (
            <IconButton aria-label="그룹 나가기" onClick={() => setIsLeaveModalOpen(true)}>
              <LeaveGroupIcon size={24} />
            </IconButton>
          ) : undefined
        }
      />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <GroupProfile group={group} />
        <GroupReviewList
          isContentRestricted={isNonMember}
          isOwner={group.isOwner}
          reviewList={reviewList}
        />
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

      {group.isMember ? (
        <GroupLeaveModal
          open={isLeaveModalOpen}
          onOpenChangeAction={handleLeaveModalOpenChange}
          leaveAction={leaveModalAction}
        />
      ) : null}

      {group.isOwner ? (
        <GroupFirstReviewSheet
          open={isFirstReviewSheetOpen}
          onOpenChangeAction={handleFirstReviewSheetOpenChange}
          onWriteReviewAction={() => {
            handleFirstReviewSheetOpenChange(false);
            router.push(ROUTES.REVIEWS.NEW);
          }}
        />
      ) : null}
    </div>
  );
}

type GroupReviewListProps = {
  isContentRestricted: boolean;
  isOwner: boolean;
  reviewList: GroupReviewListState;
};

function GroupReviewList({ isContentRestricted, isOwner, reviewList }: GroupReviewListProps) {
  if (reviewList.reviews.length === 0) {
    return isOwner ? (
      <section className="mt-ds-4 bg-surface-primary" aria-label="그룹 리뷰">
        <h2 className="sr-only">그룹 리뷰</h2>
        <EmptyNotice className="px-ds-20 py-[60px]" title="아직 등록된 리뷰가 없어요.">
          멤버들과 가게 리뷰를 공유해보세요!
        </EmptyNotice>
      </section>
    ) : null;
  }

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
