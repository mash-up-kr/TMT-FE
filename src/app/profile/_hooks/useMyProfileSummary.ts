"use client";

import { useMe } from "@/api/gen/profile/profile.gen";
import type { ProfileSummary } from "../_model/profile";
import { toProfileSummary } from "../_utils/profileMappers";

export function useMyProfileSummary() {
  return useMe<ProfileSummary>({ query: { select: toProfileSummary } });
}
