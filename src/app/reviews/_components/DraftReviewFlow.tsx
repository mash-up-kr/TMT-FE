"use client";

import type { ReactNode } from "react";
import { useGetSave } from "@/api/gen/save/save.gen";
import { MOCK_USER_ID } from "../_constants/mockUser";
import { draftReviewBasePath } from "../_constants/steps";
import { mapSaveDetailToDraft } from "../_utils/reviewApiMappers";
import { ReviewFlowShell } from "./ReviewFlowShell";

const LOADING_MESSAGE = "저장한 리뷰를 불러오는 중이에요";
const ERROR_MESSAGE = "저장한 리뷰를 불러오지 못했어요. 잠시 후 다시 시도해 주세요";

function FlowMessage({
  tone = "default",
  children,
}: Readonly<{ tone?: "default" | "error"; children: ReactNode }>) {
  return (
    <main className="content-container flex flex-1 items-center justify-center">
      <p
        role="status"
        className={
          tone === "error"
            ? "text-center text-body-md-medium text-content-error"
            : "text-center text-body-md-medium text-content-tertiary"
        }
      >
        {children}
      </p>
    </main>
  );
}

/**
 * 이어쓰기 진입. 서버 초안을 읽어 플로우의 초기값으로 넘긴다.
 *
 * 응답을 받기 전에는 단계를 그리지 않는다. 초안 가드가 "매장이 없으면 1단계로" 판정하기 때문에,
 * 로딩 중에 단계를 먼저 그리면 아직 도착하지 않은 매장을 없는 것으로 보고 되돌려 버린다.
 */
export function DraftReviewFlow({
  draftId,
  children,
}: Readonly<{ draftId: string; children: ReactNode }>) {
  const save = useGetSave(draftId, { userId: MOCK_USER_ID });

  if (save.isPending) {
    return <FlowMessage>{LOADING_MESSAGE}</FlowMessage>;
  }

  if (save.isError) {
    return <FlowMessage tone="error">{ERROR_MESSAGE}</FlowMessage>;
  }

  return (
    <ReviewFlowShell
      basePath={draftReviewBasePath(draftId)}
      initialDraft={mapSaveDetailToDraft(save.data)}
    >
      {children}
    </ReviewFlowShell>
  );
}
