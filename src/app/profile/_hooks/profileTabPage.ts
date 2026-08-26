import type {
  CursorPage,
  ProfileFavoriteResponse,
  ProfileGroupResponse,
  ProfileReviewResponse,
} from "../_fixtures/contract";
import type { ProfileTab, ProfileViewer } from "../_model/profile";
import {
  toProfileFavoriteItems,
  toProfileGroupItems,
  toProfileReviewItems,
} from "../_utils/profileMappers";
import type { ProfileTabPage } from "./profileQueries";

export type ProfileTabResponses = {
  reviews: CursorPage<ProfileReviewResponse>;
  groups: CursorPage<ProfileGroupResponse>;
  favorites: CursorPage<ProfileFavoriteResponse>;
};

/** 타인 프로필은 일치 수를 버린다. */
export function toProfileTabPage(
  tab: ProfileTab,
  responses: ProfileTabResponses,
  viewer: ProfileViewer,
): ProfileTabPage {
  switch (tab) {
    case "reviews":
      return { tab, items: toProfileReviewItems(responses.reviews.items) };
    case "groups":
      return {
        tab,
        items: toProfileGroupItems(responses.groups.items, {
          withMatchedCount: viewer === "mine",
        }),
      };
    case "favorites":
      return { tab, items: toProfileFavoriteItems(responses.favorites.items) };
  }
}
