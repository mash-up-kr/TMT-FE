import { ROUTES } from "@/shared/constants/routes";

export function toGroupHref(groupId: string): string {
  return ROUTES.GROUPS.DETAIL(groupId);
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
