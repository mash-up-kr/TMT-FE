import { placeDetailPath, ROUTES } from "@/shared/constants/routes";
import { withReviewReturnTo } from "@/shared/utils/reviewNavigation";

export function toGroupHref(groupId: string): string {
  return ROUTES.GROUPS.DETAIL(groupId);
}

export function toPlaceHref(placeId: string): string {
  return placeDetailPath(placeId);
}

/** 티켓 이력의 `작성 중` 행이 가리키는 곳. 완성 전이라 리뷰 상세가 아니라 이어쓰기로 간다. */
export function toSaveHref(saveId: string, returnTo: string): string {
  return withReviewReturnTo(ROUTES.REVIEWS.DRAFT(saveId), returnTo);
}

export function toUserProfileHref(userId: string): string {
  return ROUTES.PROFILE.DETAIL.replace("[userId]", userId);
}
