"use client";

import type { MyProfileResponse } from "@/api/gen/_model/myProfileResponse.gen";
import { useMe } from "@/api/gen/profile/profile.gen";
import type { ProfileSummary } from "../_model/profile";
import { toProfileIdentity, toProfileTabCounts } from "../_utils/profileMappers";

function toMyProfileSummary(response: MyProfileResponse): ProfileSummary {
  return {
    profile: toProfileIdentity(response),
    counts: toProfileTabCounts(response),
    availableTicketCount: response.availableTicketCount,
  };
}

export function useMyProfileSummary() {
  return useMe<ProfileSummary>({ query: { select: toMyProfileSummary } });
}
