export const REVIEW_STEPS = ["store", "photos", "tags", "rating"] as const;

export type ReviewStepSegment = (typeof REVIEW_STEPS)[number];

export const REVIEW_ROUTE_SEGMENTS = [...REVIEW_STEPS, "complete"] as const;

export type ReviewRouteSegment = (typeof REVIEW_ROUTE_SEGMENTS)[number];

export const REVIEW_STEP_COUNT = REVIEW_STEPS.length;

export function isReviewRouteSegment(value: string): value is ReviewRouteSegment {
  return REVIEW_ROUTE_SEGMENTS.some((segment) => segment === value);
}

export const NEW_REVIEW_BASE_PATH = "/reviews/new";

export function draftReviewBasePath(draftId: string) {
  return `/reviews/drafts/${draftId}`;
}

export function reviewStepPath(basePath: string, segment: ReviewStepSegment) {
  return `${basePath}/${segment}`;
}

export function reviewCompletePath(basePath: string) {
  return `${basePath}/complete`;
}

export const REVIEW_FLOW_EXIT_PATH = "/";
