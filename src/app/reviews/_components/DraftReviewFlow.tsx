"use client";

import type { ReactNode } from "react";
import { useGetSave } from "@/api/gen/save/save.gen";
import { draftReviewBasePath } from "../_constants/steps";
import { mapSaveDetailToDraft } from "../_utils/reviewApiMappers";
import { ReviewFlowShell } from "./ReviewFlowShell";
import { StatusMessage } from "./StatusMessage";

const LOADING_MESSAGE = "저장한 리뷰를 불러오는 중이에요";
const ERROR_MESSAGE = "저장한 리뷰를 불러오지 못했어요. 잠시 후 다시 시도해 주세요";

export function DraftReviewFlow({
  draftId,
  children,
}: Readonly<{ draftId: string; children: ReactNode }>) {
  const save = useGetSave(draftId);

  // isError가 아니라 data 유무로 가른다. 이미 초안을 받아 입력 중인데 재조회가 실패해도
  // 셸이 내려가지 않아야 입력한 내용이 남는다.
  const draft = save.data === undefined ? undefined : mapSaveDetailToDraft(save.data);

  return (
    <ReviewFlowShell
      // Provider는 initialDraft를 마운트 때만 읽는다. key 없이 같은 셸을 재사용하면 로딩 때 만든
      // Provider가 살아남아 뒤늦게 도착한 초안을 영영 반영하지 않는다.
      key={draft === undefined ? "pending" : "ready"}
      basePath={draftReviewBasePath(draftId)}
      initialDraft={draft}
    >
      {draft === undefined ? (
        <div className="content-container flex flex-1 items-center justify-center">
          <StatusMessage tone={save.isError ? "error" : "default"}>
            {save.isError ? ERROR_MESSAGE : LOADING_MESSAGE}
          </StatusMessage>
        </div>
      ) : (
        children
      )}
    </ReviewFlowShell>
  );
}
