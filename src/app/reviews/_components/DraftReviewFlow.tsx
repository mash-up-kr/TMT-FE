"use client";

import type { ReactNode } from "react";
import { useGetSave } from "@/api/gen/save/save.gen";
import { cn } from "@/shared/utils/cn";
import { TEMP_USER_ID } from "../_constants/mockUser";
import { draftReviewBasePath } from "../_constants/steps";
import { mapSaveDetailToDraft } from "../_utils/reviewApiMappers";
import { ReviewFlowShell } from "./ReviewFlowShell";

const LOADING_MESSAGE = "저장한 리뷰를 불러오는 중이에요";
const ERROR_MESSAGE = "저장한 리뷰를 불러오지 못했어요. 잠시 후 다시 시도해 주세요";

/** 셸의 `main` 안에 놓이므로 스스로 landmark를 만들지 않는다. */
function FlowMessage({
  tone = "default",
  children,
}: Readonly<{ tone?: "default" | "error"; children: ReactNode }>) {
  return (
    <div className="content-container flex flex-1 items-center justify-center">
      <p
        role="status"
        className={cn(
          "text-center text-body-md-medium",
          tone === "error" ? "text-content-error" : "text-content-tertiary",
        )}
      >
        {children}
      </p>
    </div>
  );
}

/**
 * 이어쓰기 진입. 서버 초안을 읽어 플로우의 초기값으로 넘긴다.
 *
 * 상태를 셸 안에서 그린다. 밖에서 그리면 로딩·에러 화면에 GNB가 없어 사용자가 나갈 방법이 없다.
 *
 * 응답 전에는 단계를 그리지 않는다. 초안 가드가 "매장이 없으면 1단계로" 판정하기 때문에,
 * 로딩 중에 단계를 먼저 그리면 아직 도착하지 않은 매장을 없는 것으로 보고 되돌려 버린다.
 *
 * 에러를 여기서 그리는 것은 잠정이다. 프로젝트에 에러 경계가 생기면 초안 조회 실패는 그쪽으로
 * 올린다 — 초안이 없으면 이 화면 자체가 성립하지 않으므로 경계가 맡을 실패가 맞고, 지금은
 * "다시 시도해 주세요"라고 적어두고 재시도 수단이 없다. 옮길 때 두 가지가 함께 가야 한다.
 *
 * 1. 조회를 layout에서 page로 내린다. `error.tsx`는 같은 세그먼트의 layout에서 난 에러를 잡지
 *    않으므로, 조회가 layout에 있는 채로 올리면 경계가 셸 바깥에서 잡아 GNB 없는 화면이 된다.
 * 2. `throwOnError`는 `(error, query) => query.state.data === undefined` 형태여야 한다. 그냥
 *    켜면 재조회 실패까지 트리를 날려 아래 게이트가 지키는 편집 내용이 사라진다.
 *
 * 검색 시트의 실패는 올리지 않는다. 검색이 죽어도 직접 입력으로 진행할 수 있어야 해서
 * 실패 반경이 목록 안에 머물러야 한다.
 */
export function DraftReviewFlow({
  draftId,
  children,
}: Readonly<{ draftId: string; children: ReactNode }>) {
  const save = useGetSave(draftId, { userId: TEMP_USER_ID });

  /**
   * 판정 기준은 `isPending`·`isError`가 아니라 데이터 유무다. 이미 초안을 받아 사용자가 입력
   * 중인데 재조회가 실패하면, 에러로 갈라지는 순간 셸이 통째로 사라져 입력한 내용도 함께 날아간다.
   */
  const draft = save.data === undefined ? undefined : mapSaveDetailToDraft(save.data);

  return (
    <ReviewFlowShell
      /**
       * 초안이 도착하면 셸을 새로 마운트해야 한다. 두 분기가 같은 자리·같은 타입이라 key가 없으면
       * React가 로딩 때 만든 Provider를 그대로 재사용하는데, Provider는 `initialDraft`를 마운트
       * 시점에 한 번만 읽으므로 뒤늦게 도착한 초안이 영영 반영되지 않는다.
       *
       * 로딩 중에는 편집할 것이 없어 재마운트로 잃는 값도 없다.
       */
      key={draft === undefined ? "pending" : "ready"}
      basePath={draftReviewBasePath(draftId)}
      initialDraft={draft}
    >
      {draft === undefined ? (
        <FlowMessage tone={save.isError ? "error" : "default"}>
          {save.isError ? ERROR_MESSAGE : LOADING_MESSAGE}
        </FlowMessage>
      ) : (
        children
      )}
    </ReviewFlowShell>
  );
}
