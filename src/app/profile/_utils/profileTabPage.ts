import type { CursorPageGroupCardResponse } from "@/api/gen/_model/cursorPageGroupCardResponse.gen";
import type { CursorPageMyReviewGridItem } from "@/api/gen/_model/cursorPageMyReviewGridItem.gen";
import type { CursorPagePlaceCardResponse } from "@/api/gen/_model/cursorPagePlaceCardResponse.gen";
import type { CursorPageUserReviewGridItem } from "@/api/gen/_model/cursorPageUserReviewGridItem.gen";
import type { ProfileTabPage, ProfileViewer } from "../_model/profile";
import {
  toProfileFavoriteItems,
  toProfileGroupItems,
  toProfileReviewItems,
} from "./profileMappers";

export function toReviewsTabPage(
  response: CursorPageMyReviewGridItem | CursorPageUserReviewGridItem,
): ProfileTabPage {
  return { tab: "reviews", items: toProfileReviewItems(response.items) };
}

/** 타인 프로필은 일치 수를 버린다. */
export function toGroupsTabPage(
  response: CursorPageGroupCardResponse,
  viewer: ProfileViewer,
): ProfileTabPage {
  return {
    tab: "groups",
    items: toProfileGroupItems(response.items, { withMatchedCount: viewer === "mine" }),
  };
}

export function toFavoritesTabPage(response: CursorPagePlaceCardResponse): ProfileTabPage {
  return { tab: "favorites", items: toProfileFavoriteItems(response.items) };
}
