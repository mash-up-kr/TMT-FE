"use client";

import { useQuery } from "@tanstack/react-query";
import { MY_FAVORITES, MY_GROUPS, MY_REVIEWS } from "../_fixtures/profileFixtures";
import type { ProfileTab } from "../_model/profile";
import { type ProfileTabPage, resolveFixture } from "./profileQueries";
import { type ProfileTabResponses, toProfileTabPage } from "./profileTabPage";

const MY_TAB_RESPONSES: ProfileTabResponses = {
  reviews: MY_REVIEWS,
  groups: MY_GROUPS,
  favorites: MY_FAVORITES,
};

export function useMyProfileTabPage(tab: ProfileTab) {
  return useQuery({
    queryKey: ["profile", "me", tab],
    queryFn: async (): Promise<ProfileTabPage> => {
      const responses = await resolveFixture(MY_TAB_RESPONSES);
      return toProfileTabPage(tab, responses, "mine");
    },
  });
}
