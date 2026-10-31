"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { newReviewForGroupJoinPath } from "@/shared/constants/reviewJoinGroup";
import { ROUTES } from "@/shared/constants/routes";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { useLoginGate } from "@/shared/hooks/useLoginGate";
import { useReviewReturnTo } from "@/shared/hooks/useReviewEntryPath";
import { useUt2Step } from "@/shared/hooks/useUt2Step";
import { toast } from "@/shared/ui/Toast";
import type {
  GroupDetailViewData,
  GroupJoinAction,
  GroupJoinInfo,
  GroupJoinPreviewState,
  GroupLeaveAction,
} from "../_model/groupDetail";
import { useFirstReviewPrompt } from "./useFirstReviewPrompt";
import { useGroupReviewEntry } from "./useGroupReviewEntry";
import { useGroupShareEntry } from "./useGroupShareEntry";

type GroupDetailFlowOptions = {
  group: GroupDetailViewData;
  joinPreview: GroupJoinPreviewState;
  joinAction: GroupJoinAction;
  leaveAction: GroupLeaveAction;
  shouldPromptFirstReview: boolean;
};

/** 가입·탈퇴와 리뷰 진입 시트의 상태 및 후속 이동을 조율한다. */
export function useGroupDetailFlow({
  group,
  joinPreview,
  joinAction,
  leaveAction,
  shouldPromptFirstReview,
}: GroupDetailFlowOptions) {
  const router = useRouter();
  const loginGate = useLoginGate();
  const [isJoinSheetOpen, setIsJoinSheetOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);
  const isNonMember = !group.isMember;
  const reviewEntry = useGroupReviewEntry(group.id, {
    enabled: isNonMember && joinPreview.status !== "login-required",
  });
  const reviewReturnTo = useReviewReturnTo();
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

  const openJoin = () => {
    if (joinPreview.status === "login-required") {
      loginGate.redirectToLogin();
    } else {
      setIsJoinSheetOpen(true);
    }
  };
  const startWritingForTicket = () => {
    setIsJoinSheetOpen(false);
    reviewEntry.startWriting();
  };
  const writeFirstReview = () => {
    firstReviewPrompt.onOpenChange(false);
    writeNewReview();
  };
  const shareReviews = () => {
    setIsEntrySheetOpen(false);
    router.push(ROUTES.GROUPS.SHARE(group.id));
  };
  const writeFromEntry = () => {
    setIsEntrySheetOpen(false);
    writeNewReview();
  };

  return {
    isNonMember,
    joinSheet: {
      open: isJoinSheetOpen,
      onOpenChange: setIsJoinSheetOpen,
      onOpen: openJoin,
      preview: joinPreviewData,
      group: groupJoinInfo,
      action: sheetJoinAction,
      onWriteReview: startWritingForTicket,
      isWriteReviewPending: reviewEntry.isChecking,
    },
    leaveModal: {
      open: isLeaveModalOpen,
      onOpen: () => setIsLeaveModalOpen(true),
      onOpenChange: handleLeaveModalOpenChange,
      action: leaveModalAction,
    },
    reviewEntrySheet: {
      open: isEntrySheetOpen,
      onOpenChange: setIsEntrySheetOpen,
      onOpen: openReviewEntry,
      isChecking: shareEntry.isChecking,
      onShare: shareReviews,
      onWriteNew: writeFromEntry,
    },
    firstReviewPrompt: {
      ...firstReviewPrompt,
      onWriteReview: writeFirstReview,
    },
    continueSheet: reviewEntry.continueSheet,
  };
}
