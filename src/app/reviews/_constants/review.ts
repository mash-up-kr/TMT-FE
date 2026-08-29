// 리뷰 폼 설정 응답(PhotoConstraint.maxCount·maxBytes 등)이 같은 값을 내려주지만 전부 optional이라
// 폴백이 필요하고, 모든 단계가 그 응답을 기다리면 로딩이 플로우 전체로 번진다. 지금은 시안 값이 정본이다.
export const MAX_REVIEW_PHOTO_COUNT = 3;

export const MAX_REVIEW_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

export const REVIEW_PHOTO_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const REVIEW_PHOTO_ACCEPT = REVIEW_PHOTO_CONTENT_TYPES.join(",");

export const MAX_REVIEW_RATING = 5;

export const MAX_REVIEW_TEXT_LENGTH = 500;
