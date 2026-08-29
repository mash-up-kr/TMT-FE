"use client";

import { useUserFavorites, useUserGroups, useUserReviews } from "@/api/gen/profile/profile.gen";
import type { ProfileTab, ProfileTabPage } from "../_model/profile";
import { toFavoritesTabPage, toGroupsTabPage, toReviewsTabPage } from "../_utils/profileTabPage";

/** hook은 조건부로 부를 수 없어 셋을 모두 걸고 활성 탭만 요청한다. */
export function useUserProfileTabPage(userId: string, tab: ProfileTab) {
  const reviews = useUserReviews<ProfileTabPage>(userId, undefined, {
    query: { enabled: tab === "reviews", select: toReviewsTabPage },
  });
  const groups = useUserGroups<ProfileTabPage>(userId, undefined, {
    query: {
      enabled: tab === "groups",
      select: (response) => toGroupsTabPage(response, "other"),
    },
  });
  const favorites = useUserFavorites<ProfileTabPage>(userId, undefined, {
    query: { enabled: tab === "favorites", select: toFavoritesTabPage },
  });

  switch (tab) {
    case "reviews":
      return reviews;
    case "groups":
      return groups;
    case "favorites":
      return favorites;
  }
}
