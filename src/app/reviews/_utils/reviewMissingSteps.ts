import type { SaveResultResponseMissingItem } from "@/api/gen/_model/saveResultResponseMissingItem.gen";
import type { ReviewMissingStep, ReviewMissingStepSegment } from "../_model/save";

/** 서버는 항목 단위로 알려주고 화면은 단계 단위로 안내한다. 사진은 티켓 조건이 아니라 여기 없다. */
const STEP_BY_ITEM = {
  COMPANION_TAG: "tags",
  POSITIVE_POINT_TAG: "tags",
  RATING: "rating",
  CONTENT: "rating",
} as const satisfies Record<SaveResultResponseMissingItem, ReviewMissingStepSegment>;

/** 안내 순서이자 이동 순서다. 첫 번째가 "이어서 채우기"가 향할 단계다. */
const MISSING_STEPS = [
  { step: "tags", label: "태그" },
  { step: "rating", label: "별점 · 후기" },
] as const satisfies readonly ReviewMissingStep[];

/** 서버가 내려준 미충족 항목. 성립 판정의 정본이다. */
export function toReviewMissingSteps(
  items: readonly SaveResultResponseMissingItem[],
): ReviewMissingStep[] {
  const steps = new Set<ReviewMissingStepSegment>(items.map((item) => STEP_BY_ITEM[item]));

  return MISSING_STEPS.filter((entry) => steps.has(entry.step));
}

/**
 * 저장 응답이 없을 때(새로고침·재진입) 쓰는 어림값.
 *
 * 성립 판정은 서버가 한다. 후기 최소 길이 같은 규칙은 계약(ContentConstraint)에 없어 프론트가
 * 알 수 없으므로, 여기서는 **비어 있는 단계만** 센다. 채워져 보이는데 서버가 아직 성립으로
 * 보지 않는 경우는 가려내지 못한다. 그때는 항목 없이 화면만 뜬다.
 */
export function toEmptyReviewSteps(
  isEmpty: Readonly<Record<ReviewMissingStepSegment, boolean>>,
): ReviewMissingStep[] {
  return MISSING_STEPS.filter((entry) => isEmpty[entry.step]);
}
