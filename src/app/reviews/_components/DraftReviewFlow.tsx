"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useGetSave } from "@/api/gen/save/save.gen";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { CancelIcon } from "@/shared/ui/Icons";
import { draftReviewBasePath } from "../_constants/steps";
import { isResumableSaveDetail, mapSaveDetailToDraft } from "../_utils/reviewApiMappers";
import { ReviewFlowShell } from "./ReviewFlowShell";
import { StatusMessage } from "./StatusMessage";

const LOADING_MESSAGE = "저장한 리뷰를 불러오는 중이에요";
const ERROR_MESSAGE = "저장한 리뷰를 불러오지 못했어요. 잠시 후 다시 시도해 주세요";
const PHOTO_DRAFT_MESSAGE = "사진이 있는 리뷰는 아직 이어 쓸 수 없어요";

export function DraftReviewFlow({
  draftId,
  children,
}: Readonly<{ draftId: string; children: ReactNode }>) {
  const save = useGetSave(draftId);

  const isCompleted = save.data?.reviewId !== null && save.data?.reviewId !== undefined;

  if (save.data !== undefined && !isCompleted && !isResumableSaveDetail(save.data)) {
    return <UnavailableDraft message={PHOTO_DRAFT_MESSAGE} />;
  }

  // isError가 아니라 data 유무로 가른다. 이미 초안을 받아 입력 중인데 재조회가 실패해도
  // 셸이 내려가지 않아야 입력한 내용이 남는다.
  const draft = save.data === undefined ? undefined : mapSaveDetailToDraft(save.data);

  return (
    <ReviewFlowShell
      // Provider는 initialDraft를 마운트 때만 읽는다. key 없이 같은 셸을 재사용하면 로딩 때 만든
      // Provider가 살아남아 뒤늦게 도착한 초안을 영영 반영하지 않는다.
      key={draft === undefined ? "pending" : "ready"}
      basePath={draftReviewBasePath(draftId)}
      saveId={draftId}
      initialDraft={draft}
    >
      {draft === undefined ? (
        <div className="content-container flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-ds-16">
            <StatusMessage tone={save.isError ? "error" : "default"}>
              {save.isError ? ERROR_MESSAGE : LOADING_MESSAGE}
            </StatusMessage>
            {save.isError && (
              <Button size="md" onClick={() => void save.refetch()}>
                다시 시도
              </Button>
            )}
          </div>
        </div>
      ) : (
        children
      )}
    </ReviewFlowShell>
  );
}

function UnavailableDraft({ message }: Readonly<{ message: string }>) {
  const router = useRouter();
  const exit = () => router.replace(ROUTES.PROFILE.ME_REVIEWS);

  return (
    <>
      <GNB
        title="리뷰 쓰기"
        right={
          <IconButton aria-label="이어쓰기 닫기" onClick={exit}>
            <CancelIcon thick />
          </IconButton>
        }
      />
      <main className="content-container flex min-h-0 flex-1 flex-col items-center justify-center gap-ds-16">
        <StatusMessage tone="error">{message}</StatusMessage>
        <ButtonStack>
          <Button onClick={exit}>마이페이지로 돌아가기</Button>
        </ButtonStack>
      </main>
    </>
  );
}
