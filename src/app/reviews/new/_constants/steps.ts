export const REVIEW_FLOW_BASE_PATH = "/reviews/new";

export const REVIEW_STEPS = [
  { segment: "store", name: "방문 매장" },
  { segment: "photos", name: "사진 등록" },
  { segment: "tags", name: "태그 선택" },
  { segment: "rating", name: "별점과 리뷰" },
] as const;

export type ReviewStepSegment = (typeof REVIEW_STEPS)[number]["segment"];

export const REVIEW_STEP_COUNT = REVIEW_STEPS.length;

/** 완료 화면. 단계가 아니라 플로우의 끝이라 `REVIEW_STEPS`에 넣지 않는다. */
export const REVIEW_COMPLETE_PATH = `${REVIEW_FLOW_BASE_PATH}/complete`;

/**
 * 플로우를 벗어날 때 도착할 화면.
 *
 * 시안은 "사용자가 경험하던 이전 화면으로 이동"이라고 적었지만 `router.back()`은 그 뜻이 되지 않는다.
 * 단계마다 히스토리가 쌓여서 앞 단계로 돌아갈 뿐이고, layout이 리마운트되지 않아 초안도 남는다.
 */
export const REVIEW_FLOW_EXIT_PATH = "/";
