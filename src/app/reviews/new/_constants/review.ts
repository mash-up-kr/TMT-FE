/**
 * 리뷰 입력 상한.
 *
 * 리뷰 폼 설정 endpoint가 `photo.maxCount` · `rating.max` · `content.maxLength`를 내려주지만
 * 전부 optional이라 폴백은 어차피 필요하고, 모든 단계가 그 응답을 기다리면 로딩 처리가
 * 플로우 전체로 번진다. 지금은 시안 값을 정본으로 둔다.
 */
export const MAX_REVIEW_PHOTO_COUNT = 3;

export const MAX_REVIEW_RATING = 5;

export const MAX_REVIEW_TEXT_LENGTH = 500;
