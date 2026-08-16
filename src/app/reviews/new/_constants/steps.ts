export const REVIEW_FLOW_BASE_PATH = "/reviews/new";

export const REVIEW_STEPS = [
  { segment: "store", name: "방문 매장" },
  { segment: "photos", name: "사진 등록" },
  { segment: "tags", name: "태그 선택" },
  { segment: "rating", name: "별점과 리뷰" },
] as const;

export type ReviewStepSegment = (typeof REVIEW_STEPS)[number]["segment"];

export const REVIEW_STEP_COUNT = REVIEW_STEPS.length;
