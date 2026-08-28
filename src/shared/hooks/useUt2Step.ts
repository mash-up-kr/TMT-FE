"use client";

import { useEffect } from "react";
import { UT2_STEP_TAG_KEY, type Ut2Step } from "@/shared/constants/ut2";
import { setClarityTag } from "@/shared/utils/clarity";

/**
 * ⚠️ UT2 대비 임시 코드다. `shared/constants/ut2.ts`와 함께 지운다.
 *
 * 화면에 들어온 시점을 UT2 스텝으로 기록한다. 화면 전환이 아니라 특정 행동이 스텝인
 * 경우(캐러셀 스크롤, 필터 조작, 시트 열림)에는 이 훅 대신 `setUt2Step`을 그 지점에서
 * 직접 부른다.
 */
export function useUt2Step(step: Ut2Step, enabled = true): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    setClarityTag(UT2_STEP_TAG_KEY, step);
  }, [step, enabled]);
}

/** 행동 시점에 스텝을 기록한다. 같은 화면에서 여러 스텝이 갈릴 때 쓴다. */
export function setUt2Step(step: Ut2Step): void {
  setClarityTag(UT2_STEP_TAG_KEY, step);
}
