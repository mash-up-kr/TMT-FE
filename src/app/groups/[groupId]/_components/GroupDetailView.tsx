"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import emptyMascot from "@/shared/components/assets/mascot-empty.png";
import { ContinueDraftSheet } from "@/shared/components/ContinueDraftSheet";
import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import {
  ReviewCard,
  type ReviewCardFavoriteAction,
} from "@/shared/components/ReviewCard/ReviewCard";
import { newReviewForGroupJoinPath } from "@/shared/constants/reviewJoinGroup";
import { ROUTES } from "@/shared/constants/routes";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { useReviewReturnTo } from "@/shared/hooks/useReviewEntryPath";
import { useReviewFavorites } from "@/shared/hooks/useReviewFavorites";
import { useUt2Step } from "@/shared/hooks/useUt2Step";
import { Button } from "@/shared/ui/Button";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { ChevronLeftIcon, LeaveGroupIcon, PlusIcon, SettingsIcon } from "@/shared/ui/Icons";
import { RetryNotice } from "@/shared/ui/RetryNotice";
import { Skeleton } from "@/shared/ui/Skeleton";
import { toast } from "@/shared/ui/Toast";
import { useFirstReviewPrompt } from "../_hooks/useFirstReviewPrompt";
import { useGroupReviewEntry } from "../_hooks/useGroupReviewEntry";
import { useGroupShareEntry } from "../_hooks/useGroupShareEntry";
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
import { GroupReviewEntrySheet } from "./GroupReviewEntrySheet";
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
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const favorite = useReviewFavorites(
    reviewList.status === "ready" ? reviewList.reviews : undefined,
  );
  const reviews = favorite.reviews ?? [];
  const isNonMember = !group.isMember;
  const reviewEntry = useGroupReviewEntry(group.id, { enabled: isNonMember });
  const reviewReturnTo = useReviewReturnTo();
  const shouldPromptFirstReview =
    group.isMember && reviewList.status === "ready" && reviewList.reviews.length === 0;
  const firstReviewPrompt = useFirstReviewPrompt(shouldPromptFirstReview);
  const joinPreviewData = joinPreview.status === "ready" ? joinPreview : null;
  // 비멤버는 가입 팝업이 `가입하기`로 뜰 때, 멤버는 `+`를 누를 때 공유할 리뷰가 있는지 본다.
  const shareEntry = useGroupShareEntry(group.id, {
    enabled: (isNonMember && joinPreviewData?.isJoinable === true) || group.isMember,
  });

  // ⚠️ UT2 임시 계측. 상세 진입은 2-1, 티켓이 없는 채로 가입 시트가 열리면 2-3이다.
  useUt2Step(UT2_STEPS.GROUP_DETAIL_ENTER);
  useUt2Step(
    UT2_STEPS.TICKET_INSUFFICIENT_SHEET,
    isJoinSheetOpen && isNonMember && joinPreviewData?.availableTicketCount === 0,
  );

  const sheetJoinAction: GroupJoinAction = {
    ...joinAction,
    isPending: joinAction.isPending || shareEntry.isChecking,
    onJoin: async () => {
      // 공유할 리뷰가 있으면 가입 전에 고르게 한다. 공유는 가입 요청에 함께 실어야 하므로
      // 가입은 그 화면이 맡고, 여기서는 아직 가입하지 않은 것으로 돌려준다.
      if (shareEntry.hasReviewsToShare) {
        setIsJoinSheetOpen(false);
        router.push(ROUTES.GROUPS.JOIN(group.id));
        return false;
      }

      // 성공·실패 안내는 useJoinGroup이 띄운다. 여기서는 시트만 정리한다.
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

  const writeNewReview = () => router.push(newReviewForGroupJoinPath(group.id, reviewReturnTo));
  // 공유할 내 리뷰가 없으면 고를 게 없다. 시트 없이 바로 새로 쓰기로 보낸다.
  const openReviewEntry = () => {
    if (shareEntry.hasReviewsToShare) {
      setIsEntrySheetOpen(true);
      return;
    }
    writeNewReview();
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-surface-secondary">
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
          favoriteAction={group.isMember ? favorite.favoriteAction : undefined}
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
            onWriteReviewAction={() => {
              setIsJoinSheetOpen(false);
              reviewEntry.startWriting();
            }}
            isWriteReviewPending={reviewEntry.isChecking}
            group={groupJoinInfo}
          />
        ))}

      {isNonMember && (
        <ContinueDraftSheet
          open={reviewEntry.continueSheet.open}
          onOpenChangeAction={reviewEntry.continueSheet.onOpenChange}
          onContinueAction={reviewEntry.continueSheet.continueDraft}
          secondaryAction={{ label: "새로 작성하기", onClick: reviewEntry.continueSheet.startNew }}
        />
      )}

      {group.isMember ? (
        <GroupLeaveModal
          open={isLeaveModalOpen}
          onOpenChangeAction={handleLeaveModalOpenChange}
          leaveAction={leaveModalAction}
        />
      ) : null}

      {shouldPromptFirstReview ? (
        <GroupFirstReviewSheet
          open={firstReviewPrompt.isOpen}
          onOpenChangeAction={firstReviewPrompt.onOpenChange}
          onWriteReviewAction={() => {
            firstReviewPrompt.onOpenChange(false);
            writeNewReview();
          }}
        />
      ) : null}

      {/* 피드의 전환 FAB과 같은 자리·모양이다. 시트는 body 끝에 포털되어 같은 z에서도 위에 그려진다.
          공유할 리뷰가 있는지 아직 모르는 동안은 눌러도 어디로 갈지 정할 수 없어 잠시 막는다. */}
      {group.isMember ? (
        <button
          type="button"
          aria-label="그룹에 리뷰 남기기"
          disabled={shareEntry.isChecking}
          onClick={openReviewEntry}
          className="absolute right-ds-20 bottom-ds-20 z-overlay rounded-ds-md bg-surface-interactive-secondary p-ds-8 text-icon-interactive-inverse"
        >
          <PlusIcon size={24} />
        </button>
      ) : null}

      {group.isMember ? (
        <GroupReviewEntrySheet
          open={isEntrySheetOpen}
          onOpenChangeAction={setIsEntrySheetOpen}
          onShareAction={() => {
            setIsEntrySheetOpen(false);
            router.push(ROUTES.GROUPS.SHARE(group.id));
          }}
          onWriteNewAction={() => {
            setIsEntrySheetOpen(false);
            writeNewReview();
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
          <EmptyNotice src={emptyMascot} title="아직 등록된 리뷰가 없어요.">
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
