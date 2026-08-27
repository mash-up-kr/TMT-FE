"use client";

import { useQuery } from "@tanstack/react-query";
import { ME } from "../_fixtures/profileFixtures";
import { toProfileIdentity, toProfileTabCounts } from "../_utils/profileMappers";
import { type ProfileSummary, resolveFixture } from "./profileQueries";

export function useMyProfileSummary() {
  return useQuery({
    queryKey: ["profile", "me", "summary"],
    queryFn: async (): Promise<ProfileSummary> => {
      const response = await resolveFixture(ME);
      return {
        profile: toProfileIdentity(response),
        counts: toProfileTabCounts(response),
        availableTicketCount: response.availableTicketCount,
      };
    },
  });
}
