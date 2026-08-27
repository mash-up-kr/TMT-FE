import { PROFILE_TABS, type ProfileTab } from "../_model/profile";

export function parseProfileTab(value: string): ProfileTab | null {
  return PROFILE_TABS.find((tab) => tab === value) ?? null;
}
