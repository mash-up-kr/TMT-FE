"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
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
import type { CompleteReviewStore } from "../../_model/store";
import { useReviewDraft } from "../../_stores/ReviewDraftProvider";
import { useReviewFlowReturnTo, useReviewFlowSaveId } from "../../_stores/ReviewFlowBaseProvider";
import { ReviewStepLayout } from "../ReviewStepLayout";
import { GroupJoinCompleteScreen } from "./GroupJoinCompleteScreen";

export function CompleteScreen() {
  const router = useRouter();
  const returnTo = useReviewFlowReturnTo();
  const saveId = useReviewFlowSaveId();
  const store = useReviewDraftGuard();
  const { saveResult } = useReviewDraft();
  const grantedTicketCount = saveResult?.grantedTicketCount ?? 0;
  const save = useGetSave(saveId ?? "", {
    query: { enabled: saveId !== null },
  });
  const isReviewCompleted = save.data?.reviewId !== null && save.data?.reviewId !== undefined;

  // 저장소는 서버 렌더에 없다. 마운트 뒤에 읽어 두 화면이 엇갈리지 않게 한다.
  const [joinGroupId, setJoinGroupId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    setJoinGroupId(saveId === null ? null : readJoinGroupForSave(saveId));
  }, [saveId]);

  // ⚠️ UT2 임시 계측. Task 1의 건너뛰기 제출에서도 이 화면을 거쳐 한 번 더 찍힌다.
  useUt2Step(UT2_STEPS.REVIEW_COMPLETE, isReviewCompleted);

  const closeComplete = () => {
    if (joinGroupId !== undefined && joinGroupId !== null) {
      clearJoinGroupIntent();
      router.replace(ROUTES.GROUPS.ROOT);
      return;
    }

    router.replace(returnTo);
  };

  if (joinGroupId === undefined) {
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

  // 그룹 가입 때문에 쓴 리뷰는 완성 여부와 무관하게 그 그룹으로 이어준다.
  if (joinGroupId !== null) {
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
