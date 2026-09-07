import { ROUTES } from "@/shared/constants/routes";

export const REVIEW_STEPS = ["store", "photos", "tags", "rating"] as const;

export type ReviewStepSegment = (typeof REVIEW_STEPS)[number];

/**
 * 초안 경로가 맡는 단계.
 *
 * 매장은 초안이 만들어지기 전 단계라 여기 없다. 매장을 고르고 다음으로 넘어갈 때 초안이
 * 생기고, 그때부터 경로가 초안 id를 갖는다.
 */
const DRAFT_REVIEW_STEPS = ["photos", "tags", "rating"] as const;

export const DRAFT_REVIEW_FIRST_STEP = DRAFT_REVIEW_STEPS[0];

const DRAFT_REVIEW_ROUTE_SEGMENTS = [...DRAFT_REVIEW_STEPS, "complete"] as const;

export type DraftReviewRouteSegment = (typeof DRAFT_REVIEW_ROUTE_SEGMENTS)[number];

export const REVIEW_STEP_COUNT = REVIEW_STEPS.length;

export function isDraftReviewRouteSegment(value: string): value is DraftReviewRouteSegment {
  return DRAFT_REVIEW_ROUTE_SEGMENTS.some((segment) => segment === value);
}

export const NEW_REVIEW_BASE_PATH = ROUTES.REVIEWS.NEW;

export function draftReviewBasePath(draftId: string) {
  return ROUTES.REVIEWS.DRAFT(draftId);
}

export function reviewStepPath(basePath: string, segment: ReviewStepSegment) {
  return `${basePath}/${segment}`;
}

export function reviewCompletePath(basePath: string) {
  return `${basePath}/complete`;
}

export const REVIEW_FLOW_EXIT_PATH = "/";
