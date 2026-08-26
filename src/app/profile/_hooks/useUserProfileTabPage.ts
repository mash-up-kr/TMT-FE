"use client";

import { useQuery } from "@tanstack/react-query";
import { OTHER_FAVORITES, OTHER_GROUPS, OTHER_REVIEWS } from "../_fixtures/profileFixtures";
import type { ProfileTab } from "../_model/profile";
import { type ProfileTabPage, resolveFixture } from "./profileQueries";
import { type ProfileTabResponses, toProfileTabPage } from "./profileTabPage";

const OTHER_TAB_RESPONSES: ProfileTabResponses = {
  reviews: OTHER_REVIEWS,
  groups: OTHER_GROUPS,
  favorites: OTHER_FAVORITES,
};

export function useUserProfileTabPage(userId: string, tab: ProfileTab) {
  return useQuery({
    queryKey: ["profile", userId, tab],
    queryFn: async (): Promise<ProfileTabPage> => {
      const responses = await resolveFixture(OTHER_TAB_RESPONSES);
      return toProfileTabPage(tab, responses, "other");
    },
  });
}
