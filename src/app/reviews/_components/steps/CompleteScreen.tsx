"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useGroupDetail } from "@/api/gen/group/group.gen";
import { useGetSave } from "@/api/gen/save/save.gen";
import writingMascot from "@/shared/components/assets/mascot-writing.png";
import { clearJoinGroupIntent, readJoinGroupForSave } from "@/shared/constants/reviewJoinGroup";
import { ROUTES } from "@/shared/constants/routes";
import { UT2_STEPS } from "@/shared/constants/ut2";
import { useUt2Step } from "@/shared/hooks/useUt2Step";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon, MapPinIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";
import { REVIEW_FLOW_EXIT_PATH } from "../../_constants/steps";
import { useReviewDraftGuard } from "../../_hooks/useReviewDraftGuard";
import { useReviewMissingSteps } from "../../_hooks/useReviewMissingSteps";
import { useShareReviewToGroup } from "../../_hooks/useShareReviewToGroup";
import type { CompleteReviewStore } from "../../_model/store";
import { useReviewDraft } from "../../_stores/ReviewDraftProvider";
import { useReviewFlowReturnTo, useReviewFlowSaveId } from "../../_stores/ReviewFlowBaseProvider";
import { ReviewStepLayout } from "../ReviewStepLayout";
import { GroupJoinCompleteScreen } from "./GroupJoinCompleteScreen";
import { TicketPendingCompleteScreen } from "./TicketPendingCompleteScreen";

export function CompleteScreen() {
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

  // 가입 여부를 알기 전에 그리면 가입 화면을 띄웠다가 뒤늦게 바꾸게 된다. 정해질 때까지 기다린다.
  if (joinGroupId === undefined || (joinGroupId !== null && joinGroupDetail.isPending)) {
    return <ReviewCompleteLayout variant="pending" onClose={closeComplete} />;
  }

  if (store === null || saveId === null || !save.isSuccess) {
    return (
      <ReviewCompleteLayout
        variant={joinGroupId === null ? "review" : "group-join"}
        onClose={closeComplete}
      />
    );
  }

  // 그룹 가입 때문에 쓴 리뷰는 완성 여부와 무관하게 그 그룹으로 이어준다. 이미 멤버라면
  // 가입시킬 것도 티켓을 벌 이유도 없으므로 가입 화면들을 건너뛰고 보통의 완료 화면을 쓴다.
  if (joinGroupId !== null && !isJoinGroupMember) {
    // 티켓을 못 받았는데 "그룹 가입하기"를 띄우면 티켓 부족 시트 → 리뷰 작성 → 여기로 되돌아
    // 무한히 돈다. 남은 항목을 채우도록 유도하는 화면으로 대신 보낸다.
    //
    // 리뷰가 성립해야 티켓이 나가므로 서버가 준 reviewId가 곧 발급 여부다. 저장 응답과 달리
    // 이 값은 새로고침해도 남아, 완료 URL로 다시 들어와도 화면이 뒤바뀌지 않는다.
    if (!isReviewCompleted) {
      // 이어 쓸 초안이 남는다. 여기서 의도를 지우면 나중에 이어 썼을 때 이 그룹으로 못 돌아온다.
      const leaveToGroup = () => router.replace(ROUTES.GROUPS.DETAIL(joinGroupId));

      return (
        <ReviewCompleteLayout variant="group-join" onClose={leaveToGroup}>
          <TicketPendingCompleteScreen
            groupId={joinGroupId}
            missingSteps={missingSteps}
            nextStep={nextStep}
            onLeave={leaveToGroup}
          />
        </ReviewCompleteLayout>
      );
    }

    return (
      <ReviewCompleteLayout variant="group-join" onClose={closeComplete}>
        <GroupJoinCompleteScreen
          groupId={joinGroupId}
          reviewId={save.data?.reviewId ?? null}
          onLeave={closeComplete}
        />
      </ReviewCompleteLayout>
    );
  }

  return (
    <ReviewCompleteLayout variant="review" onClose={closeComplete}>
      <ReviewCompleteBody
        store={store}
        isReviewCompleted={isReviewCompleted}
        grantedTicketCount={grantedTicketCount}
      />
    </ReviewCompleteLayout>
  );
}

/** 완료 화면이 GNB와 본문의 배경을 함께 소유해 상단에 흰 띠가 생기지 않게 한다. */
function ReviewCompleteLayout({
  variant,
  onClose,
  children,
}: Readonly<{
  variant: "pending" | "group-join" | "review";
  onClose: () => void;
  children?: ReactNode;
}>) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        variant === "group-join" &&
          "bg-gradient-to-b from-surface-celebration to-surface-primary to-39%",
      )}
    >
      <GNB
        title={variant === "review" ? "완료" : null}
        className="shrink-0 bg-transparent"
        right={
          <IconButton aria-label="닫기" onClick={onClose}>
            <CancelIcon thick />
          </IconButton>
        }
      />
      {children}
    </div>
  );
}

function ReviewCompleteBody({
  store,
  isReviewCompleted,
  grantedTicketCount,
}: Readonly<{
  store: CompleteReviewStore;
  isReviewCompleted: boolean;
  grantedTicketCount: number;
}>) {
  const router = useRouter();

  return (
    <ReviewStepLayout
      className="items-center gap-ds-16 py-ds-48"
      footer={
        <ButtonStack type="horizontal">
          <Button variant="tertiary" onClick={() => router.replace(REVIEW_FLOW_EXIT_PATH)}>
            홈으로 가기
          </Button>
          <Button className="whitespace-nowrap" onClick={() => router.replace(ROUTES.FEED)}>
            다른 리뷰 보러가기
          </Button>
        </ButtonStack>
      }
    >
      <header className="flex flex-col items-center gap-ds-12">
        <h1 className="text-center text-heading-lg text-content-primary">
          {isReviewCompleted ? "리뷰 작성이" : "리뷰를"}
          <br />
          {isReviewCompleted ? "완료되었어요!" : "저장했어요!"}
        </h1>
        <p className="flex items-center gap-ds-4 text-body-lg-medium text-content-interactive-primary">
          <MapPinIcon size={20} />
          {store.name}
        </p>
        {grantedTicketCount > 0 ? (
          <p className="text-center text-body-md-medium text-content-secondary">
            그룹 가입 티켓 {grantedTicketCount}장을 받았어요
          </p>
        ) : null}
      </header>

      <Image
        src={writingMascot}
        alt=""
        priority
        sizes="220px"
        className="size-[220px] object-contain"
      />
    </ReviewStepLayout>
  );
}
