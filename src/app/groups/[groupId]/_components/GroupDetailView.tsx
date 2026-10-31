"use client";

import { useRouter } from "next/navigation";
import emptyMascot from "@/shared/components/assets/mascot-empty.png";
import { ContinueDraftSheet } from "@/shared/components/ContinueDraftSheet";
import { EmptyNotice } from "@/shared/components/EmptyNotice/EmptyNotice";
import {
  ReviewCard,
  type ReviewCardFavoriteAction,
} from "@/shared/components/ReviewCard/ReviewCard";
import { ROUTES } from "@/shared/constants/routes";
import { useReviewFavorites } from "@/shared/hooks/useReviewFavorites";
import { useSafeBack } from "@/shared/hooks/useSafeBack";
import { Button } from "@/shared/ui/Button";
import { FloatingActionButton } from "@/shared/ui/FloatingActionButton";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { ChevronLeftIcon, LeaveGroupIcon, PlusIcon, SettingsIcon } from "@/shared/ui/Icons";
import { RetryNotice } from "@/shared/ui/RetryNotice";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useGroupDetailFlow } from "../_hooks/useGroupDetailFlow";
import type {
  GroupDetailViewData,
  GroupJoinAction,
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
  const goBack = useSafeBack();
  const favorite = useReviewFavorites(
    reviewList.status === "ready" ? reviewList.reviews : undefined,
  );
  const reviews = favorite.reviews ?? [];
  const shouldPromptFirstReview =
    group.isMember && reviewList.status === "ready" && reviewList.reviews.length === 0;
  const flow = useGroupDetailFlow({
    group,
    joinPreview,
    joinAction,
    leaveAction,
    shouldPromptFirstReview,
  });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-surface-secondary">
      <GNB
        title="그룹"
        className="shrink-0"
        left={
          <IconButton aria-label="뒤로 가기" onClick={goBack}>
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
            <IconButton aria-label="그룹 나가기" onClick={flow.leaveModal.onOpen}>
              <LeaveGroupIcon size={24} />
            </IconButton>
          ) : undefined
        }
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <GroupProfile group={group} />
        <GroupReviewList
          isContentRestricted={flow.isNonMember}
          isOwner={group.isOwner}
          reviewList={reviewList.status === "ready" ? { ...reviewList, reviews } : reviewList}
          favoriteAction={group.isMember ? favorite.favoriteAction : undefined}
        />
        {flow.isNonMember && joinPreview.status === "error" ? (
          <RetryNotice message="가입 정보를 불러오지 못했어요." onRetry={joinPreview.onRetry} />
        ) : null}
      </main>

      {flow.isNonMember &&
        (joinPreview.status !== "error" ? (
          <JoinGate
            disabled={joinPreview.status === "pending"}
            label={joinPreview.status === "pending" ? "가입 정보를 불러오는 중이에요" : undefined}
            onJoin={flow.joinSheet.onOpen}
          />
        ) : null)}

      {flow.isNonMember &&
        flow.joinSheet.preview &&
        (flow.joinSheet.preview.isJoinable ? (
          <JoinGroupTicketSheet
            open={flow.joinSheet.open}
            onOpenChangeAction={flow.joinSheet.onOpenChange}
            group={flow.joinSheet.group}
            joinAction={flow.joinSheet.action}
          />
        ) : (
          <GroupTicketShortageSheet
            open={flow.joinSheet.open}
            onOpenChangeAction={flow.joinSheet.onOpenChange}
            onWriteReviewAction={flow.joinSheet.onWriteReview}
            isWriteReviewPending={flow.joinSheet.isWriteReviewPending}
            group={flow.joinSheet.group}
          />
        ))}

      {flow.isNonMember && (
        <ContinueDraftSheet
          open={flow.continueSheet.open}
          onOpenChangeAction={flow.continueSheet.onOpenChange}
          onContinueAction={flow.continueSheet.continueDraft}
          secondaryAction={{
            label: "새로 작성하기",
            onClick: flow.continueSheet.startNew,
          }}
        />
      )}

      {group.isMember ? (
        <GroupLeaveModal
          open={flow.leaveModal.open}
          onOpenChangeAction={flow.leaveModal.onOpenChange}
          leaveAction={flow.leaveModal.action}
        />
      ) : null}

      {shouldPromptFirstReview ? (
        <GroupFirstReviewSheet
          open={flow.firstReviewPrompt.isOpen}
          onOpenChangeAction={flow.firstReviewPrompt.onOpenChange}
          onWriteReviewAction={flow.firstReviewPrompt.onWriteReview}
        />
      ) : null}

      {/* 피드의 전환 FAB과 같은 자리·모양이다. 시트는 body 끝에 포털되어 같은 z에서도 위에 그려진다.
          공유할 리뷰가 있는지 아직 모르는 동안은 눌러도 어디로 갈지 정할 수 없어 잠시 막는다. */}
      {group.isMember ? (
        <FloatingActionButton
          placement="standalone"
          aria-label="그룹에 리뷰 남기기"
          disabled={flow.reviewEntrySheet.isChecking}
          onClick={flow.reviewEntrySheet.onOpen}
        >
          <PlusIcon size={24} />
        </FloatingActionButton>
      ) : null}

      {group.isMember ? (
        <GroupReviewEntrySheet
          open={flow.reviewEntrySheet.open}
          onOpenChangeAction={flow.reviewEntrySheet.onOpenChange}
          onShareAction={flow.reviewEntrySheet.onShare}
          onWriteNewAction={flow.reviewEntrySheet.onWriteNew}
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
