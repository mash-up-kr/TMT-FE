export const REVIEW_STEPS = ["store", "photos", "tags", "rating"] as const;

export type ReviewStepSegment = (typeof REVIEW_STEPS)[number];

export const REVIEW_STEP_COUNT = REVIEW_STEPS.length;

/**
 * 플로우 진입 트리의 기준 경로.
 *
 * 새 리뷰와 이어쓰기는 단계 구성이 같고 기준 경로만 다르다. 경로를 만드는 쪽이 이 값을 받으면
 * 단계 이동 코드는 자기가 어느 트리에 있는지 몰라도 된다.
 */
export const NEW_REVIEW_BASE_PATH = "/reviews/new";

/** 단계 경로를 만드는 유일한 통로. 세그먼트가 타입이라 오타가 타입 에러로 잡힌다. */
export function reviewStepPath(basePath: string, segment: ReviewStepSegment) {
  return `${basePath}/${segment}`;
}

/** 완료 화면. 단계가 아니라 플로우의 끝이라 `REVIEW_STEPS`에 넣지 않는다. */
export function reviewCompletePath(basePath: string) {
  return `${basePath}/complete`;
}

/**
 * 플로우를 벗어날 때 도착할 화면.
 *
 * 시안은 "사용자가 경험하던 이전 화면으로 이동"이라고 적었지만 `router.back()`은 그 뜻이 되지 않는다.
 * 단계마다 히스토리가 쌓여서 앞 단계로 돌아갈 뿐이고, layout이 리마운트되지 않아 초안도 남는다.
 *
 * 트리와 무관하게 같은 곳으로 나가므로 기준 경로를 받지 않는다.
 */
export const REVIEW_FLOW_EXIT_PATH = "/";
