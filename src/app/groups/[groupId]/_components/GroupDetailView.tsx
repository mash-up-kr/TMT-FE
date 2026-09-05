"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import {
  ReviewCard,
  type ReviewCardFavoriteAction,
} from "@/shared/components/ReviewCard/ReviewCard";
import { newReviewForGroupJoinPath } from "@/shared/constants/reviewJoinGroup";
import { ROUTES } from "@/shared/constants/routes";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { usePlaceFavorite } from "@/shared/hooks/usePlaceFavorite";
import { setUt2Step, useUt2Step } from "@/shared/hooks/useUt2Step";
import { Button } from "@/shared/ui/Button";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { ChevronLeftIcon, LeaveGroupIcon, SettingsIcon } from "@/shared/ui/Icons";
import { RetryNotice } from "@/shared/ui/RetryNotice";
import { Skeleton } from "@/shared/ui/Skeleton";
import { toast } from "@/shared/ui/Toast";
import type {
  GroupDetailViewData,
  GroupJoinAction,
  GroupJoinInfo,
  GroupJoinPreviewState,
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
  joinPreview: GroupJoinPreviewState;
  joinAction: GroupJoinAction;
  leaveAction: GroupLeaveAction;
};

export function GroupDetailView({
  group,
  reviewList,
  joinPreview,
  joinAction,
  leaveAction,
}: GroupDetailViewProps) {
  const router = useRouter();
  const [isJoinSheetOpen, setIsJoinSheetOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isFirstReviewSheetDismissed, setIsFirstReviewSheetDismissed] = useState(false);
  const [favoriteOverrides, setFavoriteOverrides] = useState<Record<string, boolean>>({});
  const favorite = usePlaceFavorite({
    onSuccessAction: (result) => {
      setFavoriteOverrides((current) => ({ ...current, [result.placeId]: result.isFavorite }));
    },
  });
  const isNonMember = !group.isMember;
  const reviews = useMemo(() => {
    if (reviewList.status !== "ready") {
      return [];
    }

    return reviewList.reviews.map((review) => {
      const isFavorite = favoriteOverrides[review.place.id];

      return isFavorite === undefined
        ? review
        : { ...review, place: { ...review.place, isFavorite } };
    });
  }, [favoriteOverrides, reviewList]);
  const favoriteAction: ReviewCardFavoriteAction = {
    isPending: favorite.isPending,
    onToggleAction: favorite.onToggleAction,
  };
  const shouldPromptFirstReview =
    group.isMember && reviewList.status === "ready" && reviewList.reviews.length === 0;
  const isFirstReviewSheetOpen = shouldPromptFirstReview && !isFirstReviewSheetDismissed;
  const joinPreviewData = joinPreview.status === "ready" ? joinPreview : null;

  // ⚠️ UT2 임시 계측. 상세 진입은 2-1, 티켓이 없는 채로 가입 시트가 열리면 2-3이다.
  useUt2Step(UT2_STEPS.GROUP_DETAIL_ENTER);
  useUt2Step(
    UT2_STEPS.TICKET_INSUFFICIENT_SHEET,
    isJoinSheetOpen && isNonMember && joinPreviewData?.availableTicketCount === 0,
  );

  const sheetJoinAction: GroupJoinAction = {
    ...joinAction,
    onJoin: async () => {
      const didJoin = await joinAction.onJoin();

      if (didJoin) {
        setIsJoinSheetOpen(false);
        // ⚠️ UT2 임시 계측.
        setUt2Step(UT2_STEPS.GROUP_JOIN_COMPLETE);
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
    availableTicketCount: joinPreviewData?.availableTicketCount ?? 0,
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
    setIsFirstReviewSheetDismissed(!open);
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
          group.isOwner ? (
            <IconButton
              aria-label="그룹 설정"
              onClick={() => router.push(ROUTES.GROUPS.EDIT(group.id))}
            >
              <SettingsIcon size={28} />
            </IconButton>
          ) : group.isMember ? (
            <IconButton aria-label="그룹 나가기" onClick={() => setIsLeaveModalOpen(true)}>
              <LeaveGroupIcon size={24} />
            </IconButton>
          ) : undefined
        }
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <GroupProfile group={group} />
        <GroupReviewList
          isContentRestricted={isNonMember}
          isOwner={group.isOwner}
          reviewList={reviewList.status === "ready" ? { ...reviewList, reviews } : reviewList}
          favoriteAction={group.isMember ? favoriteAction : undefined}
        />
        {isNonMember && joinPreview.status === "error" ? (
          <RetryNotice message="가입 정보를 불러오지 못했어요." onRetry={joinPreview.onRetry} />
        ) : null}
      </main>

      {isNonMember &&
        (joinPreview.status !== "error" ? (
          <JoinGate
            disabled={joinPreview.status === "pending"}
            label={joinPreview.status === "pending" ? "가입 정보를 불러오는 중이에요" : undefined}
            onJoin={() => setIsJoinSheetOpen(true)}
          />
        ) : null)}

      {isNonMember &&
        joinPreviewData &&
        (joinPreviewData.isJoinable ? (
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
            onWriteReviewAction={() => router.push(newReviewForGroupJoinPath(group.id))}
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

      {shouldPromptFirstReview ? (
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
  favoriteAction?: ReviewCardFavoriteAction;
};

function GroupReviewList({
  isContentRestricted,
  isOwner,
  reviewList,
  favoriteAction,
}: GroupReviewListProps) {
  if (reviewList.status === "pending") {
    return (
      <section
        className="mt-ds-4 flex flex-col gap-ds-12 bg-surface-primary px-ds-20 py-ds-20"
        aria-label="그룹 리뷰"
      >
        <Skeleton className="h-ds-64 w-full" />
        <Skeleton className="h-ds-64 w-full" />
      </section>
    );
  }

  if (reviewList.status === "error") {
    return (
      <section
        className="mt-ds-4 flex min-h-0 flex-1 flex-col bg-surface-primary"
        aria-label="그룹 리뷰"
      >
        <RetryNotice message="그룹 리뷰를 불러오지 못했어요." onRetry={reviewList.onRetry} />
      </section>
    );
  }

  if (reviewList.reviews.length === 0) {
    return isOwner ? (
      <section className="mt-ds-4 flex-1 bg-surface-primary" aria-label="그룹 리뷰">
        <h2 className="sr-only">그룹 리뷰</h2>
        <div className="flex items-center justify-center px-ds-20 py-[60px]">
          <EmptyNotice title="아직 등록된 리뷰가 없어요.">
            멤버들과 가게 리뷰를 공유해보세요!
          </EmptyNotice>
        </div>
      </section>
    ) : null;
  }

  return (
    <section className="mt-ds-4" aria-label="그룹 리뷰">
      <h2 className="sr-only">그룹 리뷰</h2>
      <ul className="flex flex-col gap-ds-4">
        {reviewList.reviews.map((review) => (
          <li key={review.id}>
            <ReviewCard
              review={review}
              isContentRestricted={isContentRestricted}
              favoriteAction={favoriteAction}
            />
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

function JoinGate({
  disabled = false,
  label = "그룹 가입하고 리뷰 보러가기",
  onJoin,
}: {
  disabled?: boolean;
  label?: string;
  onJoin: () => void;
}) {
  return (
    <div className="shrink-0 border-t border-stroke-secondary bg-surface-primary px-ds-20 py-ds-12">
      <Button className="w-full" disabled={disabled} onClick={onJoin}>
        {label}
      </Button>
    </div>
  );
}
