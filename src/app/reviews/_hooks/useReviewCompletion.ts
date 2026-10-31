"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGroupDetail } from "@/api/gen/group/group.gen";
import { useGetSave } from "@/api/gen/save/save.gen";
import { clearJoinGroupIntent, readJoinGroupForSave } from "@/shared/constants/reviewJoinGroup";
import { ROUTES } from "@/shared/constants/routes";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { useUt2Step } from "@/shared/hooks/useUt2Step";
import { useReviewDraft } from "../_stores/ReviewDraftProvider";
import { useReviewFlowReturnTo, useReviewFlowSaveId } from "../_stores/ReviewFlowBaseProvider";
import { useReviewDraftGuard } from "./useReviewDraftGuard";
import { useReviewMissingSteps } from "./useReviewMissingSteps";
import { useShareReviewToGroup } from "./useShareReviewToGroup";

/** 저장 결과와 그룹 가입 의도를 복원하고, 완료 후 공유와 복귀를 조율한다. */
export function useReviewCompletion() {
  const router = useRouter();
  const returnTo = useReviewFlowReturnTo();
  const saveId = useReviewFlowSaveId();
  const store = useReviewDraftGuard();
  const { saveResult } = useReviewDraft();
  const grantedTicketCount = saveResult?.grantedTicketCount ?? 0;
  const { missingSteps, nextStep } = useReviewMissingSteps();
  const save = useGetSave(saveId ?? "", {
    query: { enabled: saveId !== null },
  });
  const isReviewCompleted = save.data?.reviewId !== null && save.data?.reviewId !== undefined;

  // 저장소는 서버 렌더에 없다. 마운트 뒤에 읽어 두 화면이 엇갈리지 않게 한다.
  const [joinGroupId, setJoinGroupId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    setJoinGroupId(saveId === null ? null : readJoinGroupForSave(saveId));
  }, [saveId]);

  // 이미 가입한 그룹에서 쓰기 시작했는지 서버에 묻는다. 가입 전에 티켓을 벌러 온 흐름은
  // 미가입이라 여기서 갈린다. 진입 경로가 아니라 실제 가입 상태로 나누어야 어긋나지 않는다.
  const joinGroupDetail = useGroupDetail(joinGroupId ?? "", {
    query: { enabled: typeof joinGroupId === "string" },
  });
  const isJoinGroupMember = joinGroupDetail.data?.isMember === true;

  // 이미 멤버면 가입시킬 게 없다. 방금 쓴 리뷰를 그 그룹에 공유하는 것이 남은 일이다.
  useShareReviewToGroup({
    enabled: isJoinGroupMember,
    groupId: joinGroupId ?? null,
    reviewId: save.data?.reviewId ?? null,
  });

  // ⚠️ UT2 임시 계측. Task 1의 건너뛰기 제출에서도 이 화면을 거쳐 한 번 더 찍힌다.
  useUt2Step(UT2_STEPS.REVIEW_COMPLETE, isReviewCompleted);

  const closeComplete = () => {
    if (joinGroupId !== undefined && joinGroupId !== null) {
      clearJoinGroupIntent();
      // 이미 멤버면 가입할 그룹을 고르러 목록으로 갈 이유가 없다. 리뷰를 올린 그 그룹으로 돌아간다.
      router.replace(isJoinGroupMember ? ROUTES.GROUPS.DETAIL(joinGroupId) : ROUTES.GROUPS.ROOT);
      return;
    }

    router.replace(returnTo);
  };

  return {
    store,
    saveId,
    save,
    grantedTicketCount,
    missingSteps,
    nextStep,
    isReviewCompleted,
    joinGroupId,
    joinGroupDetail,
    isJoinGroupMember,
    closeComplete,
  };
}
