"use client";

import { useUserProfile } from "@/api/gen/profile/profile.gen";
import type { ProfileSummary } from "../_model/profile";
import { toProfileSummary } from "../_utils/profileMappers";

export function useUserProfileSummary(userId: string) {
  return useUserProfile<ProfileSummary>(userId, { query: { select: toProfileSummary } });
}
