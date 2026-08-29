"use client";

import type { UserProfileResponse } from "@/api/gen/_model/userProfileResponse.gen";
import { useUserProfile } from "@/api/gen/profile/profile.gen";
import type { ProfileSummary } from "../_model/profile";
import { toProfileIdentity, toProfileTabCounts } from "../_utils/profileMappers";

function toUserProfileSummary(response: UserProfileResponse): ProfileSummary {
  return {
    profile: toProfileIdentity(response),
    counts: toProfileTabCounts(response),
  };
}

export function useUserProfileSummary(userId: string) {
  return useUserProfile<ProfileSummary>(userId, { query: { select: toUserProfileSummary } });
}
