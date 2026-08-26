import { ROUTES } from "@/shared/constants/routes";

/** 경로 상수의 동적 세그먼트를 채운다. 컴포넌트가 경로 문자열을 조립하지 않게 한다. */
export function toGroupHref(groupId: string): string {
  return ROUTES.GROUPS.DETAIL.replace("[groupId]", groupId);
}

export function toPlaceHref(placeId: string): string {
  return ROUTES.STORES.DETAIL.replace("[storeId]", placeId);
}

export function toSaveHref(saveId: string): string {
  return ROUTES.REVIEWS.DETAIL.replace("[saveId]", saveId);
}

export function toUserProfileHref(userId: string): string {
  return ROUTES.PROFILE.DETAIL.replace("[userId]", userId);
}

export function toTicketsHref(): string {
  return `${ROUTES.PROFILE.ME}/tickets`;
}
