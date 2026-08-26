"use client";

import { useQuery } from "@tanstack/react-query";
import { OTHER_USER } from "../_fixtures/profileFixtures";
import { toProfileIdentity, toProfileTabCounts } from "../_utils/profileMappers";
import { type ProfileSummary, resolveFixture } from "./profileQueries";

export function useUserProfileSummary(userId: string) {
  return useQuery({
    queryKey: ["profile", userId, "summary"],
    queryFn: async (): Promise<ProfileSummary> => {
      const response = await resolveFixture(OTHER_USER);
      return {
        profile: toProfileIdentity(response),
        counts: toProfileTabCounts(response),
      };
    },
  });
}
